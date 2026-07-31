import * as THREE from 'three';

/**
 * SvgTubeRenderer
 * Reusable standalone WebGL renderer that converts 2D SVG <path> elements
 * into 3D WebGL Tube geometries (THREE.TubeGeometry + CatmullRomCurve3)
 * with smooth geometry reveal and rounded end caps driven by scroll progress.
 */
export class SvgTubeRenderer {
  /**
   * @param {Object} config
   * @param {HTMLElement} config.container - DOM container element to append canvas overlay
   * @param {Array<SVGPathElement>|NodeList|string} config.paths - SVG path elements or CSS selector
   * @param {Object} [config.options] - Custom rendering options
   */
  constructor({ container, paths, options = {} }) {
    if (!container) {
      console.warn('SvgTubeRenderer: container element is required.');
      return;
    }

    this.container = container;
    this.options = Object.assign(
      {
        radius: 8,
        tubularSegments: 300,
        radialSegments: 16,
        samplesPerPath: 200,
        colors: ['#2563eb', '#00f0ff', '#3b82f6'],
        fov: 45,
      },
      options
    );

    // Resolve SVG path elements
    if (typeof paths === 'string') {
      this.pathElements = Array.from(document.querySelectorAll(paths));
    } else if (paths instanceof NodeList || Array.isArray(paths)) {
      this.pathElements = Array.from(paths);
    } else if (paths instanceof SVGPathElement) {
      this.pathElements = [paths];
    } else {
      this.pathElements = [];
    }

    this.tubes = [];
    this.animationFrameId = null;
    this.currentProgress = 0;

    this.initScene();
    this.buildGeometries();
    this.setupLighting();
    this.resize();

    this.onResize = this.resize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  /**
   * Initialize Three.js WebGL Scene, Camera, and Canvas
   */
  initScene() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'it-webgl-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '2';

    // Ensure container supports absolute canvas positioning
    const computedPosition = window.getComputedStyle(this.container).position;
    if (computedPosition === 'static') {
      this.container.style.position = 'relative';
    }

    this.container.appendChild(this.canvas);

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera = new THREE.PerspectiveCamera(this.options.fov, 1, 1, 10000);
  }

  /**
   * Set up ambient, key directional, and rim lighting for rich 3D volume
   */
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this.scene.add(ambientLight);

    // Primary key light (front-top-right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(300, 500, 600);
    this.scene.add(keyLight);

