/**
 * KupperRibbonRenderer — Custom Three.js 3D Ribbon Strip Renderer
 *
 * Renders hero ribbon and extruded 3D Network Signal Path ribbons in .it-flow-section
 * with customizable multi-texture PBR materials and GLSL gradient shaders.
 */

import GUI from 'lil-gui';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ─── Hero SVG Path Data ────────────────────────────────────────────────────────
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
const PATH_SAMPLES = 600;
const SIGNAL_SAMPLES = 400;
const FOV = 45;

// ─── IT Signal Path SVG Definitions ──────────────────────────────────────────
const SIGNAL_PATHS_D = {
  itSignalPath1: "m 106,45h 375c 114,0 226,128 226,235v 236c 0,136 -122,222 -224,221l -182,-2c -89,1 -141,42 -142,158l -2,204c -1,117 37,173 134,173h 186c 110,-3 230,111 230,220v 242c 0,113 -125,225 -248,225H 105",
  itSignalPath2: "m 33,85h 444c 96,0 190,107 190,201v 224c 0,116 -98,188 -190,187l -192,-2c -92,0 -166,75 -166,168v 278c 0,94 74,169 166,169h 194c 92,0 188,94 188,188v 228c 0,94 -104,191 -214,191H 105",
  itSignalPath3: "m 155,127h 308c 94,0 162,86 162,177v 178c 0,109 -50,174 -166,173L 277,653C 158,653 77,762 77,849v 302c 0,118 107,196 180,197l 204,4c 92,0 164,67 164,160v 200c 0,91 -89,163 -188,163H 105"
};

// ─── Material Presets ────────────────────────────────────────────────────────
const MATERIAL_PRESETS = {
  'ANRI Frosted Glass': {
    gradient: {
      uColorDark: '#ffffff',
      uPosDark: 0.0,
      uColorMid: '#d4f0ff',
      uPosMid: 0.30,
      uColorLight: '#a6e3ff',
      uPosLight: 1.00,
      uFresnelColor: '#ffffff'
    },
    pbr: {
      roughness: 0.25,
      metalness: 0.1,
      transmission: 0.0,
      thickness: 12.0,
      ior: 1.45,
      bumpScale: 0.03,
      repeatX: 10.0,
      repeatY: 2.0
    }
  },
  'Blue Grain': {
    gradient: {
      uColorDark: '#012eff',
      uPosDark: 0.0,
      uColorMid: '#0062ff',
      uPosMid: 0.07,
      uColorLight: '#47b9ff',
      uPosLight: 0.70,
      uFresnelColor: '#ade9ff'
    },
    pbr: {
      roughness: 0.0,
      metalness: 0.6,
      transmission: 0.4, // Restored 0.4 baseline transmission
      thickness: 8.0,
      ior: 1.45,
      bumpScale: 0.05,
      repeatX: 15.7,
      repeatY: 2.1
    }
  },
  'Granite': {
    gradient: {
      uColorDark: '#222226',
      uPosDark: 0.0,
      uColorMid: '#44444c',
      uPosMid: 0.50,
      uColorLight: '#888894',
      uPosLight: 1.00,
      uFresnelColor: '#ffffff'
    },
    pbr: {
      roughness: 0.75,
      metalness: 0.1,
      transmission: 0.0,
      thickness: 0.0,
      ior: 1.5,
      bumpScale: 0.15,
      repeatX: 30.0,
      repeatY: 5.0
    }
  },
  'Steel': {
    gradient: {
      uColorDark: '#707880',
      uPosDark: 0.0,
      uColorMid: '#b0b8c0',
      uPosMid: 0.50,
      uColorLight: '#e0e8f0',
      uPosLight: 1.00,
      uFresnelColor: '#ffffff'
    },
    pbr: {
      roughness: 0.15,
      metalness: 0.9,
      transmission: 0.0,
      thickness: 0.0,
      ior: 2.5,
      bumpScale: 0.02,
      repeatX: 20.0,
      repeatY: 2.0
    }
  },
  'Marble': {
    gradient: {
      uColorDark: '#f0f4f8',
      uPosDark: 0.0,
      uColorMid: '#d8e2ec',
      uPosMid: 0.50,
      uColorLight: '#b0c4de',
      uPosLight: 1.00,
      uFresnelColor: '#ffffff'
    },
    pbr: {
      roughness: 0.05,
      metalness: 0.05,
      transmission: 0.0,
      thickness: 5.0,
      ior: 1.5,
      bumpScale: 0.04,
      repeatX: 8.0,
      repeatY: 1.5
    }
  },
  'Glossy Acrylic': {
    gradient: {
      uColorDark: '#ff0066',
      uPosDark: 0.0,
      uColorMid: '#ff3399',
      uPosMid: 0.50,
      uColorLight: '#ff99cc',
      uPosLight: 1.00,
      uFresnelColor: '#ffffff'
    },
    pbr: {
      roughness: 0.02,
      metalness: 0.0,
      transmission: 0.0,
      thickness: 10.0,
      ior: 1.49,
      bumpScale: 0.01,
      repeatX: 10.0,
      repeatY: 2.0
    }
  }
};

