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
    this.camera = this.config.camera || null;
    this.renderer = this.config.renderer || null;

    // Advanced Compositor Architecture Render Targets
    this.coreRenderTarget = null;
    this.blurTarget1 = null;
    this.blurTarget2 = null;

    // Ping-Pong Blur helper properties
    this.blurScene = new THREE.Scene();
    this.blurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.blurQuad = null;
    this.blurMaterial = null;

    // Concentric Dual-Mesh Architecture
    this.coreMesh = null;
    this.glassMesh = null;
    
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
    this.setupRenderTargets();
    this.setupBlurPipeline();
    this.buildCurveFromSvg();
    this.createDualMesh();
    this.addResizeListener();
  }

  setupScene() {
    if (this.scene) return; // Scenes provided externally

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
      this.renderer.setClearColor(0xffffff, 0);
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Force Canvas CSS Transparency immediately
      this.renderer.domElement.style.background = 'transparent';
      this.renderer.domElement.style.backgroundColor = 'rgba(0,0,0,0)';
    }
  }

  setupRenderTargets() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = this.renderer ? this.renderer.getPixelRatio() : (window.devicePixelRatio || 1);
    
    const targetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType
    };

    // Allocate render targets matching physical pixel dimensions
    this.coreRenderTarget = new THREE.WebGLRenderTarget(width * pixelRatio, height * pixelRatio, targetOptions);
    this.blurTarget1 = new THREE.WebGLRenderTarget(width * pixelRatio, height * pixelRatio, targetOptions);
    this.blurTarget2 = new THREE.WebGLRenderTarget(width * pixelRatio, height * pixelRatio, targetOptions);
  }

  setupBlurPipeline() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = this.renderer ? this.renderer.getPixelRatio() : (window.devicePixelRatio || 1);

    this.blurMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uDirection: { value: new THREE.Vector2(1.0, 0.0) },
        uResolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uDirection;
        uniform vec2 uResolution;
        varying vec2 vUv;
        
        void main() {
          vec2 off1 = vec2(1.3846153846) * uDirection / uResolution;
          vec2 off2 = vec2(3.2307692308) * uDirection / uResolution;
          
          vec4 color = texture2D(tDiffuse, vUv) * 0.2270270270;
          color += texture2D(tDiffuse, vUv + off1) * 0.3162162162;
          color += texture2D(tDiffuse, vUv - off1) * 0.3162162162;
          color += texture2D(tDiffuse, vUv + off2) * 0.0702702703;
          color += texture2D(tDiffuse, vUv - off2) * 0.0702702703;
          
          gl_FragColor = color;
        }
      `
    });

    this.blurQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.blurMaterial);
    this.blurScene.add(this.blurQuad);
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelRatio = this.renderer ? this.renderer.getPixelRatio() : (window.devicePixelRatio || 1);

    // 1. Generate the Inner Core (Liquid Blue Energy with Radial Gradient)
    const coreGeometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      8, // radius 8
      16,
      false
    );
    coreGeometry.computeVertexNormals();

    this.coreMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: this.config.progress }
      },
      transparent: true,
      depthWrite: false,
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
          // Scroll Draw Logic
          if (vUv.x > uProgress) {
            discard;
          }

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float viewDot = abs(dot(normal, viewDir));

          vec3 centerColor = vec3(0.07, 0.27, 1.0); // #1345ff
          vec3 edgeColor = vec3(0.56, 0.86, 1.0);   // #8fdcff

          vec3 finalColor = mix(edgeColor, centerColor, pow(viewDot, 1.5));
          float alpha = 0.95;

          // Tip fade logic
          float tipFade = clamp((uProgress - vUv.x) / 0.02, 0.0, 1.0);
          alpha *= tipFade;

          gl_FragColor = vec4(finalColor * alpha, alpha); // Premultiplied
        }
      `
    });

    this.coreMesh = new THREE.Mesh(coreGeometry, this.coreMaterial);
    this.coreMesh.frustumCulled = false;
    this.coreMesh.renderOrder = 0;
    
    // Assign core to Layer 1 for offscreen rendering isolation
    this.coreMesh.layers.set(1);
    
    if (this.scene) {
      this.scene.add(this.coreMesh);
    }

    // 2. Generate the Outer Glass Shell (Screen-space Compositor)
    const glassGeometry = new THREE.TubeGeometry(
      this.curve,
      this.config.tubularSegments,
      20, // radius 20
      this.config.radialSegments,
      false
    );
    glassGeometry.computeVertexNormals();

    this.glassMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tSharp: { value: this.coreRenderTarget.texture },
        tBlurred: { value: this.blurTarget2.texture },
        uResolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
        uProgress: { value: this.config.progress }
      },
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.NormalBlending,
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
        uniform sampler2D tSharp;
        uniform sampler2D tBlurred;
        uniform vec2 uResolution;
        uniform float uProgress;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          // Scroll Draw Logic
          if (vUv.x > uProgress) {
            discard;
          }

          vec2 screenUv = gl_FragCoord.xy / uResolution;

          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - abs(dot(normal, viewDir));

          // Sample core render targets in screen-space
          vec4 sharpCore = texture2D(tSharp, screenUv);
          vec4 blurredCore = texture2D(tBlurred, screenUv);

          // 1. Edge-dependent blur mix (Sharp in center, blurred at edges)
          float blurMix = pow(fresnel, 2.5);
          vec4 coreComposite = mix(sharpCore, blurredCore, blurMix);

          // 2. White subsurface scattering (Soft haze)
          float hazeAlpha = pow(fresnel, 5.0) * 0.3;

          // 3. Thin bright rim highlight
          float rimAlpha = pow(fresnel, 10.0) * 0.9;

          // Final Compositing
          float finalAlpha = max(max(coreComposite.a, hazeAlpha), rimAlpha);
          vec3 finalColor = coreComposite.rgb + (vec3(1.0) * hazeAlpha) + (vec3(1.0) * rimAlpha);

          // Tip fade logic
          float tipFade = clamp((uProgress - vUv.x) / 0.02, 0.0, 1.0);
          finalAlpha *= tipFade;

          // Explicit Premultiplied Output
          gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
        }
      `
    });

    this.glassMesh = new THREE.Mesh(glassGeometry, this.glassMaterial);
    this.glassMesh.frustumCulled = false;
    this.glassMesh.renderOrder = 1;
    
    // Assign glass to Layer 0 (default)
    this.glassMesh.layers.set(0);
    
    if (this.scene) {
      this.scene.add(this.glassMesh);
    }

    // Compatibility variables for positioning updates in tick()
    this.innerMesh = this.coreMesh;
    this.outerMesh = this.glassMesh;
    this.tubeMesh = this.glassMesh;
  }

  update(progress) {
    if (progress !== undefined) {
      this.config.progress = progress;
    }

    if (this.coreMaterial) {
      this.coreMaterial.uniforms.uProgress.value = this.config.progress;
    }
    if (this.glassMaterial) {
      this.glassMaterial.uniforms.uProgress.value = this.config.progress;
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
      if (this.coreMaterial) this.coreMaterial.uniforms.uProgress.value = newOptions.progress;
      if (this.glassMaterial) this.glassMaterial.uniforms.uProgress.value = newOptions.progress;
    }
  }

  addResizeListener() {
    this.onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = this.renderer ? this.renderer.getPixelRatio() : (window.devicePixelRatio || 1);

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

      // Resize all offscreen render targets matching Retina resolution
      const targetW = width * pixelRatio;
      const targetH = height * pixelRatio;
      if (this.coreRenderTarget) this.coreRenderTarget.setSize(targetW, targetH);
      if (this.blurTarget1) this.blurTarget1.setSize(targetW, targetH);
      if (this.blurTarget2) this.blurTarget2.setSize(targetW, targetH);

      if (this.glassMaterial) {
        this.glassMaterial.uniforms.uResolution.value.set(targetW, targetH);
      }
      if (this.blurMaterial) {
        this.blurMaterial.uniforms.uResolution.value.set(targetW, targetH);
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
    if (!this.renderer || !this.scene || !this.camera) return;

    const currentRenderTarget = this.renderer.getRenderTarget();

    // STEP 1: Render Inner Core (Layer 1) to offscreen coreRenderTarget
    this.camera.layers.set(1);
    this.renderer.setRenderTarget(this.coreRenderTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    // STEP 2: Horizontal Blur (Core -> Target 1)
    this.blurMaterial.uniforms.tDiffuse.value = this.coreRenderTarget.texture;
    this.blurMaterial.uniforms.uDirection.value.set(1.5, 0.0); // 1.5 increases blur spread
    this.renderer.setRenderTarget(this.blurTarget1);
    this.renderer.clear();
    this.renderer.render(this.blurScene, this.blurCamera);

    // STEP 3: Vertical Blur (Target 1 -> Target 2)
    this.blurMaterial.uniforms.tDiffuse.value = this.blurTarget1.texture;
    this.blurMaterial.uniforms.uDirection.value.set(0.0, 1.5);
    this.renderer.setRenderTarget(this.blurTarget2);
    this.renderer.clear();
    this.renderer.render(this.blurScene, this.blurCamera);

    // STEP 4: Render Glass Compositor to Screen
    this.camera.layers.set(0);
    this.renderer.setRenderTarget(currentRenderTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);

    // Restore camera to default Layer 0 so subsequent ticks read default scene state
    this.camera.layers.set(0);
  }

  destroy() {
    this.stopAnimationLoop();
    window.removeEventListener('resize', this.onResize);

    if (this.scene) {
      if (this.coreMesh) this.scene.remove(this.coreMesh);
      if (this.glassMesh) this.scene.remove(this.glassMesh);
    }

    if (this.coreMesh) this.coreMesh.geometry.dispose();
    if (this.glassMesh) this.glassMesh.geometry.dispose();
    if (this.coreMaterial) this.coreMaterial.dispose();
    if (this.glassMaterial) this.glassMaterial.dispose();
    
    if (this.coreRenderTarget) this.coreRenderTarget.dispose();
    if (this.blurTarget1) this.blurTarget1.dispose();
    if (this.blurTarget2) this.blurTarget2.dispose();

    if (this.blurMaterial) this.blurMaterial.dispose();
    if (this.blurQuad) this.blurQuad.geometry.dispose();
    
    if (this.renderer) this.renderer.dispose();
  }
}
