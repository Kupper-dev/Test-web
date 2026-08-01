/**
 * AtuinRibbonRenderer — Custom Three.js 3D Ribbon Strip Renderer
 *
 * Draws a flat, extruded ribbon with rectangular cross-section along a 6-segment
 * cubic Bezier path (sourced from line lusion svg.svg). The ribbon has metallic/glossy
 * MeshPhysicalMaterial shading and is scroll-driven via setScrollProgress().
 *
 * This module creates its own dedicated canvas, scene, camera, and render loop,
 * completely isolated from the existing lusion WebGL canvas.
 */

import GUI from 'lil-gui';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ─── SVG Path Data ───────────────────────────────────────────────────────────
// 6-segment cubic Bezier from line lusion svg.svg
// SVG group transform: matrix(0.575343, 0, 0, 0.575343, -1.37604, 282.597)
const SVG_SEGMENTS = [
  { p0: [52.796, -439.037],  cp1: [308.755, -437.397],  cp2: [1571.89, -207.871],  p1: [878.391, 680.295] },
  { p0: [878.391, 680.295],  cp1: [358.606, 1345.99],   cp2: [-355.117, 522.324],  p1: [520.344, 117.153] },
  { p0: [520.344, 117.153],  cp1: [1571.89, -369.513],  cp2: [1036.56, 848.89],    p1: [2006.41, 113.677] },
  { p0: [2006.41, 113.677],  cp1: [2941.51, -595.185],  cp2: [2030.75, 449.53],    p1: [3169.2, 624.676] },
  { p0: [3169.2, 624.676],   cp1: [3553.32, 683.771],   cp2: [2913.7, 1318.17],    p1: [2762.48, 1452.01] },
  { p0: [2762.48, 1452.01],  cp1: [2319.53, 1844.05],   cp2: [3276.96, 1973.44],   p1: [3276.96, 1973.44] }
];

const SVG_MAT_SCALE = 0.575343;
const SVG_TX = -1.37604;
const SVG_TY = 282.597;
const SVG_VIEWBOX_W = 1920;

// ─── Ribbon Dimensions ──────────────────────────────────────────────────────
const RIBBON_WIDTH = 24;     // Width of the ribbon strip (pixels)
const RIBBON_THICKNESS = 4;  // Depth/height of the rectangular cross-section (pixels)
const PATH_SAMPLES = 600;    // Number of sample points along the curve

// ─── Camera ──────────────────────────────────────────────────────────────────
const FOV = 45;