    // Cyan rim/fill light (bottom-left)
    const rimLight = new THREE.DirectionalLight(0x00f0ff, 0.8);
    rimLight.position.set(-300, -300, 400);
    this.scene.add(rimLight);
  }

  /**
   * Sample 2D points from DOM SVG paths and build THREE 3D Tube geometries
   */
  buildGeometries() {
    if (!this.pathElements.length) return;

    // Determine SVG viewBox bounds
    const svgEl = this.pathElements[0].ownerSVGElement;
    let vbW = 740;
    let vbH = 2000;

    if (svgEl && svgEl.viewBox && svgEl.viewBox.baseVal) {
      if (svgEl.viewBox.baseVal.width > 0) vbW = svgEl.viewBox.baseVal.width;
      if (svgEl.viewBox.baseVal.height > 0) vbH = svgEl.viewBox.baseVal.height;
    }

    this.viewBoxWidth = vbW;
    this.viewBoxHeight = vbH;

    this.pathElements.forEach((pathEl, idx) => {
      const totalLength = pathEl.getTotalLength();
      if (!totalLength) return;

      const curvePoints = [];
      const samples = this.options.samplesPerPath;

      // Sample points along the SVG path
      for (let i = 0; i <= samples; i++) {
        const pt = pathEl.getPointAtLength((i / samples) * totalLength);
        // Map 2D SVG viewBox (0..vbW, 0..vbH) to centered 3D WebGL space (-vbW/2..vbW/2, vbH/2..-vbH/2)
        const glX = pt.x - vbW / 2;
        const glY = vbH / 2 - pt.y;
        curvePoints.push(new THREE.Vector3(glX, glY, 0));
      }

      // Generate smooth 3D Catmull-Rom curve
      const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');

      // Tube parameters
      const radius = this.options.radius - idx * 1.5; // Slight tier variation
      const tubularSegments = this.options.tubularSegments;
      const radialSegments = this.options.radialSegments;

      const tubeGeometry = new THREE.TubeGeometry(
        curve,
        tubularSegments,
        radius,
        radialSegments,
        false
      );

      // Initially hide all geometry (drawRange count = 0)
      tubeGeometry.setDrawRange(0, 0);

      // 3D Material with sleek color & shine
      const colorHex = this.options.colors[idx % this.options.colors.length];
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.15,
        metalness: 0.2,
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.15,
      });

      /* 
       * FUTURE SHADER UPGRADE HOOK:
       * In phase 2, replace MeshStandardMaterial with a custom ShaderMaterial.
       * Uniforms to include:
       *   u_progress: { value: 0 },
       *   u_fadeLength: { value: 0.1 }, // Translucent fading tip edge
       *   u_glowColor: { value: new THREE.Color('#00f0ff') }
       */

      const tubeMesh = new THREE.Mesh(tubeGeometry, material);
      this.scene.add(tubeMesh);

      // Smooth Rounded End Caps (Start & Tip Spheres)
      const sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);

      const startCap = new THREE.Mesh(sphereGeometry, material);
      startCap.position.copy(curve.getPoint(0));
      startCap.visible = false;
      this.scene.add(startCap);

      const tipCap = new THREE.Mesh(sphereGeometry, material);
      tipCap.position.copy(curve.getPoint(0));
      tipCap.visible = false;
      this.scene.add(tipCap);

      this.tubes.push({
        curve,
        tubeGeometry,
        tubeMesh,
        startCap,
        tipCap,
        tubularSegments,
        radialSegments,
        material,
      });
    });
  }

  /**
   * Update geometry reveal progress (0.0 to 1.0)
   * Synchronized with GSAP ScrollTrigger or window scroll
   * @param {number} progress - Progress value between 0 and 1
   */
  setProgress(progress) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    this.currentProgress = clampedProgress;

    this.tubes.forEach((tubeItem) => {
      const {
        curve,
        tubeGeometry,
        startCap,
        tipCap,
        tubularSegments,
        radialSegments,
      } = tubeItem;

      if (clampedProgress <= 0.001) {
        tubeGeometry.setDrawRange(0, 0);
        startCap.visible = false;
        tipCap.visible = false;
      } else {
        // Compute draw range rounded to full tubular ring segments
        const ringCount = Math.floor(clampedProgress * tubularSegments);
        const drawCount = ringCount * radialSegments * 6;
        tubeGeometry.setDrawRange(0, drawCount);

        // Start cap position
        startCap.visible = true;

        // Tip cap position updated dynamically along curve
        tipCap.visible = true;
        const tipPos = curve.getPoint(Math.min(1, clampedProgress));
        tipCap.position.copy(tipPos);

        /*
         * FUTURE END CAP FADING TIP HOOK:
         * To create a translucent fading tip edge, scale or adjust tipCap opacity:
         * tipCap.material.opacity = Math.sin(clampedProgress * Math.PI);
         */
      }
    });

    this.render();
  }

  /**
   * Render single frame
   */
  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  /**
   * Resize canvas and camera frustum on window / container resize
   */
  resize() {
    if (!this.container || !this.renderer || !this.camera) return;

    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 740;
    const height = rect.height || 2000;

    this.renderer.setSize(width, height);

    // Adjust camera frustum so full viewBox (viewBoxWidth x viewBoxHeight) fits exact height
    const aspect = width / height;
    this.camera.aspect = aspect;

    const fovRad = (this.options.fov * Math.PI) / 180;
    const fitHeight = this.viewBoxHeight || 2000;
    const depth = fitHeight / 2 / Math.tan(fovRad / 2);

    this.camera.position.set(0, 0, depth);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    this.render();
  }

  /**
   * Clean up WebGL resources and event listeners
   */
  destroy() {
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.tubes.forEach((t) => {
      if (t.tubeGeometry) t.tubeGeometry.dispose();
      if (t.material) t.material.dispose();
      if (t.startCap) t.startCap.geometry.dispose();
      if (t.tipCap) t.tipCap.geometry.dispose();
    });

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}
