# Gravity Cards Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone test page under `/gravity-sandbox` showcasing the dynamic falling gravity cards section extracted from 247artists.com.

**Architecture:** Create a self-contained directory containing `index.html`, `style.css`, and `script.js` served by Vite, loading standard GSAP and Lenis packages, using a requestAnimationFrame loop to simulate gravity cards physics.

**Tech Stack:** HTML5, CSS3, ES Modules, GSAP (including ScrollTrigger), Lenis scroll library, and Vite.

---

### Task 1: Create HTML structure
**Files:**
- Create: [index.html](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/gravity-sandbox/index.html)

- [ ] **Step 1: Write the HTML boilerplate and courses structure**
  Create the folder and HTML file with the extracted markup from `s-education-home` and 20 course cards.
  
  Code for `gravity-sandbox/index.html`:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gravity Cards Sandbox</title>
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <!-- Top Spacer Section -->
    <section class="spacer">
      Scroll Down to see the Gravity Cards
    </section>

    <!-- Education Section with Falling Gravity Cards -->
    <div class="s-education-home" id="education">
      <div class="s__inner">
        <div class="u-container">
          <div class="s__content js-content">
            <h2 class="s__suptitle">Education</h2>
            <p class="s__title">We help artists grow</p>
            <p class="s__text">
              Access expert-led <a href="https://learn.247artists.com/" target="_blank">online courses</a>, live webinars, and mentorship programs designed to sharpen your skills and expand your opportunities.
            </p>
            <div class="s__background"></div>
          </div>
        </div>

        <div class="s__courses">
          <h3 class="sb-course sb-course--title js-course">
            <span class="sb__inner">20+ Courses</span>
          </h3>
          
          <ul class="s__courses__list">
            <li class="sb-course js-course"><span class="sb__inner">Creating a One Year Indie Music Plan</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Building an Unstoppable Brand Identity</span></li>
            <li class="sb-course js-course"><span class="sb__inner">The art of Vision Boarding</span></li>
            <li class="sb-course js-course"><span class="sb__inner">5 Tips for Artists Going On Tour</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Music Business Intro</span></li>
            <li class="sb-course js-course"><span class="sb__inner">How to Manage Yourself as an Artist</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Marketing for Artists</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Building a team</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Artist Career Path</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Music Publishing 101</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Writing your Business Plan</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Music Releasing Strategies</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Music Marketing and Promotion</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Tour Management and Booking</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Artist Development Strategies</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Copyright and IP</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Starting an indie record label</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Agreements and Contracts 101</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Intro to Artist Management</span></li>
            <li class="sb-course js-course"><span class="sb__inner">Setting up YOUR business</span></li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Spacer Section -->
    <section class="spacer">
      End of Sandbox Page
    </section>

    <script type="module" src="./script.js"></script>
  </body>
  </html>
  ```

- [ ] **Step 2: Commit files**
  ```bash
  git add gravity-sandbox/index.html
  git commit -m "feat(sandbox): create index.html structure for gravity cards"
  ```

---

### Task 2: Create styles
**Files:**
- Create: [style.css](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/gravity-sandbox/style.css)

- [ ] **Step 1: Write CSS variables and layout styles**
  Implement layout matching 247artists branding using CSS variables for grid offsets, color branding variables, absolute cards configurations, and full viewport setups.

  Code for `gravity-sandbox/style.css`:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --color-black: #231E25;
    --color-brand-11: #ABF139; /* Neon lime green */
    --color-white: #FFF;
    --grid-offset: 20px;
    --grid-container-max-width-rem: 106.6667rem;
    --grid-width: min(calc(100vw - (var(--grid-offset) * 2)), calc(var(--grid-container-max-width-rem) - (var(--grid-offset) * 2)));
    --grid-column-width: calc(var(--grid-width) * 0.08085);
    --grid-gutter-width: calc(var(--grid-width) * 0.02127);
    --content-diag: 1000px;
    --content-height: 500px;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: #0e0e11;
    color: var(--color-black);
    overflow-x: hidden;
  }

  .spacer {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #110c1d;
    color: #fff;
    font-size: 2rem;
    font-weight: 300;
  }

  .s-education-home {
    position: relative;
    height: 200vh;
    background: var(--color-brand-11);
    clip-path: inset(0);
  }

  .s-education-home .s__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }

  .s-education-home .s__content {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    padding: 2rem 0;
    width: calc(4 * var(--grid-column-width) + 3 * var(--grid-gutter-width));
    text-align: center;
  }

  @media only screen and (max-width: 987px) {
    .s-education-home .s__content {
      width: 90%;
      max-width: 22.5rem;
    }
  }

  .s-education-home .s__content .s__background {
    position: absolute;
    top: calc(50% - var(--content-diag) * 2 / 2);
    left: calc(50% - var(--content-diag) * 1.75 / 2);
    z-index: -1;
    width: calc(var(--content-diag) * 1.75);
    height: calc(var(--content-diag) * 2);
    background: radial-gradient(closest-side, rgba(171, 241, 57, 0.9) 25%, rgba(171, 241, 57, 0));
    border-radius: 999rem;
    will-change: transform;
  }

  .s-education-home .s__content:before,
  .s-education-home .s__content:after {
    position: absolute;
    left: 50%;
    z-index: 1;
    width: 1px;
    height: 200vh;
    background: var(--color-black);
    content: "";
  }
  .s-education-home .s__content:before {
    bottom: 100%;
  }
  .s-education-home .s__content:after {
    top: 100%;
  }

  .s-education-home .s__suptitle {
    display: inline-block;
    margin: 0 0 .4em;
    padding: .05em .35em;
    border-radius: 999rem;
    box-shadow: 0 0 0 .09rem currentcolor;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: -0.06em;
    line-height: 1;
    background: var(--color-brand-11);
  }

  .s-education-home .s__title {
    font-size: clamp(3rem, 6vw, 5rem);
    font-weight: 600;
    line-height: 0.95;
    letter-spacing: -0.06em;
    margin: 0;
  }

  .s-education-home .s__text {
    margin: 1.5em auto 0;
    max-width: 24.875em;
    font-size: clamp(1rem, 1.25vw, 1.3333rem);
    font-weight: 500;
    line-height: 1.13;
  }

  .s-education-home .s__text a {
    position: relative;
    font-weight: 700;
    color: var(--color-black);
    text-decoration: underline;
  }

  .s-education-home .s__courses {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }

  .s-education-home .s__courses__list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .s-education-home .sb-course {
    --fz: 1.6667rem;
    --width: 7.1332em;
    --height: 4.6em;
    position: absolute;
    top: calc(var(--radius) * -1);
    left: calc(var(--radius) * -0.5);
    z-index: 2;
    margin: 0;
    padding: .5em .35em;
    width: var(--width);
    height: var(--height);
    background: var(--color-brand-11);
    border: 1px solid var(--color-black);
    overflow: hidden;
    font-size: var(--fz);
    font-weight: 600;
    letter-spacing: -0.04em;
    line-height: .9;
    box-sizing: border-box;
    will-change: transform;
  }

  @media only screen and (max-width: 1536px){
    .s-education-home .sb-course{--fz: 1.3333rem}
  }
  @media only screen and (max-width: 1280px){
    .s-education-home .sb-course{--fz: 1.111rem}
  }

  .s-education-home .sb-course .sb__inner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100%;
    max-height: 3.6em;
    overflow: hidden;
  }

  .s-education-home .sb-course--title {
    --width: 4.2798em;
    --height: 2.76em;
    z-index: 3;
    padding-bottom: .3em;
    background: var(--color-black);
    color: var(--color-brand-11);
    font-size: calc(var(--fz) * 1.6667);
    line-height: .8;
  }

  .s-education-home .sb-course--title .sb__inner {
    justify-content: flex-end;
    overflow: visible;
  }
  ```

