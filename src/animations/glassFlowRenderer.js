import * as THREE from 'three';

export const GlassFlowConfig = {
  // Geometry parameters
  tubeRadius: 20,
  tubularSegments: 400,
  radialSegments: 32,

  // Frosted Glass Conduit Wrapper with Wall Thickness
  glassColor: 0x93c5fd,        // Translucent icy sky-blue glass tint
  glassOpacity: 0.40,          // Frosted glass translucency
  glassBlur: 0.25,             // Internal wall edge diffusion
  rimGlowIntensity: 0.65,      // Fresnel edge highlight
  rimWidth: 2.5,               // Fresnel exponent
  wallThicknessRatio: 0.32,    // Glass wall thickness (32% wall thickness, 68% inner hollow bore)

  // Hero Element: Vivid Saturated Blue Energy Stream
  coreColor: 0x0152ff,         // Rich saturated electric blue
  glowColor: 0x00e1ff,         // Glowing electric cyan energy pulse
  flowSpeed: 3.0,              // Velocity of traveling data pulses
  flowDirection: 1.0,          // Flow direction (1 = forward, -1 = reverse)
  highlightDensity: 16.0,      // Procedural UV flow frequency

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
    this.createTubeMesh();
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

      const steps = 80;
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

  createTubeMesh() {
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
        uGlassColor: { value: new THREE.Color(this.config.glassColor) },
        uGlassOpacity: { value: this.config.glassOpacity },
        uGlassBlur: { value: this.config.glassBlur },
        uRimGlowIntensity: { value: this.config.rimGlowIntensity },
        uRimWidth: { value: this.config.rimWidth },
        uWallThicknessRatio: { value: this.config.wallThicknessRatio },
        uCoreColor: { value: new THREE.Color(this.config.coreColor) },
        uGlowColor: { value: new THREE.Color(this.config.glowColor) },
        uFlowSpeed: { value: this.config.flowSpeed },
        uFlowDirection: { value: this.config.flowDirection },
        uHighlightDensity: { value: this.config.highlightDensity }
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
        uniform vec3 uGlassColor;
        uniform float uGlassOpacity;
        uniform float uGlassBlur;
        uniform float uRimGlowIntensity;
        uniform float uRimWidth;
        uniform float uWallThicknessRatio;
        uniform vec3 uCoreColor;
        uniform vec3 uGlowColor;
        uniform float uFlowSpeed;
        uniform float uFlowDirection;
        uniform float uHighlightDensity;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // 1. View-Space Center Distance (Zero UV Seam Artifacts & Zero Black Triangle Teeth!)
          // In view space, normal.z is 1.0 at tube center facing camera, fading to 0.0 at silhouettes.
          float centerDist = abs(normal.z);

          // 2. Glass Wall Thickness & Fresnel Sheen
          float outerFresnel = pow(1.0 - centerDist, uRimWidth);

          vec3 lightDir = normalize(vec3(0.25, 0.90, 0.35));
          vec3 halfVector = normalize(lightDir + viewDir);
          float specular = pow(max(dot(normal, halfVector), 0.0), 20.0) * 0.35;

          vec3 rimSheen = vec3(0.65, 0.88, 1.0) * outerFresnel * uRimGlowIntensity;
          vec3 specSheen = vec3(0.95, 0.98, 1.0) * specular;

          // Glass Wall Optical Path Length & Transmission Attenuation
          float wallPath = 1.0 / max(centerDist, 0.15);
          float glassAttenuation = exp(-wallPath * 0.15);

          // Translucent Frosted Glass Shell (shows clear wall thickness and soft rim sheen)
          vec3 glassBody = mix(uGlassColor * glassAttenuation, vec3(0.85, 0.93, 1.0), outerFresnel * 0.4) + specSheen + rimSheen;
          float glassAlpha = mix(uGlassOpacity * 0.7, uGlassOpacity * 1.3, outerFresnel);

          // 3. Inner Hollow Bore & Volumetric Blue Data Stream
          // Bore is active inside the glass wall (centerDist > wallThicknessRatio)
          float boreMask = smoothstep(uWallThicknessRatio - 0.10, uWallThicknessRatio + uGlassBlur, centerDist);

          // Volumetric core intensity: Peak brightness at center axis, soft diffusion to glass wall
          float coreProfile = pow(centerDist, 1.5);

          // Smooth self-drawing progress mask along tube length (vUv.x goes 0.0 -> 1.0)
          float drawMask = smoothstep(vUv.x + 0.012, vUv.x - 0.004, uProgress);

          // Procedural traveling energy pulses along length
          float wave1 = sin(vUv.x * uHighlightDensity - uTime * uFlowSpeed * uFlowDirection) * 0.5 + 0.5;
          float wave2 = sin(vUv.x * (uHighlightDensity * 1.8) + uTime * (uFlowSpeed * 1.2) * uFlowDirection) * 0.5 + 0.5;
          float energyPulse = pow(mix(wave1, wave2, 0.5), 1.5);

          // Rich, saturated blue energy stream (100% blue saturation preserved)
          vec3 energyColor = mix(uCoreColor, uGlowColor, energyPulse);

          // Active blue energy stream inside the hollow conduit
          vec3 activeBlueFlow = energyColor * coreProfile * boreMask * drawMask * 1.4;

          // 4. Composite: Frosted Glass Conduit with Wall Thickness wrapping around Blue Core
          vec3 finalColor = mix(glassBody, glassBody + activeBlueFlow, drawMask * boreMask);
          float finalAlpha = max(glassAlpha, drawMask * boreMask * 0.95);

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
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
    if (!this.material) return;
    const u = this.material.uniforms;
    if (newOptions.glassColor) u.uGlassColor.value.set(newOptions.glassColor);
    if (newOptions.coreColor) u.uCoreColor.value.set(newOptions.coreColor);
    if (newOptions.glowColor) u.uGlowColor.value.set(newOptions.glowColor);
    if (newOptions.glassOpacity !== undefined) u.uGlassOpacity.value = newOptions.glassOpacity;
    if (newOptions.glassBlur !== undefined) u.uGlassBlur.value = newOptions.glassBlur;
    if (newOptions.rimGlowIntensity !== undefined) u.uRimGlowIntensity.value = newOptions.rimGlowIntensity;
    if (newOptions.flowSpeed !== undefined) u.flowSpeed = newOptions.flowSpeed;
    if (newOptions.highlightDensity !== undefined) u.highlightDensity = newOptions.highlightDensity;
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
      this.tubeMesh.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
