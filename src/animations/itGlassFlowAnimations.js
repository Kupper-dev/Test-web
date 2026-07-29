import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer;
let canvas = null;
let tubeMeshes = [];
let animationFrameId = null;
let scrollTriggerInstance = null;

export function initItGlassFlowAnimations() {
  const container = document.querySelector('.it-flow-cards');
  if (!container) return;

  if (document.getElementById('it-glass-canvas')) return;

  canvas = document.createElement('canvas');
  canvas.id = 'it-glass-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '50%';
  canvas.style.transform = 'translateX(-50%)';
  canvas.style.width = '100%';
  canvas.style.maxWidth = '800px';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '1';
  container.style.position = 'relative';
  container.appendChild(canvas);

  const rect = container.getBoundingClientRect();
  const w = rect.width || 800;
  const h = rect.height || 2000;

  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const fov = 45;
  camera = new THREE.PerspectiveCamera(fov, w / h, 1, 4000);
  const depth = h / (2 * Math.tan((fov * Math.PI) / 360));
  camera.position.set(0, 0, depth);

  const mapSvgPoint = (svgX, svgY) => {
    const glX = (svgX - 370) * (w / 740);
    const glY = (1000 - svgY) * (h / 2000);
    return new THREE.Vector3(glX, glY, 0);
  };

  const rawPaths = [
    // Path 1
    [[106, 45], [481, 45], [707, 173], [707, 280], [707, 516], [483, 737], [301, 735], [159, 736], [157, 894], [155, 1098], [289, 1271], [475, 1271], [705, 1268], [705, 1379], [705, 1621], [457, 1846], [105, 1846]],
    // Path 2
    [[33, 85], [477, 85], [667, 192], [667, 286], [667, 510], [477, 697], [285, 695], [119, 695], [119, 863], [119, 1141], [285, 1310], [479, 1310], [667, 1404], [667, 1592], [667, 1820], [453, 2011], [105, 2011]],
    // Path 3
    [[155, 127], [463, 127], [625, 213], [625, 304], [625, 482], [459, 655], [277, 653], [77, 653], [77, 849], [77, 1151], [257, 1348], [461, 1352], [625, 1419], [625, 1579], [625, 1779], [437, 1942], [105, 1942]]
  ];

  tubeMeshes = rawPaths.map((pathPoints, idx) => {
    const curvePoints = pathPoints.map(p => mapSvgPoint(p[0], p[1]));
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');
    const tubeGeom = new THREE.TubeGeometry(curve, 250, 10 - idx * 2, 16, false);

    const shaderMat = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_scrollProgress: { value: 0 },
        u_colorBase: { value: new THREE.Color('#2563EB') },
        u_colorPulse: { value: new THREE.Color('#00F0FF') }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float u_time;
        uniform float u_scrollProgress;
        uniform vec3 u_colorBase;
        uniform vec3 u_colorPulse;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          // Fresnel rim glass calculation for Microsoft Fluent aesthetic
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - abs(dot(normal, viewDir)), 2.5);

          // Subtle frosted glass base opacity
          float glassAlpha = 0.12 + fresnel * 0.35;
          vec3 glassColor = mix(vec3(0.9, 0.92, 0.98), vec3(1.0), fresnel);

          // Traveling Gaussian energy wave centered at u_scrollProgress
          float pulseCenter = u_scrollProgress;
          float dist = (vUv.x - pulseCenter) / 0.18;
          float wave = exp(-dist * dist); // Soft Gaussian falloff (0 at edges)

          vec3 activeColor = mix(u_colorBase, u_colorPulse, wave);
          vec3 finalColor = mix(glassColor, activeColor, wave * 0.85);
          float finalAlpha = max(glassAlpha, wave * 0.9);

          gl_FragColor = vec4(finalColor, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(tubeGeom, shaderMat);
    scene.add(mesh);
    return mesh;
  });

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: true,
    onUpdate: (self) => {
      tubeMeshes.forEach(mesh => {
        if (mesh) mesh.material.uniforms.u_scrollProgress.value = self.progress;
      });
    }
  });

  const clock = new THREE.Clock();
  const animate = () => {
    const elapsed = clock.getElapsedTime();
    tubeMeshes.forEach(mesh => {
      if (mesh) mesh.material.uniforms.u_time.value = elapsed;
    });
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();
}

export function killItGlassFlowAnimations() {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (scrollTriggerInstance) scrollTriggerInstance.kill();
  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  canvas = null;
  scene = null;
  camera = null;
  renderer = null;
  tubeMeshes = [];
}
