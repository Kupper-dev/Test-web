/**
 * ItFlowRibbonRenderer — Standalone Three.js 3D Carved Groove & Rolling Sphere Renderer
 *
 * Built exclusively for `.it-flow-section` to avoid touching KupperRibbonRenderer or Hero Ribbon.
 */

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const SVG_SEGMENTS = [
  { p0: [33, 85], cp1: [477, 85], cp2: [667, 192], p1: [667, 286] },
  { p0: [667, 286], cp1: [667, 510], cp2: [569, 582], p1: [477, 581] },
  { p0: [477, 581], cp1: [285, 579], cp2: [119, 654], p1: [119, 747] },
  { p0: [119, 747], cp1: [119, 1025], cp2: [193, 1194], p1: [285, 1194] },
  { p0: [285, 1194], cp1: [479, 1194], cp2: [667, 1288], p1: [667, 1382] },
  { p0: [667, 1382], cp1: [667, 1610], cp2: [563, 1707], p1: [453, 1707] },
  { p0: [453, 1707], cp1: [239, 1707], cp2: [105, 1707], p1: [105, 1707] }
];

const SVG_MAT_SCALE = 0.575343;
const SVG_TX = -1.37604;
const SVG_TY = 282.597;
const SVG_VIEWBOX_W = 1920;
const PATH_SAMPLES = 600;
const FOV = 45;

export class ItFlowRibbonRenderer {
  constructor(sectionEl) {
    this._sectionEl = sectionEl;
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
    const w = window.innerWidth;
    const xTransformed = svgX * SVG_MAT_SCALE + SVG_TX;
    const yTransformed = svgY * SVG_MAT_SCALE + SVG_TY;
    const scale = w / SVG_VIEWBOX_W;

    return new THREE.Vector3(
      xTransformed * scale,
      -yTransformed * scale,
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
    this._animationFrameId = requestAnimationFrame(this._tick);
    this._renderer.render(this._scene, this._camera);
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
