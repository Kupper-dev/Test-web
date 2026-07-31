import * as THREE from 'three';

export const GlassFlowConfig = {
  // Geometry parameters
  outerRadius: 22,             // Outer physical glass shell radius
  innerRadius: 15,             // Inner glowing liquid core radius
  tubularSegments: 1000,       // Ultra-dense subdivisions to eliminate quad-split artifacts
  radialSegments: 32,          // Radial subdivisions for smooth cross-section

  // Outer Glass Shell (THREE.MeshPhysicalMaterial)
  transmission: 0.95,
  roughness: 0.25,
  thickness: 1.5,
  ior: 1.45,
  glassColor: 0xdbeafe,        // Light translucent ice-blue tint

  // Inner Liquid Core Emission (HDR Bloom Trigger)
  coreColor: 0x0f3ce6,         // Rich ultramarine blue
  glowColor: 0x3b82f6,         // Royal blue highlight
  hdrIntensity: 2.2,           // Emission intensity > 1.0 for UnrealBloomPass
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

    // Dual-Mesh Architecture
    this.innerMesh = null;     // Inner glowing liquid core
    this.outerMesh = null;     // Outer physical frosted glass shell (tubeMesh)
    this.innerMaterial = null;
    this.outerMaterial = null;
    
    this.curve = null;
    this.animationFrameId = null;
    this.startTime = performance.now();

    this.init();
  }

  init() {
    this.setupScene();
    this.setupLighting();
    this.buildCurveFromSvg();
    this.createDualMeshes();
    this.addResizeListener();
  }

  // Alias for backward compatibility
  get tubeMesh() {
    return this.outerMesh;
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
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }

  setupLighting() {
    if (!this.scene) return;

    // Ensure ambient & directional lights exist for MeshPhysicalMaterial transmission
    if (!this.scene.getObjectByName('glassFlowAmbientLight')) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
      ambientLight.name = 'glassFlowAmbientLight';
      this.scene.add(ambientLight);
    }

    if (!this.scene.getObjectByName('glassFlowDirLight')) {
      const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
      dirLight.name = 'glassFlowDirLight';
      dirLight.position.set(200, 500, 300);
      this.scene.add(dirLight);
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

    // Single CatmullRomCurve3 instance shared by both inner and outer meshes
    this.curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');
  }

  createDualMeshes() {
    // ───────────────────────────────────────────────────────────────
    // 1. INNER LIQUID CORE MESH (HDR Emissive Stream)
    // ───────────────────────────────────────────────────────────────
    const innerGeometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      this.config.innerRadius,
      this.config.radialSegments,
      false
    );
    innerGeometry.computeVertexNormals();

    this.innerMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: this.config.progress },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uHdrIntensity: { value: this.config.hdrIntensity },
        uFlowSpeed: { value: this.config.flowSpeed },
        uFlowDirection: { value: this.config.flowDirection }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 uCoreColor;
        uniform vec3 uGlowColor;
        uniform float uHdrIntensity;
        uniform float uFlowSpeed;
        uniform float uFlowDirection;

        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          // GSAP Self-drawing scroll progress mask along path length (vUv.x goes 0 -> 1)
          float drawMask = smoothstep(vUv.x + 0.010, vUv.x - 0.005, uProgress);

          // Subtle continuous liquid movement along flow
          float flow = sin(vUv.x * 1.2 - uTime * uFlowSpeed * uFlowDirection) * 0.12 + 0.88;

          // Pure ultramarine blue color mix
          vec3 baseColor = mix(uCoreColor, uGlowColor, flow * 0.35);

          // Output HDR color intensity > 1.0 to trigger UnrealBloomPass
          vec3 hdrEmission = baseColor * uHdrIntensity * drawMask;

          gl_FragColor = vec4(hdrEmission, drawMask * 0.98);
        }
      `,
      transparent: true,
      depthWrite: true,
      side: THREE.FrontSide
    });

    this.innerMesh = new THREE.Mesh(innerGeometry, this.innerMaterial);
    this.innerMesh.renderOrder = 1;

    // ───────────────────────────────────────────────────────────────
    // 2. OUTER FROSTED GLASS SHELL MESH (THREE.MeshPhysicalMaterial)
    // ───────────────────────────────────────────────────────────────
    const outerGeometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      this.config.outerRadius,
      this.config.radialSegments,
      false
    );
    outerGeometry.computeVertexNormals();

    this.outerMaterial = new THREE.MeshPhysicalMaterial({
      transmission: this.config.transmission,
      roughness: this.config.roughness,
      thickness: this.config.thickness,
      ior: this.config.ior,
      transparent: true,
      opacity: 0.50,
      color: new THREE.Color(this.config.glassColor),
      attenuationColor: new THREE.Color(0x93c5fd),
      attenuationDistance: 50.0,
      side: THREE.FrontSide,
      depthWrite: false
    });

    this.outerMesh = new THREE.Mesh(outerGeometry, this.outerMaterial);
    this.outerMesh.renderOrder = 2; // Renders after inner mesh in depth/alpha order

    // Add both meshes to the scene
    if (this.scene) {
      this.scene.add(this.innerMesh);
      this.scene.add(this.outerMesh);
    }
  }

  update(progress) {
    if (progress !== undefined) {
      this.config.progress = progress;
    }

    // Update inner shader uniforms
    if (this.innerMaterial) {
      this.innerMaterial.uniforms.uTime.value = (performance.now() - this.startTime) / 1000;
      this.innerMaterial.uniforms.uProgress.value = this.config.progress;
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
    if (this.innerMaterial) {
      const u = this.innerMaterial.uniforms;
      if (newOptions.coreColor) u.uCoreColor.value.set(newOptions.coreColor);
      if (newOptions.glowColor) u.uGlowColor.value.set(newOptions.glowColor);
      if (newOptions.hdrIntensity !== undefined) u.uHdrIntensity.value = newOptions.hdrIntensity;
      if (newOptions.flowSpeed !== undefined) u.uFlowSpeed.value = newOptions.flowSpeed;
    }
    if (this.outerMaterial) {
      if (newOptions.transmission !== undefined) this.outerMaterial.transmission = newOptions.transmission;
      if (newOptions.roughness !== undefined) this.outerMaterial.roughness = newOptions.roughness;
      if (newOptions.thickness !== undefined) this.outerMaterial.thickness = newOptions.thickness;
      if (newOptions.ior !== undefined) this.outerMaterial.ior = newOptions.ior;
      if (newOptions.glassColor) this.outerMaterial.color.set(newOptions.glassColor);
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

      // Rebuild inner geometry
      if (this.innerMesh) {
        this.innerMesh.geometry.dispose();
        const newInnerGeom = new THREE.TubeGeometry(
          this.curve,
          this.config.tubularSegments,
          this.config.innerRadius,
          this.config.radialSegments,
          false
        );
        newInnerGeom.computeVertexNormals();
        this.innerMesh.geometry = newInnerGeom;
      }

      // Rebuild outer geometry
      if (this.outerMesh) {
        this.outerMesh.geometry.dispose();
        const newOuterGeom = new THREE.TubeGeometry(
          this.curve,
          this.config.tubularSegments,
          this.config.outerRadius,
          this.config.radialSegments,
          false
        );
        newOuterGeom.computeVertexNormals();
        this.outerMesh.geometry = newOuterGeom;
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

    if (this.innerMesh) {
      if (this.scene) this.scene.remove(this.innerMesh);
      this.innerMesh.geometry.dispose();
      this.innerMesh.material.dispose();
    }
    if (this.outerMesh) {
      if (this.scene) this.scene.remove(this.outerMesh);
      this.outerMesh.geometry.dispose();
      this.outerMaterial.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