export class AtuinRibbonRenderer {
  constructor(sectionEl) {
    this._sectionEl = sectionEl;
    this._progress = 0;
    this._opacity = 0;
    this._animationFrameId = null;

    // Create dedicated canvas
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'atuin-ribbon-canvas';
    this._canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
    `;
    document.body.insertBefore(this._canvas, document.body.firstChild);

    // 3D Geometry Tweaks
    this.geomParams = {
      // Shape (Rectangular Prism)
      ribbonWidth: 38.345,
      ribbonThickness: 21.335,
      cornerRadius: 3.728, 
      
      // Z Separation
      zSeparation: -374.0,
      
      // Start Twist
      startTwist: -3.468,
      startTwistEnd: 0.411,
      
      // End Scale
      endScale: 1.070,         
      endScaleStart: 0.968
    };

    // Scene
    this._scene = new THREE.Scene();

    // Custom Uniforms for Refraction Shader Hook & Fluent Design
    this.customUniforms = {
      uCenterColor: { value: new THREE.Color('#3370ff') },
      uEdgeColor: { value: new THREE.Color('#002aa8') },
      uFresnelPower: { value: 0.1 },
      // Animated Inner Light & Prism parameters
      uTime: { value: 0.0 },
      uGlowColor: { value: new THREE.Color('#55aaff') },
      uGlowSpeed: { value: 1.48 }
    };

    // Textures & Environment Maps
    this._textures = {};
    this._hdrEnvMap = null;

    // Renderer
    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      alpha: true,
      antialias: true
    });
    this._renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this._renderer.toneMappingExposure = 1.0;
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Load ANRI Textures and HDR Environment Map
    this._loadAssets();


    // Camera (1:1 pixel mapping at Z=0)
    const w = window.innerWidth;
    const h = window.innerHeight;
    this._camera = new THREE.PerspectiveCamera(FOV, w / h, 1, 5000);
    const depth = h / (2 * Math.tan((FOV * Math.PI) / 360));
    this._camera.position.set(0, 0, depth);

    // Positioning group (offsets ribbon geometry to align with section)
    this._group = new THREE.Group();
    this._scene.add(this._group);

    // Lighting
    this._setupLights();

    // Build path + geometry + material
    this._curvePath = null;
    this._points = [];
    this._ribbonGeometry = null;
    this._ribbonMaterial = null;
    this._ribbonMesh = null;
    this._totalIndexCount = 0;

    this._buildCurvePath();
    this._buildRibbonGeometry();
    this._buildMaterial();
    this._createMesh();

    // Setup GUI for tweaking
    this._setupGUI();

    // Start resize listener
    window.addEventListener('resize', this.resize.bind(this));

    // Start render loop
    this._tick = this._tick.bind(this);
    this._tick();
  }

  // ─── Lighting ──────────────────────────────────────────────────────────────

  _setupLights() {
    this._ambientLight = new THREE.AmbientLight(0xffffff, 1.69);
    this._scene.add(this._ambientLight);
    this._keyLight = new THREE.DirectionalLight(0xffffff, 1.98);
    this._keyLight.position.set(400, 500, 800);
    this._scene.add(this._keyLight);
    this._fillLight = new THREE.DirectionalLight(0x00c6ff, 4.4);
    this._fillLight.position.set(-300, -200, 400);
    this._scene.add(this._fillLight);
  }

  // ─── Path Construction ─────────────────────────────────────────────────────

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

  // ─── Ribbon Geometry ───────────────────────────────────────────────────────

  _buildRibbonGeometry() {
    const safeRadius = Math.max(0.01, Math.min(this.geomParams.cornerRadius, this.geomParams.ribbonThickness / 2.0));
    const numPointsPerCorner = 4;
    const verticesPerPoint = 4 * numPointsPerCorner;

    const crossSection = [];
    const wInner = this.geomParams.ribbonWidth / 2 - safeRadius;
    const hInner = this.geomParams.ribbonThickness / 2 - safeRadius;
    const corners = [
      { cx: wInner, cy: hInner },
      { cx: -wInner, cy: hInner },
      { cx: -wInner, cy: -hInner },
      { cx: wInner, cy: -hInner }
    ];

    for (let c = 0; c < 4; c++) {
      const cx = corners[c].cx;
      const cy = corners[c].cy;
      const startAngle = c * (Math.PI / 2);
      for (let i = 0; i < numPointsPerCorner; i++) {
        const angle = startAngle + (i / numPointsPerCorner) * (Math.PI / 2);
        crossSection.push({
          x: cx + Math.cos(angle) * safeRadius,
          y: cy + Math.sin(angle) * safeRadius,
          nu: Math.cos(angle),
          nv: Math.sin(angle)
        });
      }
    }

    const numPoints = this._points.length;
    const positions = new Float32Array(numPoints * verticesPerPoint * 3);
    const normals = new Float32Array(numPoints * verticesPerPoint * 3);
    const uvs = new Float32Array(numPoints * verticesPerPoint * 2);
    const pathProgresses = new Float32Array(numPoints * verticesPerPoint);

    for (let i = 0; i < numPoints; i++) {
      const pt = this._points[i];
      const uProgress = i / (numPoints - 1);
      const currentZ = Math.pow(uProgress, 2.5) * this.geomParams.zSeparation;
      let currentTwist = 0;
      let currentScale = 1.0;
      
      if (uProgress < this.geomParams.startTwistEnd) {
        const localProgress = uProgress / this.geomParams.startTwistEnd;
        const ease = 1.0 - Math.pow(localProgress, 2.0);
        currentTwist += ease * this.geomParams.startTwist;
      }
      
      if (uProgress > this.geomParams.endScaleStart) {
        const localProgress = (uProgress - this.geomParams.endScaleStart) / (1.0 - this.geomParams.endScaleStart);
        const ease = Math.pow(localProgress, 2.0);
        currentScale = 1.0 + ease * (this.geomParams.endScale - 1.0);
      }

      const nextIdx = Math.min(i + 1, numPoints - 1);
      const prevIdx = Math.max(i - 1, 0);
      const nextPt = this._points[nextIdx];
      const prevPt = this._points[prevIdx];
      const nextProgress = nextIdx / (numPoints - 1);
      const prevProgress = prevIdx / (numPoints - 1);
      const nextZ = Math.pow(nextProgress, 2.5) * this.geomParams.zSeparation;
      const prevZ = Math.pow(prevProgress, 2.5) * this.geomParams.zSeparation;

      const tangent = new THREE.Vector3(nextPt.x - prevPt.x, nextPt.y - prevPt.y, nextZ - prevZ).normalize();
      const up = new THREE.Vector3(0, 0, 1).applyAxisAngle(tangent, currentTwist);
      const normal = new THREE.Vector3().crossVectors(up, tangent).normalize();
      const binormal = new THREE.Vector3().copy(up).normalize();

      const baseIdx = i * verticesPerPoint * 3;
      const uvBaseIdx = i * verticesPerPoint * 2;
      const progBaseIdx = i * verticesPerPoint;

      for (let k = 0; k < verticesPerPoint; k++) {
        const cs = crossSection[k];
        positions[baseIdx + k * 3 + 0] = pt.x + (normal.x * cs.x * currentScale) + (binormal.x * cs.y * currentScale);
        positions[baseIdx + k * 3 + 1] = pt.y + (normal.y * cs.x * currentScale) + (binormal.y * cs.y * currentScale);
        positions[baseIdx + k * 3 + 2] = currentZ + (normal.z * cs.x * currentScale) + (binormal.z * cs.y * currentScale);
        normals[baseIdx + k * 3 + 0] = normal.x * cs.nu + binormal.x * cs.nv;
        normals[baseIdx + k * 3 + 1] = normal.y * cs.nu + binormal.y * cs.nv;
        normals[baseIdx + k * 3 + 2] = normal.z * cs.nu + binormal.z * cs.nv;
        uvs[uvBaseIdx + k * 2 + 0] = uProgress;
        uvs[uvBaseIdx + k * 2 + 1] = k / verticesPerPoint;
        pathProgresses[progBaseIdx + k] = uProgress;
      }
    }

    const numSegments = numPoints - 1;
    const indicesPerSegment = verticesPerPoint * 6;
    const indices = new Uint32Array(numSegments * indicesPerSegment);
    let idx = 0;

    for (let i = 0; i < numSegments; i++) {
      const curr = i * verticesPerPoint;
      const next = (i + 1) * verticesPerPoint;

      for (let k = 0; k < verticesPerPoint; k++) {
        const kNext = (k + 1) % verticesPerPoint;
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

  // ─── Asset Loading ──────────────────────────────────────────────────────────

  _loadAssets() {
    const texLoader = new THREE.TextureLoader();
    const loadTex = (name, url, wrapS = THREE.RepeatWrapping, wrapT = THREE.RepeatWrapping) => {
      texLoader.load(url, (tex) => {
        tex.wrapS = wrapS;
        tex.wrapT = wrapT;
        this._textures[name] = tex;
        if (this._ribbonMaterial) this._ribbonMaterial.needsUpdate = true;
      });
    };

    const rgbeLoader = new RGBELoader();

    // 1. Environment Map (Warehouse HDR)
    rgbeLoader.load('/env/warehouse.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      this._hdrEnvMap = envMap;
      this._scene.environment = envMap;
      if (this._ribbonMaterial) {
        this._ribbonMaterial.envMap = envMap;
        this._ribbonMaterial.envMapIntensity = 1.0;
        this._ribbonMaterial.needsUpdate = true;
      }
    });

    // 2. Texture Maps
    loadTex('noise', '/textures/noise.webp');
  }

  // ─── Material ──────────────────────────────────────────────────────────────

  _buildMaterial() {
    this._gradientUniforms = {
      uColorDark: { value: new THREE.Color('#000424') },   // Color 1
      uPosDark: { value: 0.0 },                            // Position % for Color 1
      uColorMid: { value: new THREE.Color('#003be6') },    // Color 2
      uPosMid: { value: 0.45 },                            // Position % for Color 2
      uColorLight: { value: new THREE.Color('#00e5ff') },  // Color 3
      uPosLight: { value: 1.0 },                           // Position % for Color 3
      uFresnelColor: { value: new THREE.Color('#50d0ff') } // Fresnel Rim Light Color
    };

    this._ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.32,
      metalness: 0.45,
      transparent: false,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true,
      envMapIntensity: 1.8
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
        uniform vec3 uColorDark;
        uniform float uPosDark;
        uniform vec3 uColorMid;
        uniform float uPosMid;
        uniform vec3 uColorLight;
        uniform float uPosLight;
        uniform vec3 uFresnelColor;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        // True un-tiled linear path progress from start (0.0) to end (1.0) of 3D curve
        float uPos = clamp(vPathProgress, 0.0, 1.0);
        
        // Multi-stop color ramp with independent position controls per color stop
        vec3 gradColor;
        if (uPos <= uPosDark) {
          gradColor = uColorDark;
        } else if (uPos <= uPosMid) {
          float t = (uPos - uPosDark) / max(0.001, (uPosMid - uPosDark));
          gradColor = mix(uColorDark, uColorMid, smoothstep(0.0, 1.0, t));
        } else if (uPos <= uPosLight) {
          float t = (uPos - uPosMid) / max(0.001, (uPosLight - uPosMid));
          gradColor = mix(uColorMid, uColorLight, smoothstep(0.0, 1.0, t));
        } else {
          gradColor = uColorLight;
        }

        // Apply gradient directly as material base color
        diffuseColor.rgb = gradColor;

        // Overlay high-contrast noise texture micro-grain
        #ifdef USE_MAP
          vec4 texColor = texture2D(map, vMapUv);
          // High-contrast grain blend: amplifies dark and light speckles over blue gradient
          float grainFactor = (texColor.r - 0.5) * 0.55;
          diffuseColor.rgb = clamp(diffuseColor.rgb + vec3(grainFactor), 0.0, 1.0);
        #endif

        // Rim / Fresnel edge highlight
        vec3 norm = normalize(vNormal);
        float fresnel = max(0.0, dot(norm, vec3(0.0, 0.0, 1.0)));
        fresnel = pow(1.0 - fresnel, 2.0);
        diffuseColor.rgb += uFresnelColor * fresnel * 0.4;
        `
      );
    };
  }

  // ─── Tweak Controls ────────────────────────────────────────────────────────

  _setupGUI() {
    this._gui = new GUI({ title: 'Ribbon Tweak Panel' });
    this._gui.domElement.style.zIndex = '9999';
    
    const params = {
      preset: 'ANRI - Matte Granite / Rough Stone (Image 1)',
      colorDark: '#000424',
      posDark: 0.0,
      colorMid: '#003be6',
      posMid: 0.45,
      colorLight: '#00e5ff',
      posLight: 1.0,
      fresnelColor: '#50d0ff',
      roughness: 0.32,
      metalness: 0.45,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      transmission: 0.0,
      envMapIntensity: 1.8,
      bumpScale: 0.05,
      normalScale: 1.0,
      uvRepeatX: 22.0,
      uvRepeatY: 2.0,
      keyLightIntensity: this._keyLight.intensity,
      fillLightIntensity: this._fillLight.intensity,
      ambientLightIntensity: this._ambientLight.intensity,
      exportConfig: () => this._exportCurrentConfig(params)
    };

    // ANRI Texture Presets Folder
    const textureFolder = this._gui.addFolder('ANRI Material Presets');
    textureFolder.add(params, 'preset', [
      'ANRI - Matte Granite / Rough Stone (Image 1)',
      'ANRI - Glossy White Acrylic / Glass (Image 2)',
      'ANRI - Polished Dark Onyx / Steel (Image 3)',
      'ANRI - Semi-Translucent Frosted Glass',
      'ANRI - Organic Marble Swirl'
    ]).name('Material Preset').onChange((presetName) => {
      this._applyTexturePreset(presetName, params);
    });

    // 1. Dedicated Gradient & Stop Positions Folder
    const gradientFolder = this._gui.addFolder('Gradient & Stop Positions');
    gradientFolder.addColor(params, 'colorDark').name('Stop 1 Color (Start)').onChange(v => this._gradientUniforms.uColorDark.value.set(v));
    gradientFolder.add(params, 'posDark', 0.0, 1.0, 0.01).name('Stop 1 Position %').onChange(v => this._gradientUniforms.uPosDark.value = v);
    
    gradientFolder.addColor(params, 'colorMid').name('Stop 2 Color (Mid)').onChange(v => this._gradientUniforms.uColorMid.value.set(v));
    gradientFolder.add(params, 'posMid', 0.0, 1.0, 0.01).name('Stop 2 Position %').onChange(v => this._gradientUniforms.uPosMid.value = v);
    
    gradientFolder.addColor(params, 'colorLight').name('Stop 3 Color (End)').onChange(v => this._gradientUniforms.uColorLight.value.set(v));
    gradientFolder.add(params, 'posLight', 0.0, 1.0, 0.01).name('Stop 3 Position %').onChange(v => this._gradientUniforms.uPosLight.value = v);
    
    gradientFolder.addColor(params, 'fresnelColor').name('Fresnel Rim Light').onChange(v => this._gradientUniforms.uFresnelColor.value.set(v));

    // 2. Texture & UV Repeat Folder
    const texControlFolder = this._gui.addFolder('Texture Tiling & Normal');
    texControlFolder.add(params, 'bumpScale', 0, 0.2, 0.005).name('Grain Bump Scale').onChange(v => {
      if (this._ribbonMaterial.bumpMap) this._ribbonMaterial.bumpScale = v;
    });
    texControlFolder.add(params, 'normalScale', 0, 5).name('Normal Intensity').onChange(v => {
      if (this._ribbonMaterial.normalMap) this._ribbonMaterial.normalScale.set(v, v);
    });
    texControlFolder.add(params, 'uvRepeatX', 1, 50).name('Repeat X (Length)').onChange(v => {
      params.uvRepeatX = v;
      this._updateTextureRepeat(params);
    });
    texControlFolder.add(params, 'uvRepeatY', 1, 10).name('Repeat Y (Width)').onChange(v => {
      params.uvRepeatY = v;
      this._updateTextureRepeat(params);
    });

    // 3. PBR Surface Properties Folder
    const pbrFolder = this._gui.addFolder('PBR Surface Properties');
    pbrFolder.add(params, 'roughness', 0, 1).onChange(v => this._ribbonMaterial.roughness = v);
    pbrFolder.add(params, 'metalness', 0, 1).onChange(v => this._ribbonMaterial.metalness = v);
    pbrFolder.add(params, 'clearcoat', 0, 1).onChange(v => this._ribbonMaterial.clearcoat = v);
    pbrFolder.add(params, 'clearcoatRoughness', 0, 1).onChange(v => this._ribbonMaterial.clearcoatRoughness = v);
    pbrFolder.add(params, 'transmission', 0, 1).name('Transmission (Glass)').onChange(v => {
      this._ribbonMaterial.transmission = v;
      this._ribbonMaterial.transparent = v > 0;
      this._ribbonMaterial.needsUpdate = true;
    });
    pbrFolder.add(params, 'envMapIntensity', 0, 5).name('EnvMap Reflectivity').onChange(v => this._ribbonMaterial.envMapIntensity = v);

    // 4. Lighting Controls Folder
    const lightFolder = this._gui.addFolder('Lighting');
    lightFolder.add(params, 'keyLightIntensity', 0, 10).name('Key Light').onChange(v => this._keyLight.intensity = v);
    lightFolder.add(params, 'fillLightIntensity', 0, 10).name('Fill Light').onChange(v => this._fillLight.intensity = v);
    lightFolder.add(params, 'ambientLightIntensity', 0, 5).name('Ambient Light').onChange(v => this._ambientLight.intensity = v);

    // 5. 3D Shape & Geometry Controls Folder
    const rebuild = () => this._rebuildGeometry();
    const shapeFolder = this._gui.addFolder('Ribbon Prism Shape');
    shapeFolder.add(this.geomParams, 'ribbonWidth', 5, 100).name('Width').onChange(rebuild);
    shapeFolder.add(this.geomParams, 'ribbonThickness', 1, 50).name('Thickness').onChange(rebuild);
    shapeFolder.add(this.geomParams, 'cornerRadius', 0.01, 20).name('Corner Radius').onChange(rebuild);

    const geoFolder = this._gui.addFolder('3D Geometry & Twists');
    geoFolder.add(this.geomParams, 'zSeparation', -1000, 1000).name('Z Separation').onChange(rebuild);
    geoFolder.add(this.geomParams, 'startTwist', -Math.PI*2, Math.PI*2).name('Start Twist').onChange(rebuild);
    geoFolder.add(this.geomParams, 'startTwistEnd', 0.0, 0.5).name('Start Twist End %').onChange(rebuild);
    geoFolder.add(this.geomParams, 'endScale', 0.1, 5.0).name('End Scale').onChange(rebuild);
    geoFolder.add(this.geomParams, 'endScaleStart', 0.5, 1.0).name('End Scale Start %').onChange(rebuild);

    // 6. Config Exporter Button
    const exportFolder = this._gui.addFolder('Save & Export Config');
    exportFolder.add(params, 'exportConfig').name('📋 Export Config');

    // Initial preset setup
    setTimeout(() => this._applyTexturePreset(params.preset, params), 200);
  }

  _exportCurrentConfig(params) {
    const config = {
      colorDark: '#' + this._gradientUniforms.uColorDark.value.getHexString(),
      posDark: this._gradientUniforms.uPosDark.value,
      colorMid: '#' + this._gradientUniforms.uColorMid.value.getHexString(),
      posMid: this._gradientUniforms.uPosMid.value,
      colorLight: '#' + this._gradientUniforms.uColorLight.value.getHexString(),
      posLight: this._gradientUniforms.uPosLight.value,
      fresnelColor: '#' + this._gradientUniforms.uFresnelColor.value.getHexString(),
      roughness: this._ribbonMaterial.roughness,
      metalness: this._ribbonMaterial.metalness,
      clearcoat: this._ribbonMaterial.clearcoat || 0,
      transmission: this._ribbonMaterial.transmission || 0,
      envMapIntensity: this._ribbonMaterial.envMapIntensity,
      bumpScale: this._ribbonMaterial.bumpScale || 0.05,
      normalScale: params.normalScale || 1.0,
      uvRepeatX: params.uvRepeatX || 22.0,
      uvRepeatY: params.uvRepeatY || 2.0,
      keyLightIntensity: this._keyLight.intensity,
      fillLightIntensity: this._fillLight.intensity,
      ambientLightIntensity: this._ambientLight.intensity
    };

    const jsonString = JSON.stringify(config, null, 2);
    console.log('=== RIBBON MATERIAL CONFIG ===\n', jsonString);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(jsonString);
      alert('Config copied to clipboard & logged in browser console!\n\n' + jsonString);
    } else {
      prompt('Copy your current tweaked config:', jsonString);
    }
  }

  _applyTexturePreset(presetName, params) {
    if (!this._ribbonMaterial) return;

    // Reset maps & physical properties
    this._ribbonMaterial.normalMap = null;
    this._ribbonMaterial.map = null;
    this._ribbonMaterial.bumpMap = null;
    this._ribbonMaterial.transmission = 0;
    this._ribbonMaterial.transparent = false;
    this._ribbonMaterial.clearcoat = 0;

    switch (presetName) {
      case 'ANRI - Matte Granite / Rough Stone (Image 1)':
        // Exact user-tweaked configuration
        if (this._gradientUniforms) {
          this._gradientUniforms.uColorDark.value.set('#012eff');
          this._gradientUniforms.uPosDark.value = 0.0;
          this._gradientUniforms.uColorMid.value.set('#0062ff');
          this._gradientUniforms.uPosMid.value = 0.07;
          this._gradientUniforms.uColorLight.value.set('#47b9ff');
          this._gradientUniforms.uPosLight.value = 0.7;
          this._gradientUniforms.uFresnelColor.value.set('#ade9ff');
        }

        if (params) {
          params.colorDark = '#012eff';
          params.posDark = 0.0;
          params.colorMid = '#0062ff';
          params.posMid = 0.07;
          params.colorLight = '#47b9ff';
          params.posLight = 0.7;
          params.fresnelColor = '#ade9ff';
          params.roughness = 0.0;
          params.metalness = 0.6;
          params.transmission = 0.4;
          params.envMapIntensity = 1.0;
          params.bumpScale = 0.05;
          params.uvRepeatX = 15.7;
          params.uvRepeatY = 2.1;
          params.keyLightIntensity = 7.0;
          params.fillLightIntensity = 6.3;
          params.ambientLightIntensity = 0.9;
        }

        this._ribbonMaterial.roughness = 0.0;
        this._ribbonMaterial.metalness = 0.6;
        this._ribbonMaterial.transmission = 0.4;
        this._ribbonMaterial.thickness = 8.0;
        this._ribbonMaterial.ior = 1.45;
        this._ribbonMaterial.transparent = true;
        this._ribbonMaterial.opacity = 1.0;
        this._ribbonMaterial.envMapIntensity = 1.0;

        // Dedicated Lighting ecosystem
        this._keyLight.intensity = 7.0;
        this._keyLight.color.set('#ffffff');
        this._fillLight.intensity = 6.3;
        this._fillLight.color.set('#00b3ff');
        this._ambientLight.intensity = 0.9;

        if (this._textures.noise) {
          this._textures.noise.repeat.set(15.7, 2.1);
          this._ribbonMaterial.map = this._textures.noise;
          this._ribbonMaterial.bumpMap = this._textures.noise;
          this._ribbonMaterial.bumpScale = 0.05;
        }
        break;

      default:
        this._ribbonMaterial.color.set(params.color);
        this._ribbonMaterial.roughness = params.roughness;
        this._ribbonMaterial.metalness = params.metalness;
        break;
    }

    this._updateTextureRepeat(params);
    this._ribbonMaterial.needsUpdate = true;
  }

  _updateTextureRepeat(params) {
    Object.keys(this._textures).forEach(key => {
      if (this._textures[key]) {
        this._textures[key].repeat.set(params.uvRepeatX, params.uvRepeatY);
        this._textures[key].needsUpdate = true;
      }
    });
  }

  // ─── Mesh ──────────────────────────────────────────────────────────────────

  _rebuildGeometry() {
    if (this._ribbonGeometry) {
      this._ribbonGeometry.dispose();
    }
    this._buildRibbonGeometry();
    if (this._ribbonMesh) {
      this._ribbonMesh.geometry = this._ribbonGeometry;
    }
  }

  _createMesh() {
    this._ribbonMesh = new THREE.Mesh(this._ribbonGeometry, this._ribbonMaterial);
    this._ribbonMesh.renderOrder = 1;
    this._group.add(this._ribbonMesh);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Set the scroll-driven draw progress (0.0 = hidden, 1.0 = fully drawn)
   */
  setScrollProgress(progress) {
    this._progress = Math.max(0, Math.min(1, progress));
    const count = Math.floor(this._progress * this._totalIndexCount);
    // Ensure count is a multiple of 3 (complete triangles)
    const safeCount = count - (count % 3);
    this._ribbonGeometry.setDrawRange(0, safeCount);
  }

  /**
   * Set the canvas CSS opacity (for hero→home-reel fade transition)
   */
  setOpacity(opacity) {
    this._opacity = Math.max(0, Math.min(1, opacity));
    this._canvas.style.opacity = this._opacity;
  }

  /**
   * Handle window resize — recompute camera, renderer, and rebuild geometry
   */
  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Update renderer
    this._renderer.setSize(w, h);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update camera
    this._camera.aspect = w / h;
    const depth = h / (2 * Math.tan((FOV * Math.PI) / 360));
    this._camera.position.z = depth;
    this._camera.updateProjectionMatrix();

    // Rebuild path and geometry for new viewport dimensions
    this._group.remove(this._ribbonMesh);
    this._ribbonGeometry.dispose();

    this._buildCurvePath();
    this._buildRibbonGeometry();
    this._createMesh();

    // Restore progress
    this.setScrollProgress(this._progress);
  }

  /**
   * Dispose all resources and remove canvas
   */
  destroy() {
    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    if (this._ribbonGeometry) {
      this._ribbonGeometry.dispose();
      this._ribbonGeometry = null;
    }

    if (this._ribbonMaterial) {
      this._ribbonMaterial.dispose();
      this._ribbonMaterial = null;
    }
    
    if (this._gui) {
      this._gui.destroy();
      this._gui = null;
    }

    if (this._renderer) {
      this._renderer.dispose();
      this._renderer = null;
    }

    if (this._canvas && this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
      this._canvas = null;
    }

    this._scene = null;
    this._camera = null;
    this._ribbonMesh = null;
    this._group = null;
  }

  // ─── Render Loop ───────────────────────────────────────────────────────────

  _tick() {
    if (!this._renderer) return;

    // Update time uniform for animated fluent design glow
    if (this.customUniforms) {
      this.customUniforms.uTime.value = performance.now() / 1000;
    }

    // Update ribbon group position to align with the #home-reel section
    if (this._sectionEl) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const rect = this._sectionEl.getBoundingClientRect();

      // Map section DOM position to WebGL coordinate space
      const sectionWebGLX = rect.left - w / 2;
      const sectionWebGLY = h / 2 - rect.top;

      this._group.position.set(
        sectionWebGLX - w * 0.03,  // 3% left offset (matches original tube)
        sectionWebGLY + h * 0.25,  // 25% up offset (matches original tube)
        -5.0
      );
    }

    this._renderer.render(this._scene, this._camera);
    this._animationFrameId = requestAnimationFrame(this._tick);
  }
}
