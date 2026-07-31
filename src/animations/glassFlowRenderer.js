import * as THREE from 'three';

export const GlassFlowConfig = {
  // Geometry parameters
  tubeRadius: 18,
  tubularSegments: 400,
  radialSegments: 32,

  // Frosted Glass Material
  glassColor: 0xdbeafe,
  glassOpacity: 0.45,
  glassBlur: 0.35,
  rimGlowIntensity: 1.4,
  rimWidth: 2.2,

  // Inner Blue Energy Stream
  coreRadiusRatio: 0.68,
  coreColor: 0x1d4ed8,
  glowColor: 0x60a5fa,
  flowSpeed: 2.5,
  flowDirection: 1.0,
  highlightDensity: 14.0,

  // Animation & Timeline
  progress: 0.0
};

export class GlassFlowRenderer {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.config = { ...GlassFlowConfig, ...options };
    
    this.scene = null;
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
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();

    const fov = 45;
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 1, 2000);
    const depth = height / (2 * Math.tan((fov * Math.PI) / 360));
    this.camera.position.set(0, 0, depth);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: this.config.progress },
        uGlassColor: { value: new THREE.Color(this.config.glassColor) },
        uGlassOpacity: { value: this.config.glassOpacity },
        uGlassBlur: { value: this.config.glassBlur },
        uRimGlowIntensity: { value: this.config.rimGlowIntensity },
        uRimWidth: { value: this.config.rimWidth },
        uCoreRadiusRatio: { value: this.config.coreRadiusRatio },
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
        uniform float uCoreRadiusRatio;
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

          // 1. Fresnel Rim Specular Highlight (Luminous glass edges)
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), uRimWidth);
          vec3 rimGlow = vec3(1.0) * fresnel * uRimGlowIntensity;

          // 2. Outer Frosted Glass Base Body
          float glassAlpha = mix(uGlassOpacity, 0.95, fresnel);
          vec3 glassBody = mix(uGlassColor, vec3(1.0), fresnel * 0.4);

          // 3. Inner Blue Data Stream (Drawing & Moving Highlights inside tube)
          float distFromCenter = abs(vUv.y - 0.5) * 2.0;

          // Soft blurred edge falloff inside the glass
          float coreAlpha = smoothstep(uCoreRadiusRatio, uCoreRadiusRatio - uGlassBlur, distFromCenter);

          // Smooth self-drawing cutoff along tube length according to uProgress
          float drawMask = smoothstep(vUv.x - 0.015, vUv.x + 0.005, uProgress);

          // Traveling energy waves/pulses
          float wave = sin(vUv.x * uHighlightDensity - uTime * uFlowSpeed * uFlowDirection) * 0.5 + 0.5;
          wave = pow(wave, 2.0); // Sharpen highlights

          vec3 flowEnergy = mix(uCoreColor, uGlowColor, wave);

          // Combine inner energy with self-drawing mask and radial core falloff
          vec3 activeFlow = flowEnergy * coreAlpha * drawMask;

          // 4. Final Glass & Flow Composite
          vec3 finalColor = glassBody + rimGlow + activeFlow;
          float finalAlpha = max(glassAlpha, coreAlpha * drawMask * 0.9);

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    this.tubeMesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.tubeMesh);
  }

  update(progress) {
    if (progress !== undefined) {
      this.config.progress = progress;
    }
    if (this.material) {
      this.material.uniforms.uTime.value = (performance.now() - this.startTime) / 1000;
      this.material.uniforms.uProgress.value = this.config.progress;
    }
    this.render();
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
    if (newOptions.flowSpeed !== undefined) u.uFlowSpeed.value = newOptions.flowSpeed;
    if (newOptions.highlightDensity !== undefined) u.uHighlightDensity.value = newOptions.highlightDensity;
  }

  addResizeListener() {
    this.onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.camera.aspect = width / height;
      const fov = 45;
      const depth = height / (2 * Math.tan((fov * Math.PI) / 360));
      this.camera.position.set(0, 0, depth);
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);

      this.buildCurveFromSvg();
      if (this.tubeMesh) {
        this.tubeMesh.geometry.dispose();
        this.tubeMesh.geometry = new THREE.TubeGeometry(
          this.curve,
          this.config.tubularSegments,
          this.config.tubeRadius,
          this.config.radialSegments,
          false
        );
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
      this.tubeMesh.geometry.dispose();
      this.tubeMesh.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
