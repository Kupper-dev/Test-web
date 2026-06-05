# Message Overwhelming Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a sticky viewport section named "Message Overwhelming" featuring a 2D Matter.js physics engine that spawns custom message bubbles, pre-fills 40% on load, and enables mouse hover repulsion.

**Architecture:** Create an HTML template sandbox page, load Matter.js, clone hidden bubble templates into the DOM, measure their bounding boxes, sync coordinates via CSS 3D transforms, fast-forward physics on load for settling, and bind custom mouse repeller bodies.

**Tech Stack:** Matter.js, HTML5, Vanilla CSS, Vite, ES6 Javascript.

---

## Task 1: Environment Setup & Vite Configuration

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: Install matter-js dependency**

Run: `npm install matter-js`
Expected: Installation completes, updating `package.json` and `package-lock.json`.

- [ ] **Step 2: Add overwhelming entry point in vite.config.js**

Replace lines 5-19 in `vite.config.js` with:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        devlink: resolve(__dirname, 'devlink.html'),
        devlink2: resolve(__dirname, 'devlink-2.html'),
        lusion: resolve(__dirname, 'lusion.html'),
        ticketsSandbox: resolve(__dirname, 'tickets-sandbox/index.html'),
        overwhelming: resolve(__dirname, 'overwhelming.html'),
      },
    },
  },
});
```

- [ ] **Step 3: Commit environment changes**

Run:
```bash
git add package.json package-lock.json vite.config.js
git commit -m "chore: install matter-js and configure vite overwhelming page entry"
```

---

## Task 2: Create HTML Sandbox Page

**Files:**
- Create: `overwhelming.html`

- [ ] **Step 1: Write HTML markup for overwhelming.html**

Write the following content to `overwhelming.html`:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kupper Sandbox - Message Overwhelming</title>
  <link rel="stylesheet" href="/src/devlink/css/global.css">
  <link rel="stylesheet" href="/src/style.css">
</head>

<body data-barba="wrapper" data-scrolling-started="false">

  <!-- Global persistent elements (outside Barba container — never swapped) -->
  <div class="global">

    <!-- SPA Transition Wipe Screen Overlay -->
    <div data-transition-theme="light" class="transition">
      <div class="loading-icon">
        <div class="loading-icon__inner"></div>
      </div>
    </div>

    <!-- Persistent Capsule Navbar (matches index.html and about.html) -->
    <nav data-marketing-theme="dark" data-nav-theme="light" data-nav-status="not-active"
      data-scrolling-started="false" data-scrolling-direction="up" class="nav">
      <div data-nav-toggle="close" class="nav__bg"></div>

      <div class="nav-bar__wrap">
        <div class="nav-bar__width">
          <div class="nav-bar">
            <!-- Background & Outline for the capsule -->
            <div class="nav-bar__back">
              <div class="nav-bar__outline"></div>
              <div class="nav-bar__bg"></div>
            </div>

            <!-- Top Row -->
            <div data-nav-bar-height="" class="nav-bar__top">
              <div class="nav-bar__menu">
                <div data-nav-toggle="toggle" class="nav-menu">
                  <div class="nav-menu__hamburger">
                    <div class="nav-menu__hamburger-bar"></div>
                    <div class="nav-menu__hamburger-bar"></div>
                  </div>
                  <span class="nav-menu__label">Menu</span>
                </div>
              </div>

              <div class="nav-bar__logo">
                <a aria-label="go to homepage" href="/index.html" class="nav-logo" data-barba-update="">
                  <!-- Wordmark SVG -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 156" fill="none"
                    class="nav-logo__wordmark-svg">
                    <path
                      d="M78.1189 156C104.864 156 128.46 142.594 142.542 122.162C150.631 142.968 171.556 156 199.261 156C219.221 156 236.057 149.64 246.874 139.183L245.315 152.771H279.112L287.201 82.4124L305.982 152.771H339.811L358.592 82.4124L366.676 152.771H400.473L396.853 121.273C410.857 142.204 434.75 156 461.881 156C505.024 156 540 121.128 540 78.1118C540 35.096 505.014 0.223607 461.871 0.223607C428.397 0.223607 399.852 21.2219 388.733 50.7173L383.272 3.22411H345.923L322.886 89.5314L299.849 3.22411H262.5L257.253 48.8556C256.617 35.5796 251.151 23.5516 241.721 14.8413C231.212 5.13257 216.53 0 199.256 0C183.072 0 169.126 4.59695 158.924 13.2968C151.403 19.7139 146.48 27.9977 144.576 37.1864C130.812 15.0025 106.205 0.223607 78.1189 0.223607C34.9757 0.223607 0 35.096 0 78.1118C0 121.128 34.9757 156 78.1189 156ZM461.871 35.2728C485.602 35.2728 504.837 54.451 504.837 78.1118C504.837 101.773 485.602 120.951 461.871 120.951C438.14 120.951 418.905 101.773 418.905 78.1118C418.905 54.451 438.14 35.2728 461.871 35.2728ZM199.261 32.6467C213.927 32.6467 222.929 39.4173 223.336 50.7589L223.461 54.2066H256.643L253.222 83.9932C251.521 81.2631 249.503 78.741 247.151 76.4478C239.411 68.9179 228.062 63.7905 213.411 61.2112L193.66 57.6855C180.574 55.335 177.893 51.2581 177.893 45.8603C177.893 44.5083 178.493 32.6415 199.261 32.6415V32.6467ZM185.08 90.4258L208.352 94.7784C223.378 97.6541 225.402 103.733 225.402 109.302C225.402 118.096 215.383 123.556 199.251 123.556C180.094 123.556 172.855 112.781 172.474 103.556L172.333 100.129H153.046C155.106 93.1455 156.233 85.7613 156.233 78.1118C156.233 77.7478 156.212 77.3838 156.207 77.0198C163.143 83.5876 172.829 88.1689 185.075 90.4258H185.08ZM78.1189 35.2728C101.85 35.2728 121.085 54.451 121.085 78.1118C121.085 101.773 101.85 120.951 78.1189 120.951C54.388 120.951 35.153 101.773 35.153 78.1118C35.153 54.451 54.388 35.2728 78.1189 35.2728Z"
                      fill="currentColor" />
                  </svg>
                  <!-- Symbol SVG -->
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none"
                    class="nav-logo__icon-svg">
                    <path
                      d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z"
                      fill="currentColor" />
                  </svg>
                </a>
              </div>

              <div class="nav-bar__buttons">
                <a href="#login" class="nav-button is--login">Login</a>
                <a href="#join" class="nav-button is--join">Join</a>
              </div>
            </div>

            <div class="nav-bar__line"></div>

            <!-- Bottom Dropdown Row (Same persistent links) -->
            <div class="nav-bar__bottom">
              <div class="nav-bar__bottom-overflow">
                <div data-lenis-prevent="" class="nav-bar__bottom-inner">
                  <div class="nav-bar__bottom-row">
                    <div class="nav-bar__bottom-col is--products">
                      <div class="nav-bar__tag-row"><span class="eyebrow">Our Products</span></div>
                      <ul class="nav-bar__ul-big">
                        <li class="nav-bar__big-li"><a data-hover="" href="#vault" class="nav-bar__big-a"><span data-underline-link="" class="nav-bar__big-span">The Vault</span></a></li>
                        <li class="nav-bar__big-li"><a data-hover="" href="#transitions" class="nav-bar__big-a"><span data-underline-link="" class="nav-bar__big-span">Page Transition Course</span></a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  </div>

  <!-- Barba Page Container (swapped on page transitions) -->
  <main data-barba="container" data-barba-namespace="overwhelming" data-page-theme="light" class="main">

    <!-- Scrolling Green Infinite Marquee -->
    <div data-wf--under-nav-bar--variant="lightning" class="under-nav-bar">
      <div class="under-nav-bar__inner">
        <a href="#marquee-click" class="nav-marquee w-inline-block">
          <div data-css-marquee="" style="animation-duration: 30s" class="marquee-css">
            <div data-css-marquee-list="nav" class="marquee-css__list">
              <div class="marquee-css__item">
                <p class="eyebrow is--nav-marquee">New: Message Overwhelming Sandbox</p>
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- Hero and Page Content -->
    <div class="main-content">
      <section class="overwhelming-track">
        <div class="overwhelming-sticky">
          <!-- Placeholder Center Cards Area (Target for Phase 2) -->
          <div class="overwhelming-center-content">
            <div style="text-align: center; color: var(--color-neutral-600); max-width: 500px; padding: 2em; background: rgba(255,255,255,0.7); border-radius: 20px; border: 1px solid rgba(0,0,0,0.05); backdrop-filter: blur(10px);">
              <span class="eyebrow" style="color: #2051ff;">Message Overwhelming</span>
              <h2 style="font-size: 2em; margin-top: 0.25em; font-weight: 700;">Phase 1 Physics</h2>
              <p style="margin-top: 1em; font-size: 14px; line-height: 1.5;">Watch messages stack up dynamically at the bottom. Move your mouse cursor into the pile to push them aside. (Cards will be placed here in Phase 2).</p>
            </div>
          </div>

          <!-- Active falling message bubbles will be appended here -->
          <div class="overwhelming-physics-container"></div>

          <!-- Hidden Spawning Template -->
          <div class="overwhelming-template-wrapper" style="display: none;">
            <div class="message-bubble">
              <span class="message-text"></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>

  <script type="module" src="/src/main.js"></script>
</body>

</html>
```

