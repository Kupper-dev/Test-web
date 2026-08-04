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

    // Config parameters with lil-gui safety strings (Updated from user screenshot)
    this.config = {
      pathTrimStart: 0.12,    // 12% trim
      pathTrimEnd: 0.96,      // 4% trim
      scaleXMultiplier: 1.24, // Width scale 1.24x
      svgCenterX: 393,        // Leftward alignment offset 393

      grooveWidth: 37.5,      // Groove Width 37.5
      grooveDepth: 13.0,      // Groove Depth 13.0
      wallThickness: 3.0,     // Lip Thickness 3.0
      trenchInnerRadius: 17.5,// Inner Fillet Radius 17.5

      colorStart: '#bdc8ff',  // Soft Periwinkle Blue (Start)
      colorEnd: '#ade4ff',    // Soft Cyan Blue (End)
      fresnelColor: '#787878',// Neutral Rim Highlight
      
      roughness: 0.85,        // Soft Matte Stone Finish (Matches reference image)
      metalness: 0.05,        // Low metalness to prevent harsh specular streaks on curves
      texturePreset: 'Granite Noise',
      bumpScale: 0.18,
      noiseRepeatX: 10.0,
      noiseRepeatY: 2.6,

      // Lighting Control Knobs & Shadow Tint Controls
      ambientLightIntensity: 0.5,
      keyLightIntensity: 5.0,
      fillLightIntensity: 4.5,
      fillLightColor: '#ffffff' // Neutral White Fill Light (Removes unwanted red/blue shadow tint)
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
    this._ambientLight = new THREE.AmbientLight(0xffffff, this.config.ambientLightIntensity);
    this._scene.add(this._ambientLight);
    this._keyLight = new THREE.DirectionalLight(0xffffff, this.config.keyLightIntensity);
    this._keyLight.position.set(400, 500, 800);
    this._scene.add(this._keyLight);
    this._fillLight = new THREE.DirectionalLight(this.config.fillLightColor, this.config.fillLightIntensity);
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
    this._lutPoints = [];
    for (let i = 0; i < lutSize; i++) {
      const t = i / (lutSize - 1);
      this._lutPoints.push(this._curvePath.getPointAt(
        this.config.pathTrimStart + t * (this.config.pathTrimEnd - this.config.pathTrimStart)
      ));
    }
  }

  _buildCrossSection() {
    const w = this.geomParams.grooveWidth;
    const d = this.geomParams.grooveDepth;
    const wt = this.geomParams.wallThickness;
    const r = Math.min(this.config.trenchInnerRadius, d - 1, w / 2 - 1);
    const N = 12;

    const profile = [];
    profile.push({ x: -(w / 2 + wt), y: 0, nu: -1, nv: 0 });
    profile.push({ x: -w / 2, y: 0, nu: -1, nv: 0 });

    for (let i = 0; i <= N; i++) {
      const angle = (Math.PI / 2) * (i / N);
      const px = -w / 2 + r - r * Math.cos(angle);
      const py = -d + r - r * Math.sin(angle);
      profile.push({ x: px, y: py, nu: -Math.cos(angle), nv: -Math.sin(angle) });
    }

    for (let i = 0; i <= N; i++) {
      const angle = (Math.PI / 2) * (i / N);
      const px = w / 2 - r + r * Math.sin(angle);
      const py = -d + r - r * Math.cos(angle);
      profile.push({ x: px, y: py, nu: Math.sin(angle), nv: -Math.sin(angle) });
    }

    profile.push({ x: w / 2, y: 0, nu: 1, nv: 0 });
    profile.push({ x: w / 2 + wt, y: 0, nu: 1, nv: 0 });

    return profile;
  }

  _buildRibbonGeometry() {
    const crossSection = this._buildCrossSection();
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

    const presetFiles = {
      'Granite Noise': '/textures/noise.webp',
      'Light Noise': '/textures/noise-light.webp',
      'Marble Grain': '/textures/marble.webp',
      'Brushed Steel': '/textures/steel-normal.webp',
      'Frosted Glass': '/textures/frosted-normal.webp'
    };

    const loader = new THREE.TextureLoader();
    Object.entries(presetFiles).forEach(([name, path]) => {
      loader.load(path, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(this.config.noiseRepeatX, this.config.noiseRepeatY);
        this._textures[name] = tex;
        if (name === this.config.texturePreset) {
          this._applyTexture(tex);
        }
      });
    });
  }

  _applyTexture(tex) {
    if (!this._ribbonMaterial || !tex) return;
    tex.repeat.set(this.config.noiseRepeatX, this.config.noiseRepeatY);
    this._ribbonMaterial.map = tex;
    this._ribbonMaterial.bumpMap = tex;
    this._ribbonMaterial.bumpScale = this.config.bumpScale;
    this._ribbonMaterial.needsUpdate = true;
  }

  _buildMaterial() {
    this._gradientUniforms = {
      uColorStart: { value: new THREE.Color(this.config.colorStart) },
      uColorEnd: { value: new THREE.Color(this.config.colorEnd) },
      uFresnelColor: { value: new THREE.Color(this.config.fresnelColor) }
    };

    this._ribbonMaterial = new THREE.MeshStandardMaterial({
      roughness: this.config.roughness,
      metalness: this.config.metalness,
      bumpScale: this.config.bumpScale,
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
        varying vec3 vWorldPos;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vPathProgress = aPathProgress;
         vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`
      );

      shader.fragmentShader = `
        varying float vPathProgress;
        varying vec3 vWorldPos;
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

        // Un-stretched World-Space Granite Noise Sampling
        #ifdef USE_MAP
          vec2 worldUv = vWorldPos.xy * 0.008;
          vec4 texColor = texture2D(map, worldUv);
          float grainFactor = (texColor.r - 0.5) * 0.4;
          diffuseColor.rgb = clamp(diffuseColor.rgb + vec3(grainFactor), 0.0, 1.0);
        #endif

        // Soft Inner Trench Depth Ambient Shadowing (AO)
        float trenchDepthAO = clamp((vWorldPos.z + 13.0) / 13.0, 0.5, 1.0);
        diffuseColor.rgb *= trenchDepthAO;
        `
      );
    };
  }

  _buildSphere() {
    const radius = 10.0;
    const geometry = new THREE.SphereGeometry(radius, 48, 48);

    this._orbUniforms = {
      uTime: { value: 0.0 },
      uSpinAngle: { value: 0.0 },                              // Spinning Siren Light Beam Angle
      uCoreColorDark: { value: new THREE.Color('#0022aa') },   // Deep Royal Blue
      uCoreColorLight: { value: new THREE.Color('#3399ff') },  // Bright Electric Cyan Blue
      uGlowColor: { value: new THREE.Color('#88ccff') },       // Outer Soft Halo
      uGrainIntensity: { value: 0.25 },
      uGlowPower: { value: 2.2 },
      uGlowIntensity: { value: 1.5 },
      uOrbScale: { value: 1.875 },                             // 1.875 * 10 = 18.75px radius
      uZOffset: { value: -2.0 }                                // Z Cradle Depth inside Trench
    };

    this._sphereMaterial = new THREE.ShaderMaterial({
      uniforms: this._orbUniforms,
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vViewPosition;

        uniform float uOrbScale;

        void main() {
          vUv = uv;
          vec3 scaledPos = position * uOrbScale;
          vNormal = normalize(normalMatrix * normal);
          vPosition = scaledPos;
          vec4 mvPosition = modelViewMatrix * vec4(scaledPos, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying vec3 vViewPosition;

        uniform float uTime;
        uniform float uSpinAngle;
        uniform vec3 uCoreColorDark;
        uniform vec3 uCoreColorLight;
        uniform vec3 uGlowColor;
        uniform float uGrainIntensity;
        uniform float uGlowPower;
        uniform float uGlowIntensity;

        float rand(vec2 co) {
          return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          vec3 norm = normalize(vNormal);

          // Diagonal 3D Noise Grain Gradient
          float gradPos = clamp((vPosition.x + vPosition.y + vPosition.z) / 30.0 + 0.5, 0.0, 1.0);
          vec3 coreColor = mix(uCoreColorDark, uCoreColorLight, gradPos);

          float grain = (rand(vUv * 50.0 + uTime * 0.05) - 0.5) * uGrainIntensity;
          coreColor = clamp(coreColor + vec3(grain), 0.0, 1.0);

          // 80% Spinning Siren Light Beam Angle Mask (288° active beam, 72° dark gap)
          float posAngle = atan(vPosition.y, vPosition.x);
          float angleDiff = mod(posAngle - uSpinAngle + 3.14159265, 6.2831853) - 3.14159265;
          // 80% of 2PI is 2.5132 rad (+- 1.2566 rad from beam center)
          float sirenFactor = smoothstep(1.5, 0.5, abs(angleDiff));

          // Soft Atmospheric Rim Glow (Fresnel modulated by 80% siren beam)
          float fresnel = max(0.0, 1.0 - dot(norm, viewDir));
          float halo = pow(fresnel, uGlowPower) * uGlowIntensity * (0.3 + 0.7 * sirenFactor);

          vec3 finalColor = mix(coreColor, uGlowColor, clamp(halo, 0.0, 1.0));
          finalColor += uGlowColor * halo * 0.6;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    this._sphereMesh = new THREE.Mesh(geometry, this._sphereMaterial);
    this._sphereMesh.visible = false;
    this._group.add(this._sphereMesh);

    // Dedicated Outer Atmosphere Glow Disk/Halo (Additive blending)
    const haloGeometry = new THREE.SphereGeometry(radius * 1.6, 32, 32);
    this._haloMaterial = new THREE.ShaderMaterial({
      uniforms: this._orbUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewPosition;

        void main() {
          vPosition = position;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vViewPosition;

        uniform float uSpinAngle;
        uniform vec3 uGlowColor;
        uniform float uGlowPower;
        uniform float uGlowIntensity;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          vec3 norm = normalize(vNormal);

          // 80% Siren Beam Angle Mask (288° active beam)
          float posAngle = atan(vPosition.y, vPosition.x);
          float angleDiff = mod(posAngle - uSpinAngle + 3.14159265, 6.2831853) - 3.14159265;
          float sirenFactor = smoothstep(1.5, 0.5, abs(angleDiff));

          float fresnel = max(0.0, dot(norm, viewDir));
          float haloAlpha = pow(fresnel, uGlowPower) * uGlowIntensity * 1.8 * (0.2 + 0.8 * sirenFactor);

          gl_FragColor = vec4(uGlowColor * haloAlpha, haloAlpha);
        }
      `
    });

    this._haloMesh = new THREE.Mesh(haloGeometry, this._haloMaterial);
    this._haloMesh.visible = false;
    this._sphereMesh.add(this._haloMesh);

    // Option 1: 2D Sprite Radial Glow Disc (Guaranteed 100% visibility on light background)
    this._glowSpriteMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uGlowColor: this._orbUniforms.uGlowColor,
        uSpinAngle: this._orbUniforms.uSpinAngle,
        uSpriteOpacity: { value: 0.95 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending, // NormalBlending ensures opacity against white/light backgrounds
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uGlowColor;
        uniform float uSpinAngle;
        uniform float uSpriteOpacity;

        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center) * 2.0;
          if (dist > 1.0) discard;

          // Radial falloff exponential curve
          float radialGlow = pow(1.0 - dist, 1.8);

          // 80% Siren Angle Mask
          float posAngle = atan(center.y, center.x);
          float angleDiff = mod(posAngle - uSpinAngle + 3.14159265, 6.2831853) - 3.14159265;
          float sirenFactor = smoothstep(1.5, 0.5, abs(angleDiff));

          float finalAlpha = radialGlow * uSpriteOpacity * (0.35 + 0.65 * sirenFactor);
          gl_FragColor = vec4(uGlowColor, finalAlpha);
        }
      `
    });

    const spriteGeo = new THREE.PlaneGeometry(120, 120);
    this._glowSprite = new THREE.Mesh(spriteGeo, this._glowSpriteMaterial);
    this._glowSprite.position.set(0, 0, -4.0); // Directly behind orb
    this._glowSprite.visible = false;
    this._sphereMesh.add(this._glowSprite);

    // Dynamic Point Light attached to Orb
    this._orbLight = new THREE.PointLight(0x3399ff, 8.0, 150, 1.5);
    this._sphereMesh.add(this._orbLight);
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
        const zOff = (this._orbUniforms && this._orbUniforms.uZOffset) ? this._orbUniforms.uZOffset.value : -2.0;
        this._sphereMesh.position.set(pt.x, pt.y, zOff);
        this._sphereMesh.visible = true;
        if (this._haloMesh) this._haloMesh.visible = true;
        if (this._glowSprite) this._glowSprite.visible = true;
      } else {
        this._sphereMesh.visible = false;
        if (this._haloMesh) this._haloMesh.visible = false;
        if (this._glowSprite) this._glowSprite.visible = false;
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
    const presetOptions = ['Granite Noise', 'Light Noise', 'Marble Grain', 'Brushed Steel', 'Frosted Glass'];
    noiseFolder.add(this.config, 'texturePreset', presetOptions).name('Texture Preset').onChange((presetName) => {
      if (this._textures[presetName]) {
        this._applyTexture(this._textures[presetName]);
      }
    });
    noiseFolder.add(this.config, 'bumpScale', 0.0, 0.5, 0.01).name('Noise Bump Scale').onChange((v) => {
      if (this._ribbonMaterial) {
        this._ribbonMaterial.bumpScale = v;
      }
    });
    noiseFolder.add(this.config, 'noiseRepeatX', 1.0, 50.0, 0.5).name('Tiling X').onChange((v) => {
      const activeTex = this._textures[this.config.texturePreset];
      if (activeTex) {
        activeTex.repeat.x = v;
        activeTex.needsUpdate = true;
      }
    });
    noiseFolder.add(this.config, 'noiseRepeatY', 0.5, 10.0, 0.1).name('Tiling Y').onChange((v) => {
      const activeTex = this._textures[this.config.texturePreset];
      if (activeTex) {
        activeTex.repeat.y = v;
        activeTex.needsUpdate = true;
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
    lightFolder.addColor(this.config, 'fillLightColor').name('Fill Light Tint (Shadows)').onChange((v) => {
      if (this._fillLight) this._fillLight.color.set(v);
    });

    // 6. Glowing Orb Controls Folder
    const orbFolder = this._gui.addFolder('Glowing Grain Orb');
    const orbConfig = {
      darkColor: '#0022aa',
      lightColor: '#3399ff',
      glowColor: '#88ccff',
      spinSpeed: 2.5,
      trenchLightIntensity: 8.0,
      glowSpriteSize: 120,
      glowSpriteOpacity: 0.95
    };
    orbFolder.addColor(orbConfig, 'darkColor').name('Core Dark Color').onChange((v) => {
      if (this._orbUniforms) this._orbUniforms.uCoreColorDark.value.set(v);
    });
    orbFolder.addColor(orbConfig, 'lightColor').name('Core Light Color').onChange((v) => {
      if (this._orbUniforms) this._orbUniforms.uCoreColorLight.value.set(v);
    });
    orbFolder.addColor(orbConfig, 'glowColor').name('Outer Halo Color').onChange((v) => {
      if (this._orbUniforms) this._orbUniforms.uGlowColor.value.set(v);
    });

    if (this._orbUniforms) {
      this._orbUniforms.uOrbScale.value = 2.3;
      this._orbUniforms.uZOffset.value = 3.0;
      this._orbUniforms.uGrainIntensity.value = 0.16;
      this._orbUniforms.uGlowPower.value = 2.1;
      this._orbUniforms.uGlowIntensity.value = 1.4;
    }

    orbFolder.add(this._orbUniforms.uOrbScale, 'value', 0.5, 4.0, 0.05).name('Orb Size (Scale)');
    orbFolder.add(this._orbUniforms.uZOffset, 'value', -20.0, 10.0, 0.5).name('Trench Z Depth Offset');
    orbFolder.add(orbConfig, 'glowSpriteSize', 40, 300, 5).name('Outer Glow Size (2D Disc)').onChange((v) => {
      if (this._glowSprite) this._glowSprite.scale.set(v / 120, v / 120, 1.0);
    });
    orbFolder.add(orbConfig, 'glowSpriteOpacity', 0.0, 1.0, 0.05).name('Outer Glow Visibility (Opacity)').onChange((v) => {
      if (this._glowSpriteMaterial) this._glowSpriteMaterial.uniforms.uSpriteOpacity.value = v;
    });
    orbFolder.add(orbConfig, 'spinSpeed', 0.0, 10.0, 0.2).name('Siren Spin Speed').onChange((v) => {
      this._spinSpeed = v;
    });
    orbFolder.add(orbConfig, 'trenchLightIntensity', 0.0, 25.0, 0.5).name('Trench Light Intensity').onChange((v) => {
      if (this._orbLight) this._orbLight.intensity = v;
    });
    orbFolder.add(this._orbUniforms.uGrainIntensity, 'value', 0.0, 1.0, 0.02).name('Orb Grain Intensity');
    orbFolder.add(this._orbUniforms.uGlowPower, 'value', 0.5, 6.0, 0.1).name('Glow Falloff Power');
    orbFolder.add(this._orbUniforms.uGlowIntensity, 'value', 0.0, 4.0, 0.1).name('Glow Brightness');
    this._spinSpeed = orbConfig.spinSpeed;
  }

  _rebuildAll() {
    this._buildCurvePath();
    this._buildLUT();
    if (this._ribbonGeometry) this._ribbonGeometry.dispose();
    this._buildRibbonGeometry();
    if (this._ribbonMesh) this._ribbonMesh.geometry = this._ribbonGeometry;
  }

  _tick(time) {
    if (!this._renderer) return;

    const t = (time || performance.now()) * 0.001;
    const speed = this._spinSpeed !== undefined ? this._spinSpeed : 2.5;
    const currentSpin = t * speed;

    if (this._orbUniforms) {
      this._orbUniforms.uTime.value = t;
      this._orbUniforms.uSpinAngle.value = currentSpin;
    }

    // Move dynamic point light in an 80% arc sweep around orb center
    if (this._orbLight) {
      const radius = 30.0;
      this._orbLight.position.set(
        Math.cos(currentSpin) * radius,
        Math.sin(currentSpin) * radius,
        5.0
      );
    }

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
