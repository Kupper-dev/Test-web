import * as THREE from 'three';

export const GlassFlowConfig = {
  // Geometry parameters
  tubeRadius: 20,
  tubularSegments: 1000,       // Ultra-dense subdivisions for smooth Bezier turns
  radialSegments: 32,          // Radial subdivisions for smooth cross-section

  // Colors
  coreColor: 0x0f3ce6,         // Ultramarine Blue core (#0f3ce6)
  glowColor: 0x2563eb,         // Royal Blue highlight (#2563eb)
  glassColor: 0xc7d2fe,        // Faint translucent ice-blue glass thickness (#c7d2fe)
  rimColor: 0xe0e7ff,          // Bright white/cyan Fresnel edge reflection (#e0e7ff)

  flowSpeed: 1.8,
  flowDirection: 1.0,

  // Animation & Timeline
  progress: 0.0
};

export class GlassFlowRenderer {
  constructor(canvasElement, options = {}) {
    if (typeof canvasElement === 'object' && !canvasElement.tagName) {
      options = canvasElement;
      canvasElement = null;
    }
    this.canvas = canvasElement;
    this.config = { ...GlassFlowConfig, ...options };
    
    this.scene = this.config.scene || null;
    this.camera = null;
    this.renderer = null;

    // Single Mesh Architecture
    this.tubeMesh = null;
    this.material = null;
    
    this.curve = null;
    this.animationFrameId = null;
    this.startTime = performance.now();

    this.init();
  }

  init() {
    this.setupScene();
    this.buildCurveFromSvg();
    this.createSingleMesh();
    this.addResizeListener();
  }

  setupScene() {
    if (this.scene) return; // Scene provided externally

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scene = new THREE.Scene();

    const fov = 45;
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 1, 2000);
    const depth = height / (2 * Math.tan((fov * Math.PI) / 360));
    this.camera.position.set(0, 0, depth);

    if (this.canvas) {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  buildCurveFromSvg() {
    const width = window.innerWidth;
    const mapSvgPoint = (svgX, svgY) => {
      const matScale = 0.575343;
      const tx = -1.37604;
      const ty = 282.597;
      const xTransformed = svgX * matScale + tx;
      const yTransformed = svgY * matScale + ty;
      const scale = width / 1920;
      const glX = xTransformed * scale;
      const glY = -yTransformed * scale;
      return new THREE.Vector3(glX, glY, 0);
    };

    const svgSegments = [
      { p0: [52.796, -439.037], cp1: [308.755, -437.397], cp2: [1571.89, -207.871], p1: [878.391, 680.295] },
      { p0: [878.391, 680.295], cp1: [358.606, 1345.99], cp2: [-355.117, 522.324], p1: [520.344, 117.153] },
      { p0: [520.344, 117.153], cp1: [1571.89, -369.513], cp2: [1036.56, 848.89], p1: [2006.41, 113.677] },
      { p0: [2006.41, 113.677], cp1: [2941.51, -595.185], cp2: [2030.75, 449.53], p1: [3169.2, 624.676] },
      { p0: [3169.2, 624.676], cp1: [3553.32, 683.771], cp2: [2913.7, 1318.17], p1: [2762.48, 1452.01] },
      { p0: [2762.48, 1452.01], cp1: [2319.53, 1844.05], cp2: [3276.96, 1973.44], p1: [3276.96, 1973.44] }
    ];

    const curvePoints = [];
    svgSegments.forEach(seg => {
      const p0 = mapSvgPoint(seg.p0[0], seg.p0[1]);
      const cp1 = mapSvgPoint(seg.cp1[0], seg.cp1[1]);
      const cp2 = mapSvgPoint(seg.cp2[0], seg.cp2[1]);
      const p1 = mapSvgPoint(seg.p1[0], seg.p1[1]);

      // Uniform spatial density proportional to Bezier chord length
      const approxLength = p0.distanceTo(cp1) + cp1.distanceTo(cp2) + cp2.distanceTo(p1);
      const steps = Math.max(40, Math.round(approxLength / 4));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const mt = 1 - t;
        const x = mt * mt * mt * p0.x + 3 * t * mt * mt * cp1.x + 3 * t * t * mt * cp2.x + t * t * t * p1.x;
        const y = mt * mt * mt * p0.y + 3 * t * mt * mt * cp1.y + 3 * t * t * mt * cp2.y + t * t * t * p1.y;

        if (i === 0 && curvePoints.length > 0) continue;
        curvePoints.push(new THREE.Vector3(x, y, 0));
      }
    });

    this.curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');
  }