- [ ] **Step 2: Commit overwhelming.html**

Run:
```bash
git add overwhelming.html
git commit -m "feat: create sandbox HTML template with overwhelming section layout"
```

---

## Task 3: CSS Styles Integration

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Append styling rules to src/style.css**

Append the following code to the end of `src/style.css`:
```css

/* ───────────────────────────────────────────────
   Message Overwhelming Physics Section
   ─────────────────────────────────────────────── */
.overwhelming-track {
  width: 100%;
  height: 300vh; /* Allow scroll track length */
  position: relative;
}

.overwhelming-sticky {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--color-neutral-200, #E4E3E3); /* Fallback light gray theme */
  display: flex;
  align-items: center;
  justify-content: center;
}

.overwhelming-center-content {
  position: relative;
  z-index: 10;
  pointer-events: auto;
}

.overwhelming-physics-container {
  position: absolute;
  inset: 0;
  pointer-events: auto; /* Allow mouse interaction for repulsion */
  z-index: 5;
}

.message-bubble {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 100px;
  padding: 0.85em 1.75em;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03);
  will-change: transform;
  transform-origin: center center;
  white-space: nowrap;
  pointer-events: none; /* Let mouse moves pass through to container repeller */
  user-select: none;
}

.message-bubble.is--white {
  background-color: #ffffff;
  color: #201D1D;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.message-bubble.is--blue-2 {
  background-color: #2051ff; /* variant blue 2 fallback */
  color: #ffffff;
  border: 1px solid #1041ef;
}
```

