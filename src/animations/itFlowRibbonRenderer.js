/**
 * ItFlowRibbonRenderer — Standalone Three.js 3D Carved Groove & Rolling Sphere Renderer
 *
 * Built exclusively for `.it-flow-section` to avoid touching KupperRibbonRenderer or Hero Ribbon.
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// Exact Bezier curve segments extracted from itSignalPath2 SVG d-attribute:
// d="m 33,85h 444c 96,0 190,107 190,201v 224c 0,116 -98,188 -190,187l -192,-2c -92,0 -166,75 -166,168v 278c 0,94 74,169 166,169h 194c 92,0 188,94 188,188v 228c 0,94 -104,191 -214,191H 105"
const SVG_SEGMENTS = [
  // 1. m 33,85 h 444
  { p0: [33, 85], cp1: [181, 85], cp2: [329, 85], p1: [477, 85] },
  // 2. c 96,0 190,107 190,201
  { p0: [477, 85], cp1: [573, 85], cp2: [667, 192], p1: [667, 286] },
  // 3. v 224
  { p0: [667, 286], cp1: [667, 360], cp2: [667, 435], p1: [667, 510] },
  // 4. c 0,116 -98,188 -190,187
  { p0: [667, 510], cp1: [667, 626], cp2: [569, 698], p1: [477, 697] },
  // 5. l -192,-2
  { p0: [477, 697], cp1: [413, 696.33], cp2: [349, 695.67], p1: [285, 695] },
  // 6. c -92,0 -166,75 -166,168
  { p0: [285, 695], cp1: [193, 695], cp2: [119, 770], p1: [119, 863] },
  // 7. v 278
  { p0: [119, 863], cp1: [119, 955.67], cp2: [119, 1048.33], p1: [119, 1141] },
  // 8. c 0,94 74,169 166,169
  { p0: [119, 1141], cp1: [119, 1235], cp2: [193, 1310], p1: [285, 1310] },
  // 9. h 194
  { p0: [285, 1310], cp1: [349.67, 1310], cp2: [414.33, 1310], p1: [479, 1310] },
  // 10. c 92,0 188,94 188,188
  { p0: [479, 1310], cp1: [571, 1310], cp2: [667, 1404], p1: [667, 1498] },
  // 11. v 228
  { p0: [667, 1498], cp1: [667, 1574], cp2: [667, 1650], p1: [667, 1726] },
  // 12. c 0,94 -104,191 -214,191
  { p0: [667, 1726], cp1: [667, 1820], cp2: [563, 1917], p1: [453, 1917] },
  // 13. H 105
  { p0: [453, 1917], cp1: [337, 1917], cp2: [221, 1917], p1: [105, 1917] }
];

const SVG_VIEWBOX_W = 740;
const SVG_VIEWBOX_H = 2000;
const PATH_SAMPLES = 600;
const FOV = 45;

export class ItFlowRibbonRenderer {
  constructor(sectionEl) {
    this._sectionEl = sectionEl;
    this._cardsEl = sectionEl ? sectionEl.querySelector('.it-flow-cards') : null;
    this._progress = 0;
    this._animationFrameId = null;

    // Create dedicated canvas
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'it-flow-ribbon-canvas';
    this._canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
    `;
    document.body.insertBefore(this._canvas, document.body.firstChild);

    this.geomParams = {
      grooveWidth: 24.0,
      grooveDepth: 10.0,
      wallThickness: 3.0
    };

    this._scene = new THREE.Scene();
    this._textures = {};
    this._hdrEnvMap = null;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      alpha: true,
      antialias: true
    });
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1.0;
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const w = window.innerWidth;
    const h = window.innerHeight;
    this._camera = new THREE.PerspectiveCamera(FOV, w / h, 1, 5000);
    const depth = h / (2 * Math.tan((FOV * Math.PI) / 360));
    this._camera.position.set(0, 0, depth);

    this._group = new THREE.Group();
    this._scene.add(this._group);

    this._setupLights();

    this._curvePath = null;
    this._points = [];
    this._lutPoints = [];
    
    this._ribbonGeometry = null;
    this._ribbonMaterial = null;
    this._ribbonMesh = null;
    this._sphereMesh = null;
    this._sphereMaterial = null;
    this._totalIndexCount = 0;

    this._loadAssets();
    this._buildCurvePath();
    this._buildLUT();
    this._buildRibbonGeometry();
    this._buildMaterial();
    this._buildSphere();
    this._createMesh();

    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    this._tick = this._tick.bind(this);
    this._tick();
  }

  _setupLights() {
    this._ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this._scene.add(this._ambientLight);
    this._keyLight = new THREE.DirectionalLight(0xffffff, 7.0);
    this._keyLight.position.set(400, 500, 800);
    this._scene.add(this._keyLight);
    this._fillLight = new THREE.DirectionalLight(0x00b3ff, 6.3);
    this._fillLight.position.set(-300, -200, 400);
    this._scene.add(this._fillLight);
  }

  _mapSvgPoint(svgX, svgY) {
    const cardsEl = this._cardsEl || (this._sectionEl ? this._sectionEl.querySelector('.it-flow-cards') : null);
    let cardsW = 740;
    let cardsH = 2000;

    if (cardsEl) {
      const rect = cardsEl.getBoundingClientRect();
      cardsW = Math.max(rect.width, 740);
      cardsH = rect.height > 0 ? rect.height : 2000;
    }

    const scaleX = cardsW / SVG_VIEWBOX_W;
    const scaleY = cardsH / SVG_VIEWBOX_H;

    return new THREE.Vector3(
      (svgX - SVG_VIEWBOX_W / 2) * scaleX,
      (SVG_VIEWBOX_H / 2 - svgY) * scaleY,
      0
    );
  }

  _buildCurvePath() {
    this._curvePath = new THREE.CurvePath();
    for (const seg of SVG_SEGMENTS) {
      this._curvePath.add(new THREE.CubicBezierCurve3(
        this._mapSvgPoint(seg.p0[0], seg.p0[1]),
        this._mapSvgPoint(seg.cp1[0], seg.cp1[1]),
        this._mapSvgPoint(seg.cp2[0], seg.cp2[1]),
        this._mapSvgPoint(seg.p1[0], seg.p1[1])
      ));
    }
    this._points = this._curvePath.getPoints(PATH_SAMPLES);
  }

  _buildLUT() {
    const lutSize = 1000;
    this._lutPoints = new Array(lutSize);

    for (let i = 0; i < lutSize; i++) {
      const t = i / (lutSize - 1);
      this._lutPoints[i] = this._curvePath.getPointAt(t);
    }
  }

  _buildRibbonGeometry() {
    const w = this.geomParams.grooveWidth / 2;
    const depth = this.geomParams.grooveDepth;
    const numCornerSteps = 6;
    const crossSection = [];

    crossSection.push({ x: -w - this.geomParams.wallThickness, y: 0, nu: -1, nv: 0 });
    crossSection.push({ x: -w, y: 0, nu: -1, nv: 0 });

    for (let i = 0; i <= numCornerSteps; i++) {
      const angle = Math.PI + (i / numCornerSteps) * (Math.PI / 2);
      crossSection.push({
        x: -w + depth + Math.cos(angle) * depth,
        y: Math.sin(angle) * depth,
        nu: Math.cos(angle),
        nv: Math.sin(angle)
      });
    }

    for (let i = 0; i <= numCornerSteps; i++) {
      const angle = (1.5 * Math.PI) + (i / numCornerSteps) * (Math.PI / 2);
      crossSection.push({
        x: w - depth + Math.cos(angle) * depth,
        y: Math.sin(angle) * depth,
        nu: Math.cos(angle),
        nv: Math.sin(angle)
      });
    }

    crossSection.push({ x: w + this.geomParams.wallThickness, y: 0, nu: 1, nv: 0 });

    const verticesPerPoint = crossSection.length;
    const numPoints = this._points.length;
    const positions = new Float32Array(numPoints * verticesPerPoint * 3);
    const normals = new Float32Array(numPoints * verticesPerPoint * 3);
    const uvs = new Float32Array(numPoints * verticesPerPoint * 2);
    const pathProgresses = new Float32Array(numPoints * verticesPerPoint);

    for (let i = 0; i < numPoints; i++) {
      const pt = this._points[i];
      const uProgress = i / (numPoints - 1);
      const nextIdx = Math.min(i + 1, numPoints - 1);
      const prevIdx = Math.max(i - 1, 0);
      const nextPt = this._points[nextIdx];
      const prevPt = this._points[prevIdx];

      const tangent = new THREE.Vector3(nextPt.x - prevPt.x, nextPt.y - prevPt.y, 0).normalize();
      const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();

      const baseIdx = i * verticesPerPoint * 3;
      const uvBaseIdx = i * verticesPerPoint * 2;
      const progBaseIdx = i * verticesPerPoint;

      for (let k = 0; k < verticesPerPoint; k++) {
        const cs = crossSection[k];
        positions[baseIdx + k * 3 + 0] = pt.x + (normal.x * cs.x);
        positions[baseIdx + k * 3 + 1] = pt.y + (normal.y * cs.x);
        positions[baseIdx + k * 3 + 2] = cs.y;

        normals[baseIdx + k * 3 + 0] = normal.x * cs.nu;
        normals[baseIdx + k * 3 + 1] = normal.y * cs.nu;
        normals[baseIdx + k * 3 + 2] = cs.nv;

        uvs[uvBaseIdx + k * 2 + 0] = uProgress;
        uvs[uvBaseIdx + k * 2 + 1] = k / verticesPerPoint;
        pathProgresses[progBaseIdx + k] = uProgress;
      }
    }

    const numSegments = numPoints - 1;
    const indicesPerSegment = (verticesPerPoint - 1) * 6;
    const indices = new Uint32Array(numSegments * indicesPerSegment);
    let idx = 0;

    for (let i = 0; i < numSegments; i++) {
      const curr = i * verticesPerPoint;
      const next = (i + 1) * verticesPerPoint;

      for (let k = 0; k < verticesPerPoint - 1; k++) {
        const kNext = k + 1;
        indices[idx++] = curr + k;
        indices[idx++] = next + k;
        indices[idx++] = curr + kNext;
        indices[idx++] = curr + kNext;
        indices[idx++] = next + k;
        indices[idx++] = next + kNext;
      }
    }

    this._ribbonGeometry = new THREE.BufferGeometry();
    this._ribbonGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this._ribbonGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    this._ribbonGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this._ribbonGeometry.setAttribute('aPathProgress', new THREE.BufferAttribute(pathProgresses, 1));
    this._ribbonGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    this._ribbonGeometry.computeVertexNormals();
    this._totalIndexCount = indices.length;
    this._ribbonGeometry.setDrawRange(0, 0);
  }

  _loadAssets() {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/env/warehouse.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      this._hdrEnvMap = envMap;
      if (this._sphereMaterial) {
        this._sphereMaterial.envMap = envMap;
        this._sphereMaterial.needsUpdate = true;
      }
    });

    const loader = new THREE.TextureLoader();
    loader.load('/textures/noise.webp', (tex) => {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(15.7, 2.1);
      this._textures.noise = tex;
      if (this._ribbonMaterial) {
        this._ribbonMaterial.map = tex;
        this._ribbonMaterial.bumpMap = tex;
        this._ribbonMaterial.bumpScale = 0.05;
        this._ribbonMaterial.needsUpdate = true;
      }
    });
  }

  _buildMaterial() {
    this._gradientUniforms = {
      uColorStart: { value: new THREE.Color('#5900ff') },
      uColorEnd: { value: new THREE.Color('#00d4ff') },
      uFresnelColor: { value: new THREE.Color('#ade9ff') }
    };

    this._ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.0,
      metalness: 0.6,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    this._ribbonMaterial.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this._gradientUniforms);

      shader.vertexShader = `
        attribute float aPathProgress;
        varying float vPathProgress;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vPathProgress = aPathProgress;`
      );

      shader.fragmentShader = `
        varying float vPathProgress;
        uniform vec3 uColorStart;
        uniform vec3 uColorEnd;
        uniform vec3 uFresnelColor;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        float uPos = clamp(vPathProgress, 0.0, 1.0);
        vec3 gradColor = mix(uColorStart, uColorEnd, smoothstep(0.0, 1.0, uPos));

        diffuseColor.rgb = gradColor;

        #ifdef USE_MAP
          vec4 texColor = texture2D(map, vMapUv);
          float grainFactor = (texColor.r - 0.5) * 0.55;
          diffuseColor.rgb = clamp(diffuseColor.rgb + vec3(grainFactor), 0.0, 1.0);
        #endif

        vec3 norm = normalize(vNormal);
        float fresnel = max(0.0, dot(norm, vec3(0.0, 0.0, 1.0)));
        fresnel = pow(1.0 - fresnel, 2.0);
        diffuseColor.rgb += uFresnelColor * fresnel * 0.3;
        `
      );
    };
  }

  _buildSphere() {
    const radius = 8.0;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);

    this._sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1.0,
      transparent: true,
      roughness: 0.15,
      ior: 1.45,
      dispersion: 0.02,
      thickness: 8.0,
      envMapIntensity: 1.5
    });

    if (this._hdrEnvMap) {
      this._sphereMaterial.envMap = this._hdrEnvMap;
    }

    this._sphereMesh = new THREE.Mesh(geometry, this._sphereMaterial);
    this._sphereMesh.visible = false;
    this._group.add(this._sphereMesh);
  }

  _createMesh() {
    if (this._ribbonMesh) {
      this._group.remove(this._ribbonMesh);
    }
    this._ribbonMesh = new THREE.Mesh(this._ribbonGeometry, this._ribbonMaterial);
    this._group.add(this._ribbonMesh);
  }

  setScrollProgress(progress) {
    this._progress = Math.max(0, Math.min(1, progress));
    
    if (this._ribbonGeometry) {
      const drawIndices = Math.floor(this._progress * this._totalIndexCount);
      this._ribbonGeometry.setDrawRange(0, drawIndices);
    }

    if (this._sphereMesh && this._lutPoints.length > 0) {
      if (this._progress > 0.01) {
        const lutIdx = Math.min(
          Math.floor(this._progress * (this._lutPoints.length - 1)),
          this._lutPoints.length - 1
        );
        const pt = this._lutPoints[lutIdx];
        this._sphereMesh.position.set(pt.x, pt.y, -2.0);
        this._sphereMesh.visible = true;
      } else {
        this._sphereMesh.visible = false;
      }
    }
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this._camera.aspect = w / h;
    const depth = h / (2 * Math.tan((FOV * Math.PI) / 360));
    this._camera.position.set(0, 0, depth);
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(w, h);
  }

  _tick() {
    if (!this._renderer) return;

    const cardsEl = this._cardsEl || (this._sectionEl ? this._sectionEl.querySelector('.it-flow-cards') : null);
    if (cardsEl && this._group) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rect = cardsEl.getBoundingClientRect();

      // Position center of WebGL group directly at center top of .it-flow-cards
      const cardsCenterX = rect.left + rect.width / 2 - w / 2;
      const cardsCenterY = h / 2 - (rect.top + rect.height / 2);

      this._group.position.set(
        cardsCenterX,
        cardsCenterY,
        -5.0
      );
    }

    this._renderer.render(this._scene, this._camera);
    this._animationFrameId = requestAnimationFrame(this._tick);
  }

  destroy() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
    }
    window.removeEventListener('resize', this._onResize);
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    if (this._ribbonGeometry) this._ribbonGeometry.dispose();
    if (this._ribbonMaterial) this._ribbonMaterial.dispose();
    if (this._sphereMaterial) this._sphereMaterial.dispose();
    if (this._renderer) this._renderer.dispose();
  }
}
