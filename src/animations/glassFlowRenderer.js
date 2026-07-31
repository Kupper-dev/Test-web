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

    if (this.renderer) {
      this.renderer.autoClear = false;
    }

    // Advanced Compositor Architecture - Core Render Target
    this.coreRenderTarget = null;

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
    this.buildCurveFromSvg();
    this.createDualMesh();
    this.addResizeListener();
  }

  setupScene() {
    if (this.scene) {
      if (this.renderer) {
        this.renderer.autoClear = false;
      }
      return; // Scenes provided externally
    }

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
      this.renderer.autoClear = false;
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

    // 2. Generate the Outer Glass Shell (Screen-space Compositor with Procedural Acrylic Scatter)
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
        uResolution: { value: new THREE.Vector2(width * pixelRatio, height * pixelRatio) },
        uProgress: { value: this.config.progress },
        uDebugMode: { value: 0.0 } // 0=Final, 1=Sharp, 2=Blurred
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
        uniform vec2 uResolution;
        uniform float uProgress;
        uniform float uDebugMode;

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

          // 1. Sharp Center Sample
          vec4 sharpCore = texture2D(tSharp, screenUv);

          // 2. Golden Angle Spiral Blur (Vogel Filter)
          float goldenAngle = 2.39996323; 
          float iterations = 32.0; 
          float spread = pow(fresnel, 2.0) * 0.02; 
          
          vec3 accumulatedRGB = vec3(0.0);
          float totalAlpha = 0.0;
          
          for (float i = 0.0; i < 32.0; i++) {
            float r = sqrt(i / iterations) * spread;
            float theta = i * goldenAngle;
            vec2 offset = vec2(cos(theta), sin(theta)) * r;
            
            vec4 sample = texture2D(tSharp, screenUv + offset);
            
            // Weight the color by its alpha to prevent black background bleeding
            accumulatedRGB += sample.rgb * sample.a;
            totalAlpha += sample.a;
          }
          
          // Normalize the colors to restore pure brightness
          if (totalAlpha > 0.0) {
            accumulatedRGB /= totalAlpha; 
          }
          
          // Reconstruct the blurred core
          vec4 blurredCore = vec4(accumulatedRGB, totalAlpha / iterations);

          // 3. Mix sharp center and frosted edges
          float blurMix = pow(fresnel, 1.5);
          vec4 coreComposite = mix(sharpCore, blurredCore, blurMix);

          // VIBRANCY BOOST: Multiply RGB to create a luminous, emissive effect
          coreComposite.rgb *= 1.35; 

          // 4. Optical Additions
          float hazeAlpha = pow(fresnel, 5.0) * 0.3; // White subsurface scattering
          float rimAlpha = pow(fresnel, 10.0) * 0.9; // Thin bright rim

          // Final Compositing
          float finalAlpha = max(max(coreComposite.a, hazeAlpha), rimAlpha);
          vec3 finalColor = coreComposite.rgb + (vec3(1.0) * hazeAlpha) + (vec3(1.0) * rimAlpha);

          // Tip fade logic
          float tipFade = clamp((uProgress - vUv.x) / 0.02, 0.0, 1.0);
          finalAlpha *= tipFade;
          coreComposite.a *= tipFade;

          // DIAGNOSTIC OUTPUT
          if (uDebugMode == 1.0) {
            gl_FragColor = vec4(sharpCore.rgb * coreComposite.a, coreComposite.a); // Mode 1: Sharp
          } else if (uDebugMode == 2.0) {
            gl_FragColor = vec4(blurredCore.rgb * coreComposite.a, coreComposite.a); // Mode 2: Procedural Blur
          } else {
            gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha); // Mode 0: Final Pre-multiplied Composite
          }
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

      // Resize offscreen render target matching Retina resolution
      const targetW = width * pixelRatio;
      const targetH = height * pixelRatio;
      if (this.coreRenderTarget) this.coreRenderTarget.setSize(targetW, targetH);

      if (this.glassMaterial) {
        this.glassMaterial.uniforms.uResolution.value.set(targetW, targetH);
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

    // STEP 2: Render Glass Compositor & Website UI (Layer 0) directly to screen Canvas
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
    if (this.renderer) this.renderer.dispose();
  }
}
