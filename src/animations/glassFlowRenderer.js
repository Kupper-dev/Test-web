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

    // Concentric Dual-Mesh Architecture
    this.coreMesh = null;
    this.glassMesh = null;
    this.tubeGroup = null;
    
    // Compatibility hooks for lusionAnimations.js
    this.innerMesh = null;
    this.outerMesh = null;
    this.tubeMesh = null;

    this.coreMaterial = null;
    this.glassMaterial = null;
    
    this.curve = null;
    this.animationFrameId = null;
    this.startTime = performance.now();

    this.init();
  }

  init() {
    this.setupScene();
    this.buildCurveFromSvg();
    this.createDualMesh();
    this.addResizeListener();
  }

  setupScene() {
    if (this.scene) {
      // Inject Scene Lighting directly into the active scene
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
      directionalLight.position.set(10, 20, 15);
      this.scene.add(directionalLight);
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(10, 20, 15);
    this.scene.add(directionalLight);

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

  createDualMesh() {
    this.tubeGroup = new THREE.Group();

    // 1. Generate the Inner Core (Liquid Blue Energy)
    const coreGeometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      8, // radius 8
      16,
      false
    );
    coreGeometry.computeVertexNormals();

    this.coreMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x000000), // Black base to prevent ambient washout
      emissive: new THREE.Color('#0f3ce6'), // Vivid Ultramarine Blue
      emissiveIntensity: 4.0, // High emission intensity to punch through glass transmission
      roughness: 0.2,
      metalness: 0.1,
      transparent: false // Must be false for outer transmission to capture & blur it
    });

    // Compile-time extension to inject scroll drawing (discard) logic
    this.coreMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uProgress = { value: this.config.progress };
      this.coreShader = shader;

      shader.fragmentShader = 'uniform float uProgress;\nvarying vec2 vUv;\n' + shader.fragmentShader;
      shader.vertexShader = 'varying vec2 vUv;\n' + shader.vertexShader.replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        vUv = uv;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `void main() {
        if (vUv.x > uProgress) {
          discard;
        }`
      );
    };

    this.coreMesh = new THREE.Mesh(coreGeometry, this.coreMaterial);
    this.coreMesh.frustumCulled = false;
    this.coreMesh.renderOrder = 0; // Draw first
    this.tubeGroup.add(this.coreMesh);

    // 2. Generate the Outer Glass Shell (The Cladding)
    const glassGeometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      20, // radius 20
      this.config.radialSegments,
      false
    );
    glassGeometry.computeVertexNormals();

    this.glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ffffff'),
      transmission: 1.0, // Glass transparency
      roughness: 0.25,   // Frosted glass blur effect (less chalky)
      clearcoat: 1.0,    // Sharp outer reflection layer
      clearcoatRoughness: 0.1,
      ior: 1.5,
      thickness: 2.0,
      attenuationColor: new THREE.Color('#0f3ce6'), // Volumetric blue bleed
      attenuationDistance: 5.0,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false, // Prevents transparent self-occlusion
      blending: THREE.NormalBlending
    });

    // Compile-time extension to inject scroll drawing (discard) logic
    this.glassMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uProgress = { value: this.config.progress };
      this.glassShader = shader;

      shader.fragmentShader = 'uniform float uProgress;\nvarying vec2 vUv;\n' + shader.fragmentShader;
      shader.vertexShader = 'varying vec2 vUv;\n' + shader.vertexShader.replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        vUv = uv;`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `void main() {
        if (vUv.x > uProgress) {
          discard;
        }`
      );
    };

    this.glassMesh = new THREE.Mesh(glassGeometry, this.glassMaterial);
    this.glassMesh.frustumCulled = false;
    this.glassMesh.renderOrder = 1; // Draw second, over the core
    this.tubeGroup.add(this.glassMesh);

    // Compatibility variables for parent scripts
    this.innerMesh = this.coreMesh;
    this.outerMesh = this.glassMesh;
    this.tubeMesh = this.tubeGroup;

    if (this.scene) {
      this.scene.add(this.tubeGroup);
    }
  }


  update(progress) {
    if (progress !== undefined) {
      this.config.progress = progress;
    }

    if (this.coreShader) {
      this.coreShader.uniforms.uProgress.value = this.config.progress;
    }
    if (this.glassShader) {
      this.glassShader.uniforms.uProgress.value = this.config.progress;
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
    if (newOptions.progress !== undefined) {
      if (this.coreShader) this.coreShader.uniforms.uProgress.value = newOptions.progress;
      if (this.glassShader) this.glassShader.uniforms.uProgress.value = newOptions.progress;
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

      if (this.coreMesh && this.glassMesh) {
        this.coreMesh.geometry.dispose();
        this.glassMesh.geometry.dispose();

        const newCoreGeom = new THREE.TubeGeometry(
          this.curve,
          this.config.tubularSegments,
          8,
          16,
          false
        );
        newCoreGeom.computeVertexNormals();
        this.coreMesh.geometry = newCoreGeom;

        const newGlassGeom = new THREE.TubeGeometry(
          this.curve,
          this.config.tubularSegments,
          20,
          this.config.radialSegments,
          false
        );
        newGlassGeom.computeVertexNormals();
        this.glassMesh.geometry = newGlassGeom;
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

    if (this.tubeGroup) {
      if (this.scene) this.scene.remove(this.tubeGroup);
    }
    if (this.coreMesh) this.coreMesh.geometry.dispose();
    if (this.glassMesh) this.glassMesh.geometry.dispose();
    if (this.coreMaterial) this.coreMaterial.dispose();
    if (this.glassMaterial) this.glassMaterial.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
