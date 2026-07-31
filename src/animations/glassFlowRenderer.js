import * as THREE from 'three';

export const GlassFlowConfig = {
  // Geometry parameters
  tubeRadius: 20,
  tubularSegments: 1000,       // Ultra-dense subdivisions for smooth Bezier turns
  radialSegments: 32,          // Radial subdivisions for smooth cross-section

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
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 20000);
    this.camera.updateProjectionMatrix();
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

      // Force Canvas CSS Transparency immediately
      this.renderer.domElement.style.background = 'transparent';
      this.renderer.domElement.style.backgroundColor = 'rgba(0,0,0,0)';
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
        uProgress: { value: this.config.progress }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          // 1. Scroll Draw Logic: Discard pixels ahead of the scroll progress
          if (vUv.x > uProgress) {
            discard;
          }

          // 2. View Angle Calculation
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float viewDot = abs(dot(normal, viewDir));

          // 3. Define the Three Visual Zones
          // Zone A: The Liquid Core (Facing camera)
          float coreMask = smoothstep(0.6, 1.0, viewDot);
          vec3 coreColor = vec3(0.0, 0.25, 1.0) * 1.5; // Vivid Ultramarine Blue (#0f3ce6)

          // Zone B: The Frosted Glass Wall (Mid-radius)
          float frostMask = smoothstep(0.2, 0.7, viewDot) - coreMask;
          vec3 frostColor = vec3(1.0, 1.0, 1.0); // Pure white frosted wall to prevent gray edges

          // Zone C: The Rim Highlight (Grazing edges)
          float rimMask = 1.0 - smoothstep(0.0, 0.3, viewDot);
          vec3 rimColor = vec3(1.0, 1.0, 1.0); // Bright white reflection

          // 4. Composite the Zones
          vec3 finalColor = (coreColor * coreMask) + (frostColor * frostMask * 0.6) + (rimColor * rimMask);
          
          // 5. Calculate Final Alpha (preserving glass transparency in the mid-section)
          float alpha = max(coreMask, frostMask * 0.4) + (rimMask * 0.5);

          // Safe GPU calculation for soft fade at the very tip of the flowing liquid
          float tipFade = clamp((uProgress - vUv.x) / 0.05, 0.0, 1.0);
          alpha *= tipFade;

          gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
        }
      `,


      depthTest: true,
      depthWrite: false,
      transparent: true,
      side: THREE.FrontSide,
      blending: THREE.NormalBlending
    });

    // Center geometry to origin to align layout coordinates perfectly
    geometry.computeBoundingBox();
    geometry.center();

    this.tubeMesh = new THREE.Mesh(geometry, this.material);
    this.tubeMesh.frustumCulled = false; // Disable culling so massive tube is not cut off
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
      if (newOptions.progress !== undefined) u.uProgress.value = newOptions.progress;
    }
  }

  addResizeListener() {
    this.onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (this.camera) {
        this.camera.aspect = width / height;
        const fov = 45;
        this.camera.far = 20000;
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
        newGeom.computeBoundingBox();
        newGeom.center();
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