export class KupperRibbonRenderer {
  constructor(sectionEl) {
    this._sectionEl = sectionEl;
    this._progress = 0;
    this._signalProgress = 1.0;
    this._opacity = 1.0;
    this._animationFrameId = null;

    // Create dedicated canvas with z-index 3 to ensure visibility in front of section backgrounds
    this._canvas = document.createElement('canvas');
    this._canvas.id = 'kupper-ribbon-canvas';
    this._canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      opacity: 1;
    `;
    document.body.insertBefore(this._canvas, document.body.firstChild);

    // 3D Geometry Tweaks for Hero Ribbon
    this.geomParams = {
      ribbonWidth: 38.345,
      ribbonThickness: 21.335,
      cornerRadius: 3.728,
      zSeparation: -374.0,
      startTwist: -3.468,
      startTwistEnd: 0.411,
      endScale: 1.070,
      endScaleStart: 0.968
    };

    // Scene
    this._scene = new THREE.Scene();

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

    // Camera (1:1 pixel mapping at Z=0)
    const w = window.innerWidth;
    const h = window.innerHeight;
    this._camera = new THREE.PerspectiveCamera(FOV, w / h, 1, 5000);
    const depth = h / (2 * Math.tan((FOV * Math.PI) / 360));
    this._camera.position.set(0, 0, depth);

    // Positioning Groups
    this._group = new THREE.Group();             // Hero ribbon group
    this._signalGroup = new THREE.Group();       // 3D Signal ribbons group
    this._scene.add(this._group);
    this._scene.add(this._signalGroup);

    // Lighting (Exact scene-attached lights matching baseline commit f7b9112 / fb493a6)
    this._setupLights();

    // Load Textures and EnvMap
    this._loadAssets();

    // Build Hero Ribbon
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

    // Build 3D Network Signal Ribbons
    this._signalMeshes = [];
    this._signalMaterials = [];
    this._signalGeometries = [];
    this._signalIndexCounts = [0, 0, 0];

    this._buildSignalRibbons();

    // Setup GUI Tweak Panel for Left & Right Signal Ribbons
    this._setupGui();

    // Resize listener
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    // Start render loop
    this._tick = this._tick.bind(this);
    this._tick();
  }

  // ─── Lighting ──────────────────────────────────────────────────────────────

  _setupLights() {
    this._ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    this._scene.add(this._ambientLight);

    // Exact scene-attached lights matching baseline commit f7b9112 / fb493a6
    this._keyLight = new THREE.DirectionalLight(0xffffff, 7.0);
    this._keyLight.position.set(400, 500, 800);
    this._scene.add(this._keyLight);

    this._fillLight = new THREE.DirectionalLight(0x00b3ff, 6.3);
    this._fillLight.position.set(-300, -200, 400);
    this._scene.add(this._fillLight);
  }

  // ─── Asset Loading ──────────────────────────────────────────────────────────

  _loadAssets() {
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/env/warehouse.hdr', (envMap) => {
      if (!this._scene || !this._renderer) return;
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      this._hdrEnvMap = envMap;

      this._scene.environment = envMap;

      if (this._ribbonMaterial) {
        this._ribbonMaterial.envMap = envMap;
        this._ribbonMaterial.envMapIntensity = 1.0;
        this._ribbonMaterial.needsUpdate = true;
      }
      this._signalMaterials.forEach((mat) => {
        if (mat) {
          mat.envMap = envMap;
          mat.envMapIntensity = 1.0;
          mat.needsUpdate = true;
        }
      });
    });

    const texLoader = new THREE.TextureLoader();
    texLoader.load('/textures/noise.webp', (tex) => {
      if (!this._scene || !this._renderer) return;
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

      this._signalMaterials.forEach((mat) => {
        if (mat) {
          mat.map = tex;
          mat.bumpMap = tex;
          mat.needsUpdate = true;
        }
      });
    });
  }

  // ─── Hero Path & Geometry ──────────────────────────────────────────────────

  _mapSvgPoint(svgX, svgY) {
    const w = window.innerWidth;
    const xTransformed = svgX * SVG_MAT_SCALE + SVG_TX;
    const yTransformed = svgY * SVG_MAT_SCALE + SVG_TY;
    const scale = w / SVG_VIEWBOX_W;
    return new THREE.Vector3(xTransformed * scale, -yTransformed * scale, 0);
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

  _buildRibbonGeometry() {
    this._ribbonGeometry = this._extrudePointsToGeometry(this._points, {
      width: this.geomParams.ribbonWidth,
      thickness: this.geomParams.ribbonThickness,
      cornerRadius: this.geomParams.cornerRadius,
      zSeparation: this.geomParams.zSeparation,
      startTwist: this.geomParams.startTwist,
      startTwistEnd: this.geomParams.startTwistEnd,
      endScale: this.geomParams.endScale,
      endScaleStart: this.geomParams.endScaleStart
    });
    this._totalIndexCount = this._ribbonGeometry.index.count;
    this._ribbonGeometry.setDrawRange(0, 0);
  }

  _buildMaterial() {
    this._gradientUniforms = {
      uColorDark: { value: new THREE.Color('#012eff') },
      uPosDark: { value: 0.0 },
      uColorMid: { value: new THREE.Color('#0062ff') },
      uPosMid: { value: 0.07 },
      uColorLight: { value: new THREE.Color('#47b9ff') },
      uPosLight: { value: 0.70 },
      uFresnelColor: { value: new THREE.Color('#ade9ff') }
    };

    this._ribbonMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.0,
      metalness: 0.6,
      transmission: 0.4,
      thickness: 8.0,
      ior: 1.45,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true,
      envMapIntensity: 1.0
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
        float uPos = clamp(vPathProgress, 0.0, 1.0);
        
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

        diffuseColor.rgb = gradColor;

        #ifdef USE_MAP
          vec4 texColor = texture2D(map, vMapUv);
          float grainFactor = (texColor.r - 0.5) * 0.55;
          diffuseColor.rgb = clamp(diffuseColor.rgb + vec3(grainFactor), 0.0, 1.0);
        #endif

        vec3 norm = normalize(vNormal);
        float fresnel = max(0.0, dot(norm, vec3(0.0, 0.0, 1.0)));
        fresnel = pow(1.0 - fresnel, 2.0);
        diffuseColor.rgb += uFresnelColor * fresnel * 0.4;
        `
      );
    };
  }

  _createMesh() {
    this._ribbonMesh = new THREE.Mesh(this._ribbonGeometry, this._ribbonMaterial);
    this._ribbonMesh.renderOrder = 1;
    this._group.add(this._ribbonMesh);
  }

  // ─── Shared Custom GLSL Physical Material Factory ─────────────────────────

  _createCustomMaterial(gradientConfig, pbrConfig) {
    const uniforms = {
      uColorDark: { value: new THREE.Color(gradientConfig.uColorDark) },
      uPosDark: { value: gradientConfig.uPosDark },
      uColorMid: { value: new THREE.Color(gradientConfig.uColorMid) },
      uPosMid: { value: gradientConfig.uPosMid },
      uColorLight: { value: new THREE.Color(gradientConfig.uColorLight) },
      uPosLight: { value: gradientConfig.uPosLight },
      uFresnelColor: { value: new THREE.Color(gradientConfig.uFresnelColor) }
    };

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: pbrConfig.roughness,
      metalness: pbrConfig.metalness,
      transmission: pbrConfig.transmission,
      thickness: pbrConfig.thickness,
      ior: pbrConfig.ior,
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide,
      depthWrite: true,
      envMapIntensity: 1.0
    });

    if (this._hdrEnvMap) {
      mat.envMap = this._hdrEnvMap;
    }
    if (this._textures.noise) {
      mat.map = this._textures.noise;
      mat.bumpMap = this._textures.noise;
      mat.bumpScale = pbrConfig.bumpScale;
    }

    mat.userData.uniforms = uniforms;
    mat.userData.pbrConfig = { ...pbrConfig };

    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);

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
        float uPos = clamp(vPathProgress, 0.0, 1.0);
        
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

        diffuseColor.rgb = gradColor;

        #ifdef USE_MAP
          vec4 texColor = texture2D(map, vMapUv);
          float grainFactor = (texColor.r - 0.5) * 0.55;
          diffuseColor.rgb = clamp(diffuseColor.rgb + vec3(grainFactor), 0.0, 1.0);
        #endif

        vec3 norm = normalize(vNormal);
        float fresnel = max(0.0, dot(norm, vec3(0.0, 0.0, 1.0)));
        fresnel = pow(1.0 - fresnel, 2.0);
        diffuseColor.rgb += uFresnelColor * fresnel * 0.4;
        `
      );
    };

    return mat;
  }

  // ─── Geometry Extrusion Generator ──────────────────────────────────────────

  _extrudePointsToGeometry(points, opts) {
    const width = opts.width || 20;
    const thickness = opts.thickness || 6;
    const cornerRadius = opts.cornerRadius || 1.5;
    const zSeparation = opts.zSeparation || 0;
    const startTwist = opts.startTwist || 0;
    const startTwistEnd = opts.startTwistEnd || 0.4;
    const endScale = opts.endScale || 1.0;
    const endScaleStart = opts.endScaleStart || 0.9;

    const safeRadius = Math.max(0.01, Math.min(cornerRadius, thickness / 2.0));
    const numPointsPerCorner = 4;
    const verticesPerPoint = 4 * numPointsPerCorner;

    const crossSection = [];
    const wInner = width / 2 - safeRadius;
    const hInner = thickness / 2 - safeRadius;
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

    const numPoints = points.length;
    const positions = new Float32Array(numPoints * verticesPerPoint * 3);
    const normals = new Float32Array(numPoints * verticesPerPoint * 3);
    const uvs = new Float32Array(numPoints * verticesPerPoint * 2);
    const pathProgresses = new Float32Array(numPoints * verticesPerPoint);

    for (let i = 0; i < numPoints; i++) {
      const pt = points[i];
      const uProgress = i / (numPoints - 1);
      const currentZ = Math.pow(uProgress, 2.5) * zSeparation;
      let currentTwist = 0;
      let currentScale = 1.0;

      if (startTwist !== 0 && uProgress < startTwistEnd) {
        const localProgress = uProgress / startTwistEnd;
        const ease = 1.0 - Math.pow(localProgress, 2.0);
        currentTwist += ease * startTwist;
      }

      if (endScale !== 1.0 && uProgress > endScaleStart) {
        const localProgress = (uProgress - endScaleStart) / (1.0 - endScaleStart);
        const ease = Math.pow(localProgress, 2.0);
        currentScale = 1.0 + ease * (endScale - 1.0);
      }

      const nextIdx = Math.min(i + 1, numPoints - 1);
      const prevIdx = Math.max(i - 1, 0);
      const nextPt = points[nextIdx];
      const prevPt = points[prevIdx];
      const nextProgress = nextIdx / (numPoints - 1);
      const prevProgress = prevIdx / (numPoints - 1);
      const nextZ = Math.pow(nextProgress, 2.5) * zSeparation;
      const prevZ = Math.pow(prevProgress, 2.5) * zSeparation;

      const tangent = new THREE.Vector3(nextPt.x - prevPt.x, nextPt.y - prevPt.y, nextZ - prevZ).normalize();
      if (tangent.lengthSq() < 0.0001) tangent.set(0, -1, 0);
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

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute('aPathProgress', new THREE.BufferAttribute(pathProgresses, 1));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();

    return geometry;
  }

  // ─── 3D Network Signal Path Extrusion Setup ────────────────────────────────

  _sampleSvgPath(pathId, fallbackD, numSamples = SIGNAL_SAMPLES) {
    let pathEl = document.getElementById(pathId);
    let tempSvg = null;

    if (!pathEl || pathEl.getTotalLength() === 0) {
      tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      tempSvg.setAttribute("viewBox", "0 0 740 2000");
      tempSvg.style.cssText = "position:fixed; top:0; left:0; width:740px; height:2000px; opacity:0.001; pointer-events:none; z-index:-9999;";

      pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathEl.setAttribute("d", fallbackD);
      tempSvg.appendChild(pathEl);
      document.body.appendChild(tempSvg);
    }

    const points = [];
    const totalLength = pathEl.getTotalLength();

    for (let i = 0; i < numSamples; i++) {
      const len = (i / (numSamples - 1)) * totalLength;
      const pt = pathEl.getPointAtLength(len);
      points.push(new THREE.Vector3(pt.x - 370, -pt.y, 0));
    }

    if (tempSvg && tempSvg.parentNode) {
      tempSvg.parentNode.removeChild(tempSvg);
    }

    return points;
  }

  _buildSignalRibbons() {
    // 1. Sample SVG paths safely
    const rawPath1 = this._sampleSvgPath("itSignalPath1", SIGNAL_PATHS_D.itSignalPath1);
    const rawPath2 = this._sampleSvgPath("itSignalPath2", SIGNAL_PATHS_D.itSignalPath2);
    const rawPath3 = this._sampleSvgPath("itSignalPath3", SIGNAL_PATHS_D.itSignalPath3);

    // 2. Extrude 3D geometries (width 24px, thickness 6px)
    const geomOpts = {
      width: 24.0,
      thickness: 6.0,
      cornerRadius: 1.8,
      startTwist: 0.0,
      endScale: 1.0,
      zSeparation: 0.0
    };

    this._signalGeometries = [
      this._extrudePointsToGeometry(rawPath1, geomOpts),
      this._extrudePointsToGeometry(rawPath2, geomOpts),
      this._extrudePointsToGeometry(rawPath3, geomOpts)
    ];

    // 3. Instantiate Materials
    const anriPreset = MATERIAL_PRESETS['ANRI Frosted Glass'];
    const blueGrainPreset = MATERIAL_PRESETS['Blue Grain'];

    const mat1 = this._createCustomMaterial(anriPreset.gradient, anriPreset.pbr);
    const mat2 = this._createCustomMaterial(blueGrainPreset.gradient, blueGrainPreset.pbr);
    const mat3 = this._createCustomMaterial(anriPreset.gradient, anriPreset.pbr);

    this._signalMaterials = [mat1, mat2, mat3];

    // 4. Create Meshes
    for (let i = 0; i < 3; i++) {
      const geom = this._signalGeometries[i];
      const mat = this._signalMaterials[i];
      const count = geom.index.count;
      this._signalIndexCounts[i] = count;
      geom.setDrawRange(0, count);

      const mesh = new THREE.Mesh(geom, mat);
      mesh.renderOrder = 2;
      this._signalMeshes.push(mesh);
      this._signalGroup.add(mesh);
    }
  }

  // ─── lil-gui Interactive Tweak Panel for Left & Right Signal Ribbons ─────

  _setupGui() {
    this._gui = new GUI({ title: 'Signal Ribbons Material Swapper' });
    this._gui.domElement.style.cssText += 'position: fixed; top: 10px; right: 10px; z-index: 10000;';

    const presetNames = Object.keys(MATERIAL_PRESETS);

    const guiConfig = {
      leftPreset: 'ANRI Frosted Glass',
      rightPreset: 'ANRI Frosted Glass'
    };

    const applyPresetToMaterial = (mat, presetName) => {
      const preset = MATERIAL_PRESETS[presetName];
      if (!preset || !mat) return;

      const u = mat.userData.uniforms;
      if (u) {
        u.uColorDark.value.set(preset.gradient.uColorDark);
        u.uPosDark.value = preset.gradient.uPosDark;
        u.uColorMid.value.set(preset.gradient.uColorMid);
        u.uPosMid.value = preset.gradient.uPosMid;
        u.uColorLight.value.set(preset.gradient.uColorLight);
        u.uPosLight.value = preset.gradient.uPosLight;
        u.uFresnelColor.value.set(preset.gradient.uFresnelColor);
      }

      mat.roughness = preset.pbr.roughness;
      mat.metalness = preset.pbr.metalness;
      mat.transmission = preset.pbr.transmission;
      mat.thickness = preset.pbr.thickness;
      mat.ior = preset.pbr.ior;
      if (mat.bumpScale !== undefined) mat.bumpScale = preset.pbr.bumpScale;
      mat.needsUpdate = true;
    };

    // Left Path (Signal Path 1) Controls
    const leftFolder = this._gui.addFolder('Left Ribbon (Path 1)');
    leftFolder.add(guiConfig, 'leftPreset', presetNames).name('Preset').onChange((val) => {
      applyPresetToMaterial(this._signalMaterials[0], val);
    });

    const leftPbr = leftFolder.addFolder('PBR Properties');
    leftPbr.add(this._signalMaterials[0], 'roughness', 0, 1, 0.01);
    leftPbr.add(this._signalMaterials[0], 'metalness', 0, 1, 0.01);
    leftPbr.add(this._signalMaterials[0], 'transmission', 0, 1, 0.01);
    leftPbr.add(this._signalMaterials[0], 'thickness', 0, 20, 0.1);
    leftPbr.add(this._signalMaterials[0], 'ior', 1.0, 2.5, 0.01);

    // Right Path (Signal Path 3) Controls
    const rightFolder = this._gui.addFolder('Right Ribbon (Path 3)');
    rightFolder.add(guiConfig, 'rightPreset', presetNames).name('Preset').onChange((val) => {
      applyPresetToMaterial(this._signalMaterials[2], val);
    });

    const rightPbr = rightFolder.addFolder('PBR Properties');
    rightPbr.add(this._signalMaterials[2], 'roughness', 0, 1, 0.01);
    rightPbr.add(this._signalMaterials[2], 'metalness', 0, 1, 0.01);
    rightPbr.add(this._signalMaterials[2], 'transmission', 0, 1, 0.01);
    rightPbr.add(this._signalMaterials[2], 'thickness', 0, 20, 0.1);
    rightPbr.add(this._signalMaterials[2], 'ior', 1.0, 2.5, 0.01);

    // Middle Path (Path 2) Info (Locked)
    const midFolder = this._gui.addFolder('Middle Ribbon (Path 2)');
    midFolder.add({ info: 'LOCKED to Blue Grain' }, 'info').name('Status').disable();
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  setScrollProgress(progress) {
    this._progress = Math.max(0, Math.min(1, progress));
    const count = Math.floor(this._progress * this._totalIndexCount);
    const safeCount = count - (count % 3);
    if (this._ribbonGeometry) {
      this._ribbonGeometry.setDrawRange(0, safeCount);
    }
  }

  setSignalScrollProgress(progress) {
    this._signalProgress = Math.max(0, Math.min(1, progress));
    for (let i = 0; i < 3; i++) {
      const geom = this._signalGeometries[i];
      if (geom) {
        const count = Math.floor(this._signalProgress * this._signalIndexCounts[i]);
        const safeCount = count - (count % 3);
        geom.setDrawRange(0, safeCount);
      }
    }
  }

  setOpacity(opacity) {
    this._opacity = Math.max(0, Math.min(1, opacity));
    if (this._canvas) {
      this._canvas.style.opacity = this._opacity;
    }
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this._renderer.setSize(w, h);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this._camera.aspect = w / h;
    const depth = h / (2 * Math.tan((FOV * Math.PI) / 360));
    this._camera.position.z = depth;
    this._camera.updateProjectionMatrix();

    // Rebuild hero curve and ribbon
    this._group.remove(this._ribbonMesh);
    if (this._ribbonGeometry) this._ribbonGeometry.dispose();

    this._buildCurvePath();
    this._buildRibbonGeometry();
    this._createMesh();
    this.setScrollProgress(this._progress);
  }

  destroy() {
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
      this._onResize = null;
    }

    if (this._animationFrameId) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    if (this._gui) {
      this._gui.destroy();
      this._gui = null;
    }

    if (this._ribbonGeometry) this._ribbonGeometry.dispose();
    if (this._ribbonMaterial) this._ribbonMaterial.dispose();
    this._signalGeometries.forEach((g) => g && g.dispose());
    this._signalMaterials.forEach((m) => m && m.dispose());

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
    this._signalMeshes = [];
  }

  // ─── Render Loop ───────────────────────────────────────────────────────────

  _tick() {
    if (!this._renderer || !this._scene || !this._camera) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    // 1. Update Hero Ribbon positioning
    if (this._sectionEl) {
      const rect = this._sectionEl.getBoundingClientRect();
      const sectionWebGLX = rect.left - w / 2;
      const sectionWebGLY = h / 2 - rect.top;
      this._group.position.set(
        sectionWebGLX - w * 0.03,
        sectionWebGLY + h * 0.25,
        -5.0
      );
    }

    // 2. Update 3D IT Signal Paths positioning & scale
    const signalEl = document.querySelector('.it-flow-cards');
    if (signalEl) {
      const rect = signalEl.getBoundingClientRect();
      const scaleX = rect.width / 740;
      const scaleY = rect.height / 2000;

      // Position signal group at top-center of .it-flow-cards
      this._signalGroup.position.set(
        rect.left + rect.width / 2 - w / 2,
        h / 2 - rect.top,
        1.0
      );
      this._signalGroup.scale.set(scaleX, scaleY, 1.0);

      // Keep signal paths fully drawn
      this.setSignalScrollProgress(1.0);
    }

    this._renderer.render(this._scene, this._camera);
    this._animationFrameId = requestAnimationFrame(this._tick);
  }
}
