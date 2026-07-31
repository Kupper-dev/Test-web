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
        radius: 10,
        tubularSegments: 400,
        radialSegments: 20,
        samplesPerPath: 250,
        colors: ['#00f0ff', '#2563eb', '#00f0ff'],
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
    // Find or create overlay canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'it-webgl-canvas';
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '50%';
    this.canvas.style.transform = 'translateX(-50%)';
    this.canvas.style.width = '100%';
    this.canvas.style.minWidth = '740px';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '3';

    // Ensure container is relative
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

    // Default viewBox dimensions (740 x 2000)
    this.viewBoxWidth = 740;
    this.viewBoxHeight = 2000;

    // Use OrthographicCamera matching SVG viewBox (1:1 coordinate projection)
    const halfW = this.viewBoxWidth / 2;
    const halfH = this.viewBoxHeight / 2;
    this.camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 1, 2000);
    this.camera.position.set(0, 0, 500);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Set up ambient, key directional, and cyan rim lighting
   */
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(200, 400, 500);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    rimLight.position.set(-200, -200, 400);
    this.scene.add(rimLight);
  }

  /**
   * Sample 2D points from DOM SVG paths and build THREE 3D Tube geometries
   */
  buildGeometries() {
    if (!this.pathElements.length) {
      console.warn('SvgTubeRenderer: No SVG path elements found.');
      return;
    }

    // Determine SVG viewBox bounds from parent SVG element
    const svgEl = this.pathElements[0].ownerSVGElement;
    if (svgEl && svgEl.viewBox && svgEl.viewBox.baseVal) {
      if (svgEl.viewBox.baseVal.width > 0) this.viewBoxWidth = svgEl.viewBox.baseVal.width;
      if (svgEl.viewBox.baseVal.height > 0) this.viewBoxHeight = svgEl.viewBox.baseVal.height;
    }

    const vbW = this.viewBoxWidth;
    const vbH = this.viewBoxHeight;

    // Update orthographic camera bounds to match viewBox
    this.camera.left = -vbW / 2;
    this.camera.right = vbW / 2;
    this.camera.top = vbH / 2;
    this.camera.bottom = -vbH / 2;
    this.camera.updateProjectionMatrix();

    this.pathElements.forEach((pathEl, idx) => {
      const totalLength = pathEl.getTotalLength();
      if (!totalLength) return;

      const curvePoints = [];
      const samples = this.options.samplesPerPath;

      // Sample 2D points along SVG path and convert to centered 3D WebGL coordinates
      for (let i = 0; i <= samples; i++) {
        const pt = pathEl.getPointAtLength((i / samples) * totalLength);
        const glX = pt.x - vbW / 2;
        const glY = vbH / 2 - pt.y;
        curvePoints.push(new THREE.Vector3(glX, glY, 0));
      }

      // Create smooth 3D Catmull-Rom Curve
      const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');

      const radius = this.options.radius - idx * 1.5;
      const tubularSegments = this.options.tubularSegments;
      const radialSegments = this.options.radialSegments;

      const tubeGeometry = new THREE.TubeGeometry(
        curve,
        tubularSegments,
        radius,
        radialSegments,
        false
      );

      // Hide geometry initially
      tubeGeometry.setDrawRange(0, 0);

      // Vibrant material with cyan emission & shine
      const colorHex = this.options.colors[idx % this.options.colors.length];
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness: 0.1,
        metalness: 0.3,
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.4,
      });

      const tubeMesh = new THREE.Mesh(tubeGeometry, material);
      this.scene.add(tubeMesh);

      // Rounded end cap spheres
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
        const ringCount = Math.floor(clampedProgress * tubularSegments);
        const drawCount = ringCount * radialSegments * 6;
        tubeGeometry.setDrawRange(0, drawCount);

        startCap.visible = true;
        tipCap.visible = true;

        const tipPos = curve.getPoint(Math.min(1, clampedProgress));
        tipCap.position.copy(tipPos);
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
   * Resize canvas renderer on window resize
   */
  resize() {
    if (!this.container || !this.renderer || !this.camera) return;

    // Match exact width & height of overlay container/SVG element
    const svgEl = this.container.querySelector('.it-network-paths svg, svg');
    const targetEl = svgEl || this.container;
    const rect = targetEl.getBoundingClientRect();

    const width = rect.width || 740;
    const height = rect.height || 2000;

    this.renderer.setSize(width, height);
    this.render();
  }

  /**
   * Clean up WebGL resources
   */
  destroy() {
    if (this.onResize) {
      window.removeEventListener('resize', this.onResize);
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
