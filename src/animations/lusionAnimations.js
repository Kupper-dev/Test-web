import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

let scene, camera, renderer;
let canvas = null;
let animationFrameId = null;

// Three.js meshes
let lineMesh = null;
let morphMesh = null;

// DOM reference elements
let containerEl = null;
let titleEl = null;
let thumbEl = null;
let videoContainerEl = null;
let videoEl = null;
let videoTexture = null;
let thumbVideoTexture = null;

// Split text instances
let line1Split = null;
let line2Split = null;
let descSplit = null;

// Curves points and definitions
let curve = null;
let curvePoints = [];

// Scroll listeners and GSAP timelines
let scrollTriggerInstance = null;
let titleTl = null;
let morphTl = null;
let paragraphTl = null;
let parallaxTween = null;
let resizeHandler = null;

export function initLusionAnimations() {
  containerEl = document.getElementById('home-reel');
  if (!containerEl) return;

  titleEl = document.getElementById('home-reel-title');
  thumbEl = document.getElementById('home-reel-thumb');
  videoContainerEl = document.getElementById('home-reel-container');

  // Create video elements and texture
  videoEl = document.createElement('video');
  videoEl.src = 'https://cdn.prod.website-files.com/695c194c86d5e76167047ce4%2F6a1e5b99bf22800753f0bc56_IT%20chaos%20web%20FHD_webm.webm';
  videoEl.muted = true;
  videoEl.loop = true;
  videoEl.playsInline = true;
  videoEl.crossOrigin = 'anonymous';
  videoEl.style.display = 'none';
  document.body.appendChild(videoEl);

  videoTexture = new THREE.VideoTexture(videoEl);
  videoTexture.colorSpace = THREE.SRGBColorSpace;

  // Initialize WebGL Canvas
  canvas = document.createElement('canvas');
  canvas.id = 'lusion-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '2'; // In front of text layer, behind play button
  document.body.insertBefore(canvas, document.body.firstChild); // Insert as first child of body to avoid section transform shifts


  // ───────────────────────────────────────────────
  // 1. Text Splitting & GSAP Scroll Animation
  // ───────────────────────────────────────────────
  const titleInner = document.getElementById('home-reel-title-inner');
  const paragraphEl = document.getElementById('home-reel-content');
  const line1El = document.getElementById('home-reel-title-line-1');
  const line2El = document.getElementById('home-reel-title-line-2');
  const descEl = document.getElementById('home-reel-desc');
  const ctaEl = document.getElementById('home-reel-cta');

  if (line1El && line2El) {
    line1Split = new SplitType(line1El, { types: 'words' });
    line2Split = new SplitType(line2El, { types: 'words' });

    if (line1Split.words && line2Split.words) {
      // Helper function to wrap text of each word in an inner span
      const wrapWordContent = (wordsArray) => {
        return wordsArray.map(word => {
          // Style outer word element
          word.style.display = 'inline-block';
          word.style.overflow = 'hidden';
          word.style.verticalAlign = 'top';
          word.style.position = 'relative';

          // Create inner element
          const innerSpan = document.createElement('span');
          innerSpan.className = 'word-inner';
          innerSpan.style.display = 'inline-block';
          innerSpan.style.position = 'relative';

          // Move children into inner span
          while (word.firstChild) {
            innerSpan.appendChild(word.firstChild);
          }
          word.appendChild(innerSpan);
          return innerSpan;
        });
      };

      const line1Inners = wrapWordContent(line1Split.words);
      const line2Inners = wrapWordContent(line2Split.words);

      const wordBold = line1Split.words[0];
      const wordIdeas = line1Split.words[1];

      // Calculate layout horizontal difference based on the offset of the first word
      const getOffsetD = () => wordBold ? wordBold.offsetLeft : 0;

      // Create scroll-scrub timeline for choreographed transitions
      titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 85%',
          end: 'top 15%',
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      // --- PHASE 1: Vertical Reveal ---

      // Line 1 ("Bold Ideas,"): slide inner text upward (y: "100%" -> 0)
      const innerBold = line1Inners[0];
      const innerIdeas = line1Inners[1];

      titleTl.fromTo(innerBold,
        { yPercent: 100 },
        { yPercent: 0, ease: 'power3.out', duration: 0.6 },
        0
      );
      titleTl.fromTo(innerIdeas,
        { yPercent: 100 },
        { yPercent: 0, ease: 'power3.out', duration: 0.6 },
        0.15
      );

      // Line 2 ("Brought to Life"): slide inner text downward (y: "-100%" -> 0)
      const innerBrought = line2Inners[0];
      const innerTo = line2Inners[1];
      const innerLife = line2Inners[2];

      titleTl.fromTo(innerBrought,
        { yPercent: -100 },
        { yPercent: 0, ease: 'power3.out', duration: 0.6 },
        0.2
      );
      titleTl.fromTo(innerTo,
        { yPercent: -100 },
        { yPercent: 0, ease: 'power3.out', duration: 0.6 },
        0.3
      );
      titleTl.fromTo(innerLife,
        { yPercent: -100 },
        { yPercent: 0, ease: 'power3.out', duration: 0.6 },
        0.4
      );

      // --- LINE 1 PHASE 2: Horizontal Slide to Right ---
      // Words slide from -D back to 0: "Ideas," first, then "Bold"
      titleTl.fromTo(wordIdeas,
        { x: () => -getOffsetD() },
        { x: 0, ease: 'expo.out', duration: 0.5 },
        0.75
      );
      titleTl.fromTo(wordBold,
        { x: () => -getOffsetD() },
        { x: 0, ease: 'expo.out', duration: 0.5 },
        0.85
      );

      // --- Paragraph/CTA Slide Up & Staggered Word reveal ---
      if (paragraphEl) {
        paragraphTl = gsap.timeline({
          scrollTrigger: {
            trigger: paragraphEl,
            start: 'top 95%', // starts when the top of paragraph enters the viewport
            end: 'top 65%',   // finishes when paragraph is fully inside viewport
            scrub: 1,         // smooth lag scrub to respond to scroll up/down
            invalidateOnRefresh: true
          }
        });

        if (descEl) {
          descSplit = new SplitType(descEl, {
            types: 'lines, words',
            lineClass: 'home-reel-line',
            wordClass: 'home-reel-word'
          });

          descSplit.lines.forEach((line, lineIdx) => {
            line.style.overflow = 'hidden';
            line.style.display = 'block';
            line.style.position = 'relative';

            const words = line.querySelectorAll('.home-reel-word');
            words.forEach(word => {
              word.style.display = 'inline-block';
              word.style.position = 'relative';
            });

            paragraphTl.fromTo(words,
              { yPercent: 100 },
              { yPercent: 0, ease: 'power2.out', duration: 0.6, stagger: 0.05 },
              lineIdx * 0.15
            );
          });

          if (ctaEl) {
            paragraphTl.fromTo(ctaEl,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, ease: 'power2.out', duration: 0.6 },
              descSplit.lines.length * 0.15 + 0.1
            );
          }
        }
      }

      scrollTriggerInstance = titleTl.scrollTrigger;

      // --- Parallax Speedup (8% Faster) ---
      parallaxTween = gsap.to('#home-reel-content-inner', {
        y: () => -containerEl.offsetHeight * 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: containerEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });

      // ───────────────────────────────────────────────
      // 1.5. Pinning and Morphing Timeline
      // ───────────────────────────────────────────────
      // Set initial state for video title container to slide up from bottom (preserving CSS centering)
      gsap.set('#home-reel-video-title-container', { xPercent: -50, yPercent: -50, y: 250, opacity: 0 });

      morphTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 25%',
          end: '+=180%', // scroll distance to complete morph
          scrub: true,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true
        }
      });

      // Slide title and description wrapper up and fade out of view continuously over the full timeline duration (1.0)
      morphTl.to(titleInner, { y: -window.innerHeight * 1.0, opacity: 0, ease: 'none', duration: 1.0 }, 0);
      morphTl.to('#home-reel-content-reveal', { y: -window.innerHeight * 1.0, opacity: 0, ease: 'none', duration: 1.0 }, 0);

      // Translate the video container up dynamically to center in the viewport over the full timeline duration (1.0)
      morphTl.to('#home-reel-container', {
        y: () => (window.innerHeight - 608) / 2 - (window.innerHeight * 0.25 + videoContainerEl.offsetTop),
        ease: 'power1.out',
        duration: 1.0
      }, 0);

      // Slide up the PLAY REEL title container (fade in and settle centered)
      morphTl.to('#home-reel-video-title-container', { y: 0, opacity: 1, ease: 'power2.out', duration: 0.5 }, 0.3);
    }
  }

  try {
    // Scene & Renderer Setup
    const w = window.innerWidth;
    const h = window.innerHeight;
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add webgl-active class to hide duplicate HTML placeholder elements
    if (containerEl) {
      containerEl.classList.add('webgl-active');
    }

    // Perspective Camera mapping 1:1 to screen pixels at z = 0
    const fov = 45;
    camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 2000);
    const depth = window.innerHeight / (2 * Math.tan((fov * Math.PI) / 360));
    camera.position.set(0, 0, depth);

    // ───────────────────────────────────────────────
    // 2. Animated Scroll Line (Drawing Spline)
    // ───────────────────────────────────────────────
    // SVG viewBox: 0 0 1920 1480
    // Group matrix: matrix(0.575343,0,0,0.575343,-1.37604,282.597)
    // We map 2D SVG canvas coordinate space to our WebGL NDC space:
    // WebGL space: x goes from -w/2 to +w/2, y goes from -h/2 to +h/2 (top is positive, bottom is negative)
    const mapSvgPoint = (svgX, svgY) => {
      const matScale = 0.575343;
      const tx = -1.37604;
      const ty = 282.597;

      const xTransformed = svgX * matScale + tx;
      const yTransformed = svgY * matScale + ty;

      // Scale proportionally to preserve original SVG viewBox aspect ratio (1920 wide)
      const scale = w / 1920;

      const glX = xTransformed * scale;
      const glY = -yTransformed * scale;
      return new THREE.Vector3(glX, glY, 0);
    };

    // Parse path d attribute:
    // M52.796,-439.037 C308.755,-437.397 1571.89,-207.871 878.391,680.295
    // C358.606,1345.99 -355.117,522.324 520.344,117.153
    // C1571.89,-369.513 1036.56,848.89 2006.41,113.677
    // C2941.51,-595.185 2030.75,449.53 3169.2,624.676
    // C3553.32,683.771 2913.7,1318.17 2762.48,1452.01
    // C2319.53,1844.05 3276.96,1973.44 3276.96,1973.44
    const svgSegments = [
      { p0: [52.796, -439.037],  cp1: [308.755, -437.397],  cp2: [1571.89, -207.871],  p1: [878.391, 680.295] },
      { p0: [878.391, 680.295],  cp1: [358.606, 1345.99],   cp2: [-355.117, 522.324],  p1: [520.344, 117.153] },
      { p0: [520.344, 117.153],  cp1: [1571.89, -369.513],  cp2: [1036.56, 848.89],    p1: [2006.41, 113.677] },
      { p0: [2006.41, 113.677],  cp1: [2941.51, -595.185],  cp2: [2030.75, 449.53],    p1: [3169.2, 624.676] },
      { p0: [3169.2, 624.676],   cp1: [3553.32, 683.771],   cp2: [2913.7, 1318.17],    p1: [2762.48, 1452.01] },
      { p0: [2762.48, 1452.01],  cp1: [2319.53, 1844.05],   cp2: [3276.96, 1973.44],   p1: [3276.96, 1973.44] }
    ];

    curvePoints = [];

    // Evaluate cubic Bezier equations to generate smooth interpolation points
    svgSegments.forEach(seg => {
      const p0 = mapSvgPoint(seg.p0[0], seg.p0[1]);
      const cp1 = mapSvgPoint(seg.cp1[0], seg.cp1[1]);
      const cp2 = mapSvgPoint(seg.cp2[0], seg.cp2[1]);
      const p1 = mapSvgPoint(seg.p1[0], seg.p1[1]);

      const steps = 80; // 80 points per segment for smooth curve representation
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const mt = 1 - t;

        // Cubic Bezier formula: P(t) = (1-t)^3 * P0 + 3*t*(1-t)^2 * CP1 + 3*t^2*(1-t) * CP2 + t^3 * P1
        const x = mt * mt * mt * p0.x + 3 * t * mt * mt * cp1.x + 3 * t * t * mt * cp2.x + t * t * t * p1.x;
        const y = mt * mt * mt * p0.y + 3 * t * mt * mt * cp1.y + 3 * t * t * mt * cp2.y + t * t * t * p1.y;

        // Prevent duplicate segment end/start points
        if (i === 0 && curvePoints.length > 0) continue;

        curvePoints.push(new THREE.Vector3(x, y, 0));
      }
    });

    // 'centripetal' prevents Frenet frame flipping on tight curves (erratic polygon fix)
    curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');

    // Setup line geometry and material (Tube Mesh with Vertex Colors)
    const lineGeom = new THREE.BufferGeometry();
    const lineMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    lineMesh = new THREE.Mesh(lineGeom, lineMat);
    lineMesh.renderOrder = 1; // Render first (behind card)
    scene.add(lineMesh);

    // ───────────────────────────────────────────────
    // 3. Morphing Video Thumbnail Mesh
    // ───────────────────────────────────────────────
    const shaderMat = new THREE.ShaderMaterial({
      uniforms: {
        u_texture: { value: videoTexture },
        u_thumbTexture: { value: null },
        u_hasThumbTexture: { value: false },
        u_size: { value: new THREE.Vector2(280, 380) },
        u_radius: { value: 24.0 },
        u_curveStrength: { value: 0.0 },
        u_progress: { value: 0.0 }
      },
      vertexShader: `
        uniform float u_curveStrength;
        uniform float u_progress;
        varying vec2 v_uv;
        
        void main() {
          v_uv = uv;
          vec3 pos = position;
          
          // 0. Pre-tension (energy stored/anticipation pose that releases by u_progress = 0.4)
          float releaseFactor = clamp(1.0 - u_progress * 2.5, 0.0, 1.0);
          float preTensionY = -(uv.y - 0.5) * sin(uv.x * 3.14159265) * 0.08 * releaseFactor;
          float preTensionZ = -sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265) * 0.04 * releaseFactor;
          pos.y += preTensionY;
          pos.z += preTensionZ;
          
          // 1. Diagonal progress coordinate (top-right is 1.0, bottom-left is 0.0)
          float diagCoord = (uv.x + uv.y) * 0.5;
          
          // 2. Traveling Pulse Center (moves from 1.25 down to -0.25)
          float pulseCenter = 1.25 - u_progress * 1.5;
          
          // 3. Localized Gaussian Envelope (Wider width = 0.28 for gentler curve)
          float dist = (diagCoord - pulseCenter) / 0.28;
          float pulseStrength = exp(-dist * dist);
          
          // 4. Apply localized diagonal curvature (Z-depth and Y-dip)
          pos.z -= 0.32 * pulseStrength * u_curveStrength;
          pos.y -= 0.15 * pulseStrength * u_curveStrength;
          
          // 5. Asymmetrical Diagonal Unfolding: Stretch corners outwards along the wavefront
          pos.x += 0.05 * (uv.x - 0.5) * pulseStrength * u_curveStrength;
          pos.y += 0.05 * (uv.y - 0.5) * pulseStrength * u_curveStrength;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D u_texture;
        uniform sampler2D u_thumbTexture;
        uniform bool u_hasThumbTexture;
        uniform vec2 u_size;
        uniform float u_radius;
        varying vec2 v_uv;
        
        float sdRoundedBox(in vec2 p, in vec2 b, in float r) {
          vec2 q = abs(p) - b + r;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
        }
        
        void main() {
          vec2 p = (v_uv - 0.5) * u_size;
          vec2 b = u_size * 0.5;
          float d = sdRoundedBox(p, b, u_radius);
          float alpha = smoothstep(1.0, 0.0, d);
          if (alpha <= 0.0) discard;
          
          vec4 texColor = texture2D(u_texture, v_uv);
          gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
        }
      `,
      transparent: true
    });

    const planeGeom = new THREE.PlaneGeometry(1, 1, 32, 32);
    morphMesh = new THREE.Mesh(planeGeom, shaderMat);
    morphMesh.renderOrder = 10; // Set high renderOrder to render in front of drawing line
    scene.add(morphMesh);

    // Bind u_curveStrength to the scroll timeline with a popping/recoil kinetic envelope
    if (morphTl) {
      morphTl.to(morphMesh.material.uniforms.u_curveStrength, {
        keyframes: [
          { value: 0.0, duration: 0 },
          { value: 0.85, duration: 0.5, ease: "power2.out" },     // Gentle stretch & curve
          { value: -0.15, duration: 0.3, ease: "back.out(1.5)" }, // Soft recoil hit at bottom-left
          { value: 0.0, duration: 0.2, ease: "power1.inOut" }     // Settle flat
        ]
      }, 0);
    }

    // Start video elements
    videoEl.play().catch(e => console.log('Video auto-play pending interaction'));

    tick();
  } catch (e) {
    window.lusionInitError = { message: e.message, stack: e.stack };
    console.warn("WebGL/Three.js initialization failed. Falling back to layout only.", e);
  }

  // ───────────────────────────────────────────────
  // 4. Resize Handler
  // ───────────────────────────────────────────────
  resizeHandler = () => {
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      const depth = window.innerHeight / (2 * Math.tan((45 * Math.PI) / 360));
      camera.position.z = depth;
      camera.updateProjectionMatrix();
    }

    // Recompute spline points to keep them aligned on resize
    const wNew = window.innerWidth;
    const mapSvgPoint = (svgX, svgY) => {
      const matScale = 0.575343;
      const tx = -1.37604;
      const ty = 282.597;

      const xTransformed = svgX * matScale + tx;
      const yTransformed = svgY * matScale + ty;

      const scale = wNew / 1920;

      const glX = xTransformed * scale;
      const glY = -yTransformed * scale;
      return new THREE.Vector3(glX, glY, 0);
    };

    const svgSegments = [
      { p0: [52.796, -439.037],  cp1: [308.755, -437.397],  cp2: [1571.89, -207.871],  p1: [878.391, 680.295] },
      { p0: [878.391, 680.295],  cp1: [358.606, 1345.99],   cp2: [-355.117, 522.324],  p1: [520.344, 117.153] },
      { p0: [520.344, 117.153],  cp1: [1571.89, -369.513],  cp2: [1036.56, 848.89],    p1: [2006.41, 113.677] },
      { p0: [2006.41, 113.677],  cp1: [2941.51, -595.185],  cp2: [2030.75, 449.53],    p1: [3169.2, 624.676] },
      { p0: [3169.2, 624.676],   cp1: [3553.32, 683.771],   cp2: [2913.7, 1318.17],    p1: [2762.48, 1452.01] },
      { p0: [2762.48, 1452.01],  cp1: [2319.53, 1844.05],   cp2: [3276.96, 1973.44],   p1: [3276.96, 1973.44] }
    ];

    curvePoints = [];

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

    curve = new THREE.CatmullRomCurve3(curvePoints, false, 'centripetal');
  };
  window.addEventListener('resize', resizeHandler);
}

