/**
 * ItFlowRibbonRenderer — Standalone Three.js 3D Carved Groove & Rolling Sphere Renderer
 *
 * Built exclusively for `.it-flow-section` to avoid touching KupperRibbonRenderer or Hero Ribbon.
 */

import GUI from 'lil-gui';
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

    // Config parameters with lil-gui safety strings (Updated from user calibration)
    this.config = {
      pathTrimStart: 0.12,    // 12% trim
      pathTrimEnd: 0.96,      // 4% trim
      scaleXMultiplier: 1.24, // Width scale 1.24x
      svgCenterX: 393,        // Leftward alignment offset 393

      grooveWidth: 37.5,      // Groove Width 37.5
      grooveDepth: 13.0,      // Groove Depth 13.0
      wallThickness: 3.0,     // Lip Thickness 3.0
      trenchInnerRadius: 17.5,// Inner Fillet Radius 17.5

      colorStart: '#4452cf',  // Calibrated Start Color
      colorEnd: '#009dff',    // Calibrated End Color
      fresnelColor: '#47ceff',// Calibrated Rim Highlight Color
      
      roughness: 0.4,         // Roughness 0.4
      metalness: 0.5,         // Metalness 0.5
      bumpScale: 0.3,         // Noise Bump Scale 0.3
      noiseRepeatX: 31.5,     // Tiling X 31.5
      noiseRepeatY: 2.4,      // Tiling Y 2.4

      // Lighting Control Knobs
      ambientLightIntensity: 0.9,
      keyLightIntensity: 7.0,
      fillLightIntensity: 6.3
    };

    this.geomParams = {
      grooveWidth: this.config.grooveWidth,
      grooveDepth: this.config.grooveDepth,
      wallThickness: this.config.wallThickness
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

    this._setupGUI();

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

    const scaleX = (cardsW / SVG_VIEWBOX_W) * this.config.scaleXMultiplier;
    const scaleY = cardsH / SVG_VIEWBOX_H;

    return new THREE.Vector3(
      (svgX - this.config.svgCenterX) * scaleX,
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

    // Sample points trimmed to user start/end bounds so ends start/end behind cards
    const rawPoints = [];
    const step = (this.config.pathTrimEnd - this.config.pathTrimStart) / PATH_SAMPLES;
    for (let i = 0; i <= PATH_SAMPLES; i++) {
      const t = this.config.pathTrimStart + i * step;
      rawPoints.push(this._curvePath.getPointAt(t));
    }
    this._points = rawPoints;
  }

  _buildLUT() {
    const lutSize = 1000;
    this._lutPoints = new Array(lutSize);

    for (let i = 0; i < lutSize; i++) {
      const tRel = i / (lutSize - 1);
      const t = this.config.pathTrimStart + tRel * (this.config.pathTrimEnd - this.config.pathTrimStart);
      this._lutPoints[i] = this._curvePath.getPointAt(t);
    }
  }

  _buildRibbonGeometry() {
    const w = this.config.grooveWidth / 2;
    const depth = this.config.grooveDepth;
    const wall = this.config.wallThickness;
    const r = Math.min(this.config.trenchInnerRadius, depth);
    const numCornerSteps = 8;
    const crossSection = [];

    // Outer top flange left (flush with surface Z=0)
    crossSection.push({ x: -w - wall, y: 0, nu: -0.707, nv: 0.707 });
    // Sharp carved lip left
    crossSection.push({ x: -w, y: 0, nu: -0.707, nv: 0.707 });

    // Vertical wall left
    crossSection.push({ x: -w, y: -depth + r, nu: -1, nv: 0 });

    // Curved bottom left fillet
    for (let i = 0; i <= numCornerSteps; i++) {
      const angle = Math.PI + (i / numCornerSteps) * (Math.PI / 2);
      crossSection.push({
        x: -w + r + Math.cos(angle) * r,
        y: -depth + r + Math.sin(angle) * r,
        nu: Math.cos(angle),
        nv: Math.sin(angle)
      });
    }

    // Curved bottom right fillet
    for (let i = 0; i <= numCornerSteps; i++) {
      const angle = (1.5 * Math.PI) + (i / numCornerSteps) * (Math.PI / 2);
      crossSection.push({
        x: w - r + Math.cos(angle) * r,
        y: -depth + r + Math.sin(angle) * r,
        nu: Math.cos(angle),
        nv: Math.sin(angle)
      });
    }

    // Vertical wall right
    crossSection.push({ x: w, y: -depth + r, nu: 1, nv: 0 });

    // Sharp carved lip right
    crossSection.push({ x: w, y: 0, nu: 0.707, nv: 0.707 });
    // Outer top flange right
    crossSection.push({ x: w + wall, y: 0, nu: 0.707, nv: 0.707 });

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
    
    // Groove track is always 100% drawn/visible (no self-drawing stroke animation)
    if (this._ribbonGeometry) {
      this._ribbonGeometry.setDrawRange(0, this._totalIndexCount);
    }

    // Ball playhead rolls smoothly inside trench cradle along scroll progress
    if (this._sphereMesh && this._lutPoints.length > 0) {
      if (this._progress >= 0) {
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

  _setupGUI() {
    this._gui = new GUI({ title: 'IT Flow Carved Groove Controls' });

    // 1. Path Alignment & Trimming Folder
    const alignFolder = this._gui.addFolder('Alignment & Trimming');
    alignFolder.add(this.config, 'pathTrimStart', 0.0, 0.3, 0.01).name('Start Trim').onChange(() => this._rebuildAll());
    alignFolder.add(this.config, 'pathTrimEnd', 0.7, 1.0, 0.01).name('End Trim').onChange(() => this._rebuildAll());
    alignFolder.add(this.config, 'scaleXMultiplier', 1.0, 2.5, 0.02).name('Width Scale (X)').onChange(() => this._rebuildAll());
    alignFolder.add(this.config, 'svgCenterX', 250, 500, 1).name('Center X (Left/Right)').onChange(() => this._rebuildAll());

    // 2. 3D Carved Groove Geometry Folder
    const geomFolder = this._gui.addFolder('Groove Geometry');
    geomFolder.add(this.config, 'grooveWidth', 10, 60, 0.5).name('Groove Width').onChange(() => this._rebuildAll());
    geomFolder.add(this.config, 'grooveDepth', 4, 30, 0.5).name('Groove Depth').onChange(() => this._rebuildAll());
    geomFolder.add(this.config, 'wallThickness', 0.5, 10, 0.5).name('Lip Thickness').onChange(() => this._rebuildAll());
    geomFolder.add(this.config, 'trenchInnerRadius', 1, 20, 0.5).name('Inner Fillet Radius').onChange(() => this._rebuildAll());

    // 3. Gradient & Shading Folder
    const colorFolder = this._gui.addFolder('Gradient & Shading');
    colorFolder.addColor(this.config, 'colorStart').name('Start Color (Purple)').onChange((v) => {
      this._gradientUniforms.uColorStart.value.set(v);
    });
    colorFolder.addColor(this.config, 'colorEnd').name('End Color (Cyan)').onChange((v) => {
      this._gradientUniforms.uColorEnd.value.set(v);
    });
    colorFolder.addColor(this.config, 'fresnelColor').name('Rim Highlight Color').onChange((v) => {
      this._gradientUniforms.uFresnelColor.value.set(v);
    });
    colorFolder.add(this.config, 'roughness', 0.0, 1.0, 0.05).name('Roughness').onChange((v) => {
      if (this._ribbonMaterial) this._ribbonMaterial.roughness = v;
    });
    colorFolder.add(this.config, 'metalness', 0.0, 1.0, 0.05).name('Metalness').onChange((v) => {
      if (this._ribbonMaterial) this._ribbonMaterial.metalness = v;
    });

    // 4. Noise Texture Folder
    const noiseFolder = this._gui.addFolder('Noise Grain Texture');
    noiseFolder.add(this.config, 'bumpScale', 0.0, 0.3, 0.01).name('Noise Bump Scale').onChange((v) => {
      if (this._textures.noise) this._textures.noise.bumpScale = v;
    });
    noiseFolder.add(this.config, 'noiseRepeatX', 1.0, 50.0, 0.5).name('Tiling X').onChange((v) => {
      if (this._textures.noise) {
        this._textures.noise.repeat.x = v;
        this._textures.noise.needsUpdate = true;
      }
    });
    noiseFolder.add(this.config, 'noiseRepeatY', 0.5, 10.0, 0.1).name('Tiling Y').onChange((v) => {
      if (this._textures.noise) {
        this._textures.noise.repeat.y = v;
        this._textures.noise.needsUpdate = true;
      }
    });

    // 5. Lighting Folder
    const lightFolder = this._gui.addFolder('Scene Lighting');
    lightFolder.add(this.config, 'ambientLightIntensity', 0.0, 3.0, 0.1).name('Ambient Light').onChange((v) => {
      if (this._ambientLight) this._ambientLight.intensity = v;
    });
    lightFolder.add(this.config, 'keyLightIntensity', 0.0, 15.0, 0.5).name('Key Light').onChange((v) => {
      if (this._keyLight) this._keyLight.intensity = v;
    });
    lightFolder.add(this.config, 'fillLightIntensity', 0.0, 15.0, 0.5).name('Fill Light').onChange((v) => {
      if (this._fillLight) this._fillLight.intensity = v;
    });
  }

  _rebuildAll() {
    this._buildCurvePath();
    this._buildLUT();
    if (this._ribbonGeometry) this._ribbonGeometry.dispose();
    this._buildRibbonGeometry();
    if (this._ribbonMesh) this._ribbonMesh.geometry = this._ribbonGeometry;
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
    if (this._gui) {
      this._gui.destroy();
      this._gui = null;
    }
    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    if (this._ribbonGeometry) this._ribbonGeometry.dispose();
    if (this._ribbonMaterial) this._ribbonMaterial.dispose();
    if (this._sphereMaterial) this._sphereMaterial.dispose();
    if (this._renderer) this._renderer.dispose();
  }
}