- [ ] **Step 2: Commit files**
  ```bash
  git add gravity-sandbox/style.css
  git commit -m "feat(sandbox): create style.css styles for gravity cards layout"
  ```

---

### Task 3: Create JS logic
**Files:**
- Create: [script.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/gravity-sandbox/script.js)

- [ ] **Step 1: Write gravity simulation and Lenis integration script**
  Write JS modules importing GSAP + ScrollTrigger + Lenis and register the `GravitySandbox` class.

  Code for `gravity-sandbox/script.js`:
  ```javascript
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import Lenis from "lenis";

  gsap.registerPlugin(ScrollTrigger);

  const CONFIG = {
    baseGravity: 0.1,         // Base falling speed multiplier
    gravityVarianceMin: 0.1,  // Minimum random vy speed
    gravityVarianceMax: 0.6,  // Maximum random vy speed
    scrollSensitivity: 0.05,  // Sensitivity mapping scrollDiff to card speed multiplier
    rotationVarianceMin: -30, // Spawn rotation min degrees
    rotationVarianceMax: 30,  // Spawn rotation max degrees
    rotationSpeedMin: -0.1,   // Spawn spin speed min
    rotationSpeedMax: 0.1,    // Spawn spin speed max
    zIndexProb: 0.75,         // Probability of card being z-index 1 (rest are z-index 3)
  };

  class GravitySandbox {
    constructor() {
      this.el = document.querySelector(".s-education-home");
      this.content = document.querySelector(".js-content");
      this.courseElements = Array.from(document.querySelectorAll(".js-course"));
      this.courses = [];
      this.scroll = {
        top: window.scrollY,
        prevTop: window.scrollY,
        diff: 0,
        direction: 1
      };
      this.safeWidth = window.innerWidth;
      this.safeHeight = window.innerHeight;
    }

    init() {
      this.initLenis();
      this.setSizes();
      this.setCourses();
      this.initScrollTrigger();
      
      // Bind resize
      window.addEventListener("resize", () => this.onResize());

      // Start tick loop
      this.tickBind = () => this.tick();
      gsap.ticker.add(this.tickBind);
    }

    initLenis() {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });

      this.lenis.on("scroll", (e) => {
        this.scroll.top = e.scroll;
        this.scroll.diff = this.scroll.top - this.scroll.prevTop;
        this.scroll.prevTop = this.scroll.top;
        this.scroll.direction = e.direction;
      });

      // Sync Lenis with GSAP ScrollTrigger
      this.lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        this.lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    onResize() {
      this.safeWidth = window.innerWidth;
      this.safeHeight = window.innerHeight;
      this.setSizes();
      this.setCourses();
    }

    setSizes() {
      if (!this.content) return;
      const rect = this.content.getBoundingClientRect();
      const diag = Math.hypot(rect.width, rect.height);
      this.el.style.setProperty("--content-height", `${rect.height}px`);
      this.el.style.setProperty("--content-diag", `${diag}px`);
    }

    setCourses() {
      if (this.courseElements.length < 2) return;
      const secondCard = this.courseElements[1];
      const rect = secondCard.getBoundingClientRect();
      const radius = Math.hypot(rect.width, rect.height) / 2;

      this.courses = [];
      this.courseElements.forEach((el, index) => {
        if (el.offsetWidth === 0) return;
        el.style.setProperty("--radius", `${radius}px`);

        const course = {
          el: el,
          i: index,
          x: 0,
          y: null, // trigger random screen placement in initCourse
          radius: radius,
          rotation: 0,
          vr: 0,
          vy: 0.1,
          nvy: 0.1,
          svy: 0.1
        };
        
        this.courses.push(this.initCourse(course));
      });
    }

    initCourse(course) {
      const isSpawn = course.y === null;
      
      if (isSpawn) {
        // Spawn randomly vertically on load
        course.y = Math.random() * this.safeHeight;
      } else {
        // Respawn: if moving up, spawn at bottom; if moving down, spawn at top
        course.y = course.nvy < 0 ? this.safeHeight + 2 * course.radius : -2 * course.radius;
      }

      course.x = this.safeWidth * Math.random();
      course.rotation = Math.random() * (CONFIG.rotationVarianceMax - CONFIG.rotationVarianceMin) + CONFIG.rotationVarianceMin;
      course.vr = Math.random() * (CONFIG.rotationSpeedMax - CONFIG.rotationSpeedMin) + CONFIG.rotationSpeedMin;
      course.vy = CONFIG.baseGravity + Math.random() * (CONFIG.gravityVarianceMax - CONFIG.gravityVarianceMin);
      course.nvy = course.vy;
      course.svy = course.vy;

      // Reset z-indices randomly unless it's the title card
      if (!course.el.classList.contains("sb-course--title")) {
        course.el.style.zIndex = Math.random() < CONFIG.zIndexProb ? "1" : "3";
      }

      return course;
    }

    initScrollTrigger() {
      this.tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.el,
          start: "top 100%",
          end: "bottom 0%",
          scrub: 0.75
        }
      });

      this.tl.fromTo(
        this.content,
        { y: "100%" },
        { y: "-100%", ease: "none", duration: 1 },
        0
      );
    }

    tick() {
      // Decay scrollDiff and calculate scroll velocity multiplier t
      let t = -CONFIG.scrollSensitivity * this.scroll.diff;
      // Keep a minimum speed of 1/-1 even when not scrolling
      t = t > 0 ? Math.max(t, 1) : Math.min(t, -1);

      // Apply physics updates to all cards
      this.courses.forEach((course) => {
        course.nvy = course.vy * t * 5;
        course.svy += 0.5 * (course.nvy - course.svy);
        course.y += course.svy;
        course.rotation += course.vr * t * 2;

        course.el.style.transform = `translate3d(${course.x}px, ${course.y}px, 0) rotate(${course.rotation}deg)`;

        // Check boundary conditions and respawn
        const offscreenUp = course.nvy < 0 && course.y < -2.1 * course.radius;
        const offscreenDown = course.nvy > 0 && course.y > this.safeHeight + 2.1 * course.radius;

        if (offscreenUp || offscreenDown) {
          this.initCourse(course);
        }
      });

      // Slowly decay scroll.diff towards 0 when scroll is inactive
      this.scroll.diff *= 0.9;
      if (Math.abs(this.scroll.diff) < 0.1) {
        this.scroll.diff = 0;
      }
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const sandbox = new GravitySandbox();
    sandbox.init();
  });
  ```

- [ ] **Step 2: Commit files**
  ```bash
  git add gravity-sandbox/script.js
  git commit -m "feat(sandbox): create script.js animation loop for gravity cards"
  ```