  createSingleMesh() {
    const geometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      this.config.tubeRadius,
      this.config.radialSegments,
      false
    );
    geometry.computeVertexNormals();

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: this.config.progress },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uGlassColor: { value: new THREE.Color(this.config.glassColor) },
        uRimColor: { value: new THREE.Color(this.config.rimColor) },
        uFlowSpeed: { value: this.config.flowSpeed },
        uFlowDirection: { value: this.config.flowDirection }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uCoreColor;
        uniform vec3 uGlowColor;
        uniform vec3 uGlassColor;
        uniform vec3 uRimColor;
        uniform float uFlowSpeed;
        uniform float uFlowDirection;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          // Correct GLSL smoothstep argument order (edge0 < edge1) for scroll self-drawing
          float drawMask = smoothstep(vUv.x - 0.015, vUv.x + 0.005, uProgress);

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // viewDot: 1.0 at tube center axis facing camera, 0.0 at tube silhouettes
          float viewDot = abs(dot(normal, viewDir));

          // 1. The Core (Liquid): Dense ultramarine blue at center axis
          float coreMask = smoothstep(0.40, 0.90, viewDot);

          // 2. The Glass Thickness: Gap between liquid and outer glass wall
          float wallMask = clamp(smoothstep(0.10, 0.50, viewDot) - coreMask, 0.0, 1.0);

          // 3. The Outer Rim (Fresnel Reflection): Light catching absolute edge of glass tube
          float rimMask = 1.0 - smoothstep(0.0, 0.20, viewDot);

          // Smooth continuous fluid movement
          float flow = sin(vUv.x * 1.2 - uTime * uFlowSpeed * uFlowDirection) * 0.12 + 0.88;
          vec3 liquidColor = mix(uCoreColor, uGlowColor, flow * 0.35);

          // Zone Color Assignments
          vec3 coreRGB = liquidColor * coreMask * drawMask * 1.25;
          vec3 wallRGB = uGlassColor * wallMask * 0.45;
          vec3 rimRGB  = uRimColor * rimMask * 0.85;

          // Composite RGB
          vec3 finalRGB = coreRGB + wallRGB + rimRGB;

          // Composite Alpha (outer glass shell remains translucent, inner liquid core draws with uProgress)
          float finalAlpha = max(max(coreMask * drawMask * 0.95, wallMask * 0.40), rimMask * 0.85);

          gl_FragColor = vec4(finalRGB, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.NormalBlending
    });

    this.tubeMesh = new THREE.Mesh(geometry, this.material);
    this.tubeMesh.renderOrder = 1;

    if (this.scene) {
      this.scene.add(this.tubeMesh);
    }
  }

  update(progress) {
    if (progress !== undefined) {
      this.config.progress = progress;
    }

    if (this.material) {
      this.material.uniforms.uTime.value = (performance.now() - this.startTime) / 1000;
      this.material.uniforms.uProgress.value = this.config.progress;
    }

    if (this.renderer && this.scene && this.camera) {
      this.render();
    }
  }

  startAnimationLoop() {
    const loop = () => {
      this.update();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updateConfig(newOptions = {}) {
    Object.assign(this.config, newOptions);
    if (this.material) {
      const u = this.material.uniforms;
      if (newOptions.coreColor) u.uCoreColor.value.set(newOptions.coreColor);
      if (newOptions.glowColor) u.uGlowColor.value.set(newOptions.glowColor);
      if (newOptions.glassColor) u.uGlassColor.value.set(newOptions.glassColor);
      if (newOptions.rimColor) u.uRimColor.value.set(newOptions.rimColor);
      if (newOptions.flowSpeed !== undefined) u.uFlowSpeed.value = newOptions.flowSpeed;
    }
  }

  addResizeListener() {
    this.onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (this.camera) {
        this.camera.aspect = width / height;
        const fov = 45;
        const depth = height / (2 * Math.tan((fov * Math.PI) / 360));
        this.camera.position.set(0, 0, depth);
        this.camera.updateProjectionMatrix();
      }

      if (this.renderer) {
        this.renderer.setSize(width, height);
      }

      this.buildCurveFromSvg();

      if (this.tubeMesh) {
        this.tubeMesh.geometry.dispose();
        const newGeom = new THREE.TubeGeometry(
          this.curve,
          this.config.tubularSegments,
          this.config.tubeRadius,
          this.config.radialSegments,
          false
        );
        newGeom.computeVertexNormals();
        this.tubeMesh.geometry = newGeom;
      }
    };
    window.addEventListener('resize', this.onResize);
  }

  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    this.stopAnimationLoop();
    window.removeEventListener('resize', this.onResize);

    if (this.tubeMesh) {
      if (this.scene) this.scene.remove(this.tubeMesh);
      this.tubeMesh.geometry.dispose();
      this.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