- [ ] **Step 2: Commit CSS changes**

Run:
```bash
git add src/style.css
git commit -m "style: add message overwhelming section and bubble variants styling"
```

---

## Task 4: Physics & Spawner Script

**Files:**
- Create: `src/animations/overwhelmingAnimations.js`

- [ ] **Step 1: Write src/animations/overwhelmingAnimations.js**

Write the complete code block below:
```javascript
import { Engine, World, Bodies, Composite, Body } from 'matter-js';

let engine = null;
let runnerId = null;
let spawnInterval = null;
let activeBubbles = []; // Holds { body, element, width, height }
let boundaries = []; // Floor, left, right boundaries
let mouseBody = null;

// Predefined customizable messages array
const MESSAGES = [
  "Hi! How can I help?",
  "Where is my ticket?",
  "I need a refund, please.",
  "My computer is slow.",
  "Is the server down?",
  "Can I upgrade my monthly plan?",
  "Is there a discount available?",
  "Thanks for the quick response!",
  "Please call me as soon as possible.",
  "How long does it take to repair?",
  "I received an incorrect charge.",
  "My password reset link expired.",
  "Awesome customer support!"
];

// Helper: Measure bubble size off-screen
function measureBubble(text, variant) {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container) return { width: 120, height: 40 };

  const temp = document.createElement('div');
  temp.className = `message-bubble ${variant === 'blue-2' ? 'is--blue-2' : 'is--white'}`;
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.whiteSpace = 'nowrap';
  
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = text;
  temp.appendChild(span);
  
  container.appendChild(temp);
  const rect = temp.getBoundingClientRect();
  container.removeChild(temp);
  
  return {
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height)
  };
}

// Function to spawn a single bubble
function spawnBubble(isPrefill = false, customY = null) {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container || !engine) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Enforce bubble limits to protect memory
  const maxBubbles = width < 768 ? 35 : 75;
  if (!isPrefill && activeBubbles.length >= maxBubbles) {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
    return;
  }

  // Choose content & color variant
  const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const variant = Math.random() > 0.5 ? 'white' : 'blue-2';

  // Measure
  const size = measureBubble(text, variant);

  // Position calculation
  let spawnX = 0;
  let spawnY = customY !== null ? customY : -100;

  if (isPrefill) {
    // Fill bottom 40% area randomly
    spawnX = Math.random() * (width - size.width - 80) + size.width / 2 + 40;
  } else {
    // Spawner side choice (top-left vs top-right)
    const isMobile = width < 768;
    if (isMobile) {
      // Mobile: Left side spawning only
      spawnX = Math.random() * 60 + size.width / 2 + 20;
    } else {
      // Desktop: Left or right corner spawning
      const spawnLeft = Math.random() > 0.5;
      if (spawnLeft) {
        spawnX = Math.random() * 80 + size.width / 2 + 40;
      } else {
        spawnX = width - (Math.random() * 80 + size.width / 2 + 40);
      }
    }
  }

  // Create Matter.js body
  const body = Bodies.rectangle(spawnX, spawnY, size.width, size.height, {
    restitution: 0.15,
    friction: 0.15,
    frictionAir: 0.03,
    angle: (Math.random() - 0.5) * 0.3 // Add a slight initial skew
  });

  // Create DOM node
  const element = document.createElement('div');
  element.className = `message-bubble ${variant === 'blue-2' ? 'is--blue-2' : 'is--white'}`;
  
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = text;
  element.appendChild(span);
  
  container.appendChild(element);

  // Add to world & tracking array
  World.add(engine.world, body);
  activeBubbles.push({ body, element, width: size.width, height: size.height });
}

// Build and update boundary bodies on init/resize
function updateBoundaries() {
  if (!engine) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Remove existing boundaries from world
  if (boundaries.length > 0) {
    World.remove(engine.world, boundaries);
  }

  // Define floor, left, and right wall bodies
  const thickness = 100;
  const floor = Bodies.rectangle(width / 2, height + thickness / 2, width + 400, thickness, { isStatic: true });
  const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height + 400, { isStatic: true });
  const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + 400, { isStatic: true });

  boundaries = [floor, leftWall, rightWall];
  World.add(engine.world, boundaries);
}

// Tick loop running at 60fps
function tick() {
  if (!engine) return;

  // Step the physics engine forward
  Engine.update(engine, 1000 / 60);

  // Sync positions from rigid bodies to DOM element transform offsets
  activeBubbles.forEach((bubble) => {
    const { x, y } = bubble.body.position;
    const angle = bubble.body.angle;
    bubble.element.style.transform = `translate3d(${x - bubble.width / 2}px, ${y - bubble.height / 2}px, 0px) rotate(${angle}rad)`;
  });

  runnerId = requestAnimationFrame(tick);
}

// Initialize animations and events
export function initOverwhelmingAnimations() {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container) return;

  // Ensure any prior engine is fully destroyed
  killOverwhelmingAnimations();

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Initialize engine
  engine = Engine.create({
    gravity: { y: 0.9, scale: 0.001 }
  });

  // Setup bounds
  updateBoundaries();

  // Create invisible mouse repeller circular body
  const repellerRadius = width < 768 ? 40 : 80;
  mouseBody = Bodies.circle(-1000, -1000, repellerRadius, {
    isStatic: true,
    friction: 0.1,
    restitution: 0.1
  });
  World.add(engine.world, mouseBody);

  // 1. Prefill Phase (40% Capacity)
  const prefillCount = width < 768 ? 12 : 28;
  for (let i = 0; i < prefillCount; i++) {
    // Generate scattered vertical offsets spanning middle-bottom
    const relativeY = height - 120 - (i * 24) - Math.random() * 120;
    spawnBubble(true, relativeY);
  }

  // Settle prefill physics instantly
  for (let i = 0; i < 150; i++) {
    Engine.update(engine, 1000 / 60);
  }

  // Render resting coordinates
  activeBubbles.forEach((bubble) => {
    const { x, y } = bubble.body.position;
    const angle = bubble.body.angle;
    bubble.element.style.transform = `translate3d(${x - bubble.width / 2}px, ${y - bubble.height / 2}px, 0px) rotate(${angle}rad)`;
  });

  // Start loop ticking
  runnerId = requestAnimationFrame(tick);

  // 2. Continuous time-based Spawner
  spawnInterval = setInterval(() => {
    spawnBubble(false, -80);
  }, 1200);

  // 3. Mouse event listeners
  const stickySec = document.querySelector('.overwhelming-sticky');
  if (stickySec) {
    mouseMoveListener = (e) => {
      if (!mouseBody) return;
      const rect = stickySec.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      Body.setPosition(mouseBody, { x: mouseX, y: mouseY });
    };
    
    mouseLeaveListener = () => {
      if (!mouseBody) return;
      Body.setPosition(mouseBody, { x: -1000, y: -1000 });
    };

    stickySec.addEventListener('mousemove', mouseMoveListener);
    stickySec.addEventListener('mouseleave', mouseLeaveListener);
  }

  // 4. Viewport resize listener
  resizeListener = () => {
    updateBoundaries();
  };
  window.addEventListener('resize', resizeListener);
}

// Tear down engine and free memory
export function killOverwhelmingAnimations() {
  // Clear runner animation frame
  if (runnerId) {
    cancelAnimationFrame(runnerId);
    runnerId = null;
  }

  // Clear timers
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }

  // Remove elements from DOM
  activeBubbles.forEach((bubble) => {
    if (bubble.element && bubble.element.parentNode) {
      bubble.element.parentNode.removeChild(bubble.element);
    }
  });
  activeBubbles = [];

  // Clear event listeners
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener);
    resizeListener = null;
  }

  const stickySec = document.querySelector('.overwhelming-sticky');
  if (stickySec) {
    if (mouseMoveListener) {
      stickySec.removeEventListener('mousemove', mouseMoveListener);
      mouseMoveListener = null;
    }
    if (mouseLeaveListener) {
      stickySec.removeEventListener('mouseleave', mouseLeaveListener);
      mouseLeaveListener = null;
    }
  }

  // Clean Matter.js world
  if (engine) {
    World.clear(engine.world);
    Engine.clear(engine);
    engine = null;
  }

  mouseBody = null;
  boundaries = [];
}
```

