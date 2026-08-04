/**
 * KupperRibbonRenderer — Custom Three.js 3D Ribbon Strip Renderer
 *
 * Draws a flat, extruded ribbon with rectangular cross-section along a 6-segment
 * cubic Bezier path. The ribbon has metallic/glossy MeshPhysicalMaterial shading
 * and is scroll-driven via setScrollProgress().
 */

import GUI from 'lil-gui';
import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// ─── SVG Path Data ───────────────────────────────────────────────────────────
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

export class KupperRibbonRenderer {
  constructor(sectionEl) {
    this._sectionEl = sectionEl;
    this._progress = 0;
    this._opacity = 0;
    this._animationFrameId = null;

    // Create dedicated canvas
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

    // Start resize listener
    window.addEventListener('resize', this.resize.bind(this));

    // Start render loop
    this._tick = this._tick.bind(this);
    this._tick();
  }

  // ─── Lighting ──────────────────────────────────────────────────────────────

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
      if (!this._scene) return;
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

  // ─── Material ──────────────────────────────────────────────────────────────

  _buildMaterial() {
    this._gradientUniforms = {
      uColorDark: { value: new THREE.Color('#012eff') },   // Color 1 (Start)
      uPosDark: { value: 0.0 },                            // Position 0%
      uColorMid: { value: new THREE.Color('#0062ff') },    // Color 2 (Mid)
      uPosMid: { value: 0.07 },                            // Position 7%
      uColorLight: { value: new THREE.Color('#47b9ff') },  // Color 3 (End)
      uPosLight: { value: 0.70 },                          // Position 70%
      uFresnelColor: { value: new THREE.Color('#ade9ff') } // Fresnel Rim Tint
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
    if (!this._renderer || !this._camera) return;
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
