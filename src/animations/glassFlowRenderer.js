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
    this.clock = new THREE.Clock();

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
    const material = new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true });
    this.tubeMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.tubeMesh);
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
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.onResize);
    if (this.tubeMesh) {
      this.tubeMesh.geometry.dispose();
      this.tubeMesh.material.dispose();
    }
    if (this.renderer) this.renderer.dispose();
  }
}