function tick() {
  if (!renderer) return;

  // 1. Update Drawing Spline Line Based on Scroll
  const w = window.innerWidth;
  const h = window.innerHeight;
  const sectionRect = containerEl ? containerEl.getBoundingClientRect() : { left: 0, top: 0, height: 1000 };
  const sectionWebGLX = sectionRect.left - w / 2;
  const sectionWebGLY = h / 2 - sectionRect.top;

  if (lineMesh) {
    lineMesh.position.set(
      sectionWebGLX - w * 0.03, // 3% left
      sectionWebGLY + h * 0.25, // 25% up
      -5.0
    );
  }

  // Draw progress is split into two phases to avoid the mid-scroll freeze:
  //
  // PROBLEM: once GSAP pins the section, getBoundingClientRect().top freezes at
  //          the pin position (h * 0.25) for the entire scroll duration → drawRatio
  //          gets stuck mid-value and the line stops drawing.
  //
  // FIX: Phase 1 (pre-pin) is driven by sectionRect.top  →  drawRatio 0 → prePinWeight
  //      Phase 2 (during pin) is driven by morphTl progress →  drawRatio prePinWeight → 1.0
  //
  //   prePinWeight + pinWeight must sum to 1.0
  //   Adjust to control how much of the draw happens before vs. during the morph.

  const startY    = h * 0.95; // section-top at which drawing starts
  const pinStartY = h * 0.25; // must match morphTl ScrollTrigger start ('top 25%')
  const currentY  = sectionRect.top;

  const prePinWeight = 0.45; // fraction of total draw completed before pin
  const pinWeight    = 0.55; // fraction completed during the pinned morph

  // Phase 1: how far we are from startY down to pinStartY (0 → 1)
  const prePinProgress = Math.max(0, Math.min(1,
    (startY - currentY) / (startY - pinStartY)
  ));

  // Phase 2: morphTl.scrollTrigger.progress is 0 → 1 during the pinned scroll
  const pinProgress = (morphTl && morphTl.scrollTrigger)
    ? morphTl.scrollTrigger.progress
    : 0;

  const drawRatio = Math.min(1,
    prePinProgress * prePinWeight + pinProgress * pinWeight
  );

  if (curve) {
    const totalPoints = 300;
    const currentPointsCount = Math.max(2, Math.floor(drawRatio * totalPoints));
    const activePoints = curve.getPoints(totalPoints).slice(0, currentPointsCount);

    if (activePoints.length >= 2) {
      // centripetal prevents Frenet frame flips on tight bends (erratic polygon fix)
      const subCurve = new THREE.CatmullRomCurve3(activePoints, false, 'centripetal');
      const tubularSegments = activePoints.length * 2;
      const radialSegments = 14;
      const radius = 10.2;

      const newGeom = new THREE.TubeGeometry(subCurve, tubularSegments, radius, radialSegments, false);

      // Generate gradient vertex colors along the path segments
      const count = newGeom.attributes.position.count;
      const colors = new Float32Array(count * 3);

      const colorStart = new THREE.Color(0x5a90ff); // Electric blue
      const colorEnd = new THREE.Color(0x2a38ee);   // Deep indigo

      let index = 0;
      for (let i = 0; i <= tubularSegments; i++) {
        const ratio = i / tubularSegments;
        const c = colorStart.clone().lerp(colorEnd, ratio);

        for (let j = 0; j <= radialSegments; j++) {
          colors[index++] = c.r;
          colors[index++] = c.g;
          colors[index++] = c.b;
        }
      }

      newGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      if (lineMesh.geometry) {
        lineMesh.geometry.dispose();
      }
      lineMesh.geometry = newGeom;
    }
  }

  // 2. Update Thumbnail-to-Video Position and Morph
  if (!thumbEl) {
    thumbEl = document.getElementById('home-reel-thumb') || document.querySelector('.home-reel-thumb');
  }

  if (thumbEl && morphMesh) {
    const bgVideoEl = thumbEl.tagName === 'VIDEO' ? thumbEl : thumbEl.querySelector('video');
    if (bgVideoEl) {
      if (!thumbVideoTexture) {
        // Enforce CORS credentials and source reload directly on the video element
        // ONLY if it hasn't been set yet to prevent reloading and flashing the poster GIF.
        if (bgVideoEl.crossOrigin !== 'anonymous') {
          bgVideoEl.crossOrigin = 'anonymous';
          bgVideoEl.load();
        }

        thumbVideoTexture = new THREE.VideoTexture(bgVideoEl);
        thumbVideoTexture.colorSpace = THREE.SRGBColorSpace;
        morphMesh.material.uniforms.u_thumbTexture.value = thumbVideoTexture;
        morphMesh.material.uniforms.u_hasThumbTexture.value = true;
      }
      // Keep background video playing on every frame to prevent browser pause optimizations
      if (bgVideoEl.paused) {
        bgVideoEl.play().catch(() => { });
      }

      // Synchronize the full-size video source (videoEl) with the thumbnail video source (bgVideoEl)
      let activeSrc = bgVideoEl.src || bgVideoEl.currentSrc;
      if (!activeSrc) {
        const sourceEl = bgVideoEl.querySelector('source');
        if (sourceEl) {
          activeSrc = sourceEl.src;
        }
      }

      // Normalize URLs to ignore difference in encoding (e.g. %2F vs /)
      const normActive = activeSrc ? decodeURIComponent(activeSrc) : "";
      const normVideo = (videoEl && videoEl.src) ? decodeURIComponent(videoEl.src) : "";

      if (normActive && videoEl && normVideo !== normActive) {
        videoEl.src = activeSrc;
        videoEl.load();
        videoEl.play().catch((err) => {
          console.warn("Target video playback failed:", err);
        });
      }

      // Keep playback time aligned to prevent jumpy frames during transition
      if (videoEl && !videoEl.paused && !bgVideoEl.paused) {
        if (Math.abs(videoEl.currentTime - bgVideoEl.currentTime) > 0.15) {
          videoEl.currentTime = bgVideoEl.currentTime;
        }
      }
    }
  }

  if (thumbEl && videoContainerEl && morphMesh) {
    const thumbRect = thumbEl.getBoundingClientRect();
    const videoRect = videoContainerEl.getBoundingClientRect();

    // Transition progress driven by morphTl ScrollTrigger progress
    const transitionProgress = (morphTl && morphTl.scrollTrigger) ? morphTl.scrollTrigger.progress : 0;

    // Interpolate positions (mapped to pixel NDC space)
    const targetX = gsap.utils.interpolate(
      thumbRect.left + thumbRect.width / 2 - window.innerWidth / 2,
      videoRect.left + videoRect.width / 2 - window.innerWidth / 2,
      transitionProgress
    );
    const targetY = gsap.utils.interpolate(
      -(thumbRect.top + thumbRect.height / 2 - window.innerHeight / 2),
      -(videoRect.top + videoRect.height / 2 - window.innerHeight / 2),
      transitionProgress
    );
    const targetW = gsap.utils.interpolate(thumbRect.width, videoRect.width, transitionProgress);
    const targetH = gsap.utils.interpolate(thumbRect.height, videoRect.height, transitionProgress);
    const targetRadius = gsap.utils.interpolate(24, 12, transitionProgress);

    morphMesh.position.set(targetX, targetY, 0);
    morphMesh.scale.set(targetW, targetH, targetW);

    // Apply 3D perspective rotation peaking mid-animation and flattening at progress = 0 and 1
    const rotationFactor = Math.sin(transitionProgress * Math.PI);
    const rotX = rotationFactor * 0.12;
    const rotY = rotationFactor * -0.35;
    const rotZ = rotationFactor * -0.12;
    morphMesh.rotation.set(rotX, rotY, rotZ);

    morphMesh.material.uniforms.u_size.value.set(targetW, targetH);
    morphMesh.material.uniforms.u_radius.value = targetRadius;
    morphMesh.material.uniforms.u_progress.value = transitionProgress;
  }

  renderer.render(scene, camera);
  animationFrameId = requestAnimationFrame(tick);
}