- [ ] **Step 2: Commit overwhelmingAnimations.js**

Run:
```bash
git add src/animations/overwhelmingAnimations.js
git commit -m "feat: implement Matter.js physics engine spawner and sync animations"
```

---

## Task 5: Animation Registry Hookup

**Files:**
- Modify: `src/animations/index.js`

- [ ] **Step 1: Update src/animations/index.js to hook up new animations**

Replace content of `src/animations/index.js` with:
```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWhatsappGlow, killWhatsappGlow } from './whatsappGlow';
import { initCardAnimations, killCardAnimations } from './cardAnimations';
import { initBranchAnimations, killBranchAnimations, resetToDefaultBranch } from './branchAnimations';
import { initDynamicText, killDynamicText } from './dynamicText';
import { initLusionAnimations, killLusionAnimations } from './lusionAnimations';
import { initNavAnimations, killNavAnimations } from './navAnimations';
import { initHeroAnimations, killHeroAnimations } from './heroAnimations';
import { initOverwhelmingAnimations, killOverwhelmingAnimations } from './overwhelmingAnimations';

export { resetToDefaultBranch };

// Central registry to start all animations
export function initAnimations(isNavTriggered = false) {
  initWhatsappGlow();
  initCardAnimations();
  initBranchAnimations();
  initDynamicText();
  initLusionAnimations();
  initNavAnimations(false, isNavTriggered);
  initHeroAnimations();
  
  if (document.querySelector('.overwhelming-track')) {
    initOverwhelmingAnimations();
  }
  
  // Force ScrollTrigger to calculate accurate bounds after layout setup
  ScrollTrigger.refresh();
}

// Central registry to clean up all animations on page leave
export function killAnimations() {
  killWhatsappGlow();
  killCardAnimations();
  killBranchAnimations();
  killDynamicText();
  killLusionAnimations();
  killNavAnimations();
  killHeroAnimations();
  killOverwhelmingAnimations();
}
```

- [ ] **Step 2: Commit index.js**

Run:
```bash
git add src/animations/index.js
git commit -m "feat: register overwhelming animations inside central animations registry"
```
