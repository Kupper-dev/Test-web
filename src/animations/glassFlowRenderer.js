import * as THREE from 'three';

export const GlassFlowConfig = {
  // Geometry parameters
  tubeRadius: 22,
  tubularSegments: 600,        // High-density subdivisions for silk-smooth curve silhouette
  radialSegments: 48,          // High-density radial subdivisions for round cross-section

  // Frosted Glass Material & Thickness
  glassColor: 0x93c5fd,        // Translucent icy sky-blue tint
  glassOpacity: 0.40,          // Base translucency
  glassBlur: 0.28,             // Internal diffusion factor
  rimGlowIntensity: 0.85,      // Fresnel edge glow strength
  rimWidth: 3.0,               // Fresnel falloff exponent
  wallThicknessRatio: 0.25,    // Glass wall thickness (25% glass wall, 75% inner hollow bore)

  // Inner Volumetric Blue Energy Stream
  coreColor: 0x1d4ed8,         // Deep vibrant blue
  glowColor: 0x38bdf8,         // Electric cyan highlight
  flowSpeed: 3.2,              // Velocity of traveling data pulses
  flowDirection: 1.0,          // Flow direction (1 = forward, -1 = reverse)
  highlightDensity: 18.0,      // Procedural UV flow frequency

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

      const steps = 100;
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

        // Procedural micro-noise to break perfect specular highlights (frosted glass micro-roughness)
        float hash21(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise21(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash21(i);
          float b = hash21(i + vec2(1.0, 0.0));
          float c = hash21(i + vec2(0.0, 1.0));
          float d = hash21(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vec3 rawNormal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);

          // Micro-surface noise for frosted glass micro-roughness
          float microRoughness = (noise21(vUv * 120.0) - 0.5) * 0.06;
          vec3 normal = normalize(rawNormal + vec3(microRoughness));

          // Top key light direction
          vec3 lightDir = normalize(vec3(0.2, 0.9, 0.4));

          // 1. Hollow Glass Pipe & Wall Thickness Geometry
          float NdotV = max(dot(normal, viewDir), 0.0);
          
          // Outer glass wall Fresnel silhouette (grazing view angle)
          float outerFresnel = pow(1.0 - NdotV, uRimWidth);

          // Inner hollow bore boundary highlight (transition between glass wall and hollow inner channel)
          float innerBoreRadiusRatio = 1.0 - uWallThicknessRatio; // e.g. 0.75
          float innerBoreNdotV = sqrt(clamp(1.0 - innerBoreRadiusRatio * innerBoreRadiusRatio, 0.0, 1.0)); // ~0.66
          float innerBoreDist = abs(NdotV - innerBoreNdotV);
          float innerFresnel = exp(-innerBoreDist * innerBoreDist / 0.012) * 0.40;

          // Glass wall optical path length & attenuation
          float pathLength = 1.0 / max(NdotV, 0.15);
          float attenuation = exp(-pathLength * 0.18);

          // Specular highlights on outer glass surface
          vec3 halfVector = normalize(lightDir + viewDir);
          float NdotH = max(dot(normal, halfVector), 0.0);
          float specular = pow(NdotH, 24.0) * 0.35;

          vec3 rimGlow = vec3(0.70, 0.88, 1.0) * (outerFresnel + innerFresnel) * uRimGlowIntensity;
          vec3 specGlow = vec3(0.95, 0.98, 1.0) * specular;

          // 2. Translucent Glass Shell
          float glassAlpha = mix(uGlassOpacity * 0.7, uGlassOpacity * 1.3, outerFresnel);
          vec3 glassBody = mix(uGlassColor * attenuation, vec3(0.9, 0.95, 1.0), outerFresnel * 0.3) + specGlow + rimGlow;

          // 3. Volumetric Inner Blue Energy Core (hollow bore channel)
          // Core is active for NdotV > innerBoreNdotV (inside the hollow bore)
          float insideBoreMask = smoothstep(innerBoreNdotV - 0.08, innerBoreNdotV + 0.08, NdotV);

          // Volumetric scattering falloff (brighter center, soft scattering toward inner glass wall)
          float volumetricScattering = exp(-5.0 * (1.0 - NdotV) * (1.0 - NdotV));

          // Smooth self-drawing cutoff in UV space along path length (vUv.x goes 0.0 -> 1.0)
          float drawMask = smoothstep(vUv.x + 0.012, vUv.x - 0.004, uProgress);

          // Analytical procedural UV flow markers (zero mesh tessellation artifacts)
          float pulse1 = sin(vUv.x * uHighlightDensity - uTime * uFlowSpeed * uFlowDirection);
          float pulse2 = sin(vUv.x * (uHighlightDensity * 2.2) + uTime * (uFlowSpeed * 1.4) * uFlowDirection);
          float energyWave = smoothstep(-0.25, 0.80, pulse1 * 0.6 + pulse2 * 0.4);

          vec3 flowEnergy = mix(uCoreColor, uGlowColor, energyWave);

          // Volumetric core energy scattering through the frosted glass
          vec3 activeFlow = flowEnergy * volumetricScattering * insideBoreMask * drawMask * 1.5;

          // 4. Composite Hollow Glass & Volumetric Data Pipeline
          vec3 finalColor = mix(glassBody, glassBody + activeFlow, drawMask * insideBoreMask);
          float finalAlpha = max(glassAlpha, insideBoreMask * drawMask * 0.95);

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
    if (newOptions.flowSpeed !== undefined) u.uFlowSpeed.value = newOptions.flowSpeed;
    if (newOptions.highlightDensity !== undefined) u.uHighlightDensity.value = newOptions.highlightDensity;
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
      if (this.scene) this.scene.remove(this.tubeMesh);
      this.tubeMesh.geometry.dispose();
      this.tubeMesh.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