export function killLusionAnimations() {
  if (containerEl) {
    containerEl.classList.remove('webgl-active');
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  if (titleTl) {
    titleTl.kill();
    titleTl = null;
  }

  if (morphTl) {
    morphTl.kill();
    morphTl = null;
  }

  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }

  // Dispose WebGL resources
  if (lineMesh) {
    lineMesh.geometry.dispose();
    lineMesh.material.dispose();
    scene.remove(lineMesh);
    lineMesh = null;
  }
  if (morphMesh) {
    morphMesh.geometry.dispose();
    morphMesh.material.dispose();
    scene.remove(morphMesh);
    morphMesh = null;
  }

  if (thumbVideoTexture) {
    thumbVideoTexture.dispose();
    thumbVideoTexture = null;
  }

  if (renderer) {
    renderer.dispose();
    renderer = null;
  }

  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas);
    canvas = null;
  }

  if (videoEl && videoEl.parentNode) {
    videoEl.parentNode.removeChild(videoEl);
    videoEl = null;
  }

  if (paragraphTl) {
    paragraphTl.kill();
    paragraphTl = null;
  }
  if (descSplit) {
    descSplit.revert();
    descSplit = null;
  }
  if (parallaxTween) {
    if (parallaxTween.scrollTrigger) {
      parallaxTween.scrollTrigger.kill();
    }
    parallaxTween.kill();
    parallaxTween = null;
  }

  if (line1Split) {
    line1Split.revert();
    line1Split = null;
  }
  if (line2Split) {
    line2Split.revert();
    line2Split = null;
  }

  scene = null;
  camera = null;
}
