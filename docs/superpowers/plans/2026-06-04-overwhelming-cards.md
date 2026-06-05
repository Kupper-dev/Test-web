# Phase 2: Overwhelming Cards and Emoji Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static center placeholder on the Message Overwhelming page with a scroll-linked problem card sequence featuring custom-animated giant emojis.

**Architecture:** A sticky container pins the card stack while GSAP's ScrollTrigger scrubs transitions between the three cards based on scroll coordinates. Titles reveal using a bottom-left transform origin mask, paragraphs reveal with word-level staggers via SplitType, and emojis pop in with unique animation curves.

**Tech Stack:** HTML5, CSS3, Javascript, GSAP (with ScrollTrigger), SplitType

---

### Task 1: HTML Layout Update

**Files:**
- Modify: `overwhelming.html`

- [ ] **Step 1: Replace static placeholder content**
  Open [overwhelming.html](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/overwhelming.html) and replace the placeholder block inside `<div class="overwhelming-center-content">` (lines 123-129) with the following markup:
  ```html
  <div class="overwhelming-cards-container">
    <!-- Card 1 -->
    <div class="overwhelming-card active" data-card="1">
      <div class="messy-element top-left">💻</div>
      <div class="messy-element top-right">🛑</div>
      <div class="messy-element bottom-left">⏳</div>
      <div class="messy-element bottom-right">🚫</div>
      <div class="item-title">
        <div>¿Un equipo falla y todo se detiene?</div>
      </div>
      <div class="item-desc">
        <p>No importa qué tan ocupado esté el día — una computadora que no prende lo frena todo. Mientras no hay quien lo resuelva, esa persona no trabaja y tú no puedes hacer nada al respecto.</p>
      </div>
    </div>

    <!-- Card 2 -->
    <div class="overwhelming-card" data-card="2">
      <div class="messy-element top-left">🤷</div>
      <div class="messy-element top-right">❓</div>
      <div class="messy-element bottom-left">🔧</div>
      <div class="messy-element bottom-right">🔄</div>
      <div class="item-title">
        <div>¿No sabes si ya quedó la laptop?</div>
      </div>
      <div class="item-desc">
        <p>El técnico pasó, dijo que ya estaba listo, y al día siguiente volvió a fallar. Sin un seguimiento claro, nunca sabes si el problema realmente se resolvió o solo se pospuso.</p>
      </div>
    </div>

    <!-- Card 3 -->
    <div class="overwhelming-card" data-card="3">
      <div class="messy-element top-left">📅</div>
      <div class="messy-element top-right">⚠️</div>
      <div class="messy-element bottom-left">⏰</div>
      <div class="messy-element bottom-right">💣</div>
      <div class="item-title">
        <div>¿Sabes cuándo tocan los mantenimientos?</div>
      </div>
      <div class="item-desc">
        <p>La mayoría de los problemas técnicos no llegan de sorpresa — se acumulan. Equipos sin mantenimiento, sin historial, sin fechas claras. Cuando algo truena, ya era tarde para prevenirlo.</p>
      </div>
    </div>
  </div>
  ```

- [ ] **Step 2: Commit HTML layout**
  ```bash
  git add overwhelming.html
  git commit -m "feat: implement Phase 2 problem cards DOM structure"
  ```

---

### Task 2: Card Layout & Emojis Styling

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Append styles for cards and messy elements**
  Open [src/style.css](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/style.css) and append the styling definitions at the end of the file:
  ```css
  /* ───────────────────────────────────────────────
     Phase 2: Overwhelming Central Cards & Emojis
     ─────────────────────────────────────────────── */
  .overwhelming-cards-container {
    position: relative;
    width: 50vw;
    height: 50vh;
    min-width: 450px;
    min-height: 400px;
    max-width: 650px;
    max-height: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .overwhelming-cards-container {
      width: 85vw;
      height: 60vh;
      min-width: 320px;
      min-height: 480px;
    }
  }

  .overwhelming-card {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 32px;
    padding: 3.5em 3em;
    border: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: scale(0.9);
  }

  .overwhelming-card.active {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: scale(1);
    z-index: 10;
  }

  .item-title {
    overflow: hidden;
    position: relative;
    width: 100%;
    margin-bottom: 1.25em;
    border-left: 3px solid #2051ff;
    padding-left: 12px;
  }

  .item-title > div {
    font-size: 2.25rem;
    font-weight: 700;
    line-height: 1.25;
    color: var(--color-neutral-900, #111111);
    transform-origin: 0% 100%;
    display: inline-block;
  }

  @media (max-width: 768px) {
    .item-title > div {
      font-size: 1.75rem;
    }
  }

  .item-desc {
    width: 100%;
  }

  .item-desc p {
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--color-neutral-600, #555555);
    margin: 0;
  }

  @media (max-width: 768px) {
    .item-desc p {
      font-size: 0.95rem;
    }
  }

  .messy-element {
    position: absolute;
    font-size: 5rem;
    line-height: 1;
    user-select: none;
    pointer-events: none;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.12));
    z-index: 15;
  }

  .messy-element.top-left {
    top: -45px;
    left: -45px;
  }

  .messy-element.top-right {
    top: -55px;
    right: -45px;
  }

  .messy-element.bottom-left {
    bottom: -55px;
    left: -55px;
  }

  .messy-element.bottom-right {
    bottom: -35px;
    right: -35px;
  }
  ```

- [ ] **Step 2: Commit stylesheet changes**
  ```bash
  git add src/style.css
  git commit -m "style: add styles for centered cards and giant surrounding emojis"
  ```

---

### Task 3: Scroll-Linked Transition Animations

**Files:**
- Modify: `src/animations/overwhelmingAnimations.js`

- [ ] **Step 1: Implement card transitions and emoji curves in javascript**
  Open [src/animations/overwhelmingAnimations.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/overwhelmingAnimations.js). Add imports for `ScrollTrigger` and `SplitType` at the top, then construct card initialization, scroll-trigger binding, and cleanups.
  Replace lines 1-3 with:
  ```javascript
  import { Engine, World, Bodies, Composite, Body } from 'matter-js';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import SplitType from 'split-type';

  gsap.registerPlugin(ScrollTrigger);
  ```
  And add tracking variables at the top (around line 14):
  ```javascript
  let cardSplitParagraphs = [];
  let scrollTriggerInstance = null;
  ```

  Then implement inside `initOverwhelmingAnimations()` (after line 374, before ending the function):
  ```javascript
  // --- Phase 2 Card Scroll-Linked Transitions ---
  const cards = document.querySelectorAll('.overwhelming-card');
  const cardElements = Array.from(cards);
  
  if (cardElements.length > 0) {
    // 1. Initial State Setup
    cardElements.forEach((card, idx) => {
      const title = card.querySelector('.item-title > div');
      const desc = card.querySelector('.item-desc p');
      const emojis = card.querySelectorAll('.messy-element');

      // Setup paragraph splitting
      if (desc) {
        const descSplit = new SplitType(desc, {
          types: 'lines, words',
          lineClass: 'card-desc-line',
          wordClass: 'card-desc-word'
        });
        
        descSplit.lines.forEach((line) => {
          line.style.overflow = 'hidden';
          line.style.display = 'block';
          line.style.position = 'relative';
          
          line.querySelectorAll('.card-desc-word').forEach((word) => {
            word.style.display = 'inline-block';
            word.style.position = 'relative';
          });
        });
        cardSplitParagraphs.push(descSplit);
      }

      // Hide cards 2 & 3 initially
      if (idx > 0) {
        gsap.set(card, { opacity: 0, scale: 0.9, autoAlpha: 0 });
        if (title) {
          gsap.set(title, { yPercent: 105, rotate: 15, transformOrigin: '0% 100%' });
        }
        if (desc) {
          const words = desc.querySelectorAll('.card-desc-word');
          gsap.set(words, { yPercent: 110 });
        }
        if (emojis.length > 0) {
          gsap.set(emojis, { scale: 0, opacity: 0 });
        }
      } else {
        // Card 1 starts active and revealed
        gsap.set(card, { opacity: 1, scale: 1, autoAlpha: 1 });
        if (title) {
          gsap.set(title, { yPercent: 0, rotate: 0, transformOrigin: '0% 100%' });
        }
        if (desc) {
          const words = desc.querySelectorAll('.card-desc-word');
          gsap.set(words, { yPercent: 0 });
        }
        // Animate Card 1 emojis drop and bounce on load
        if (emojis.length > 0) {
          gsap.set(emojis, { scale: 0, opacity: 0 });
          gsap.to(emojis, {
            scale: 1,
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 1.0,
            ease: 'back.out(1.8)',
            stagger: 0.1,
            delay: 0.2
          });
        }
      }
    });

    // 2. Build ScrollTrigger scrubbing timeline
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: '.overwhelming-track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Helper function to show/hide a card
        const setCardState = (activeIdx) => {
          cardElements.forEach((card, i) => {
            if (i === activeIdx) {
              card.classList.add('active');
            } else {
              card.classList.remove('active');
            }
          });
        };

        // Scroll Range 1: Card 1 Active (progress: 0.0 -> 0.25)
        if (progress <= 0.25) {
          setCardState(0);
          
          const card1 = cardElements[0];
          const card1Emojis = card1.querySelectorAll('.messy-element');
          const card1Title = card1.querySelector('.item-title > div');
          const card1Words = card1.querySelectorAll('.card-desc-word');

          gsap.to(card1, { opacity: 1, scale: 1, autoAlpha: 1, duration: 0.2 });
          if (card1Title) gsap.to(card1Title, { yPercent: 0, rotate: 0, duration: 0.2 });
          if (card1Words.length > 0) gsap.to(card1Words, { yPercent: 0, duration: 0.2 });
          if (card1Emojis.length > 0) gsap.to(card1Emojis, { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.2 });

          // Keep other cards completely hidden
          cardElements.slice(1).forEach((card) => {
            gsap.to(card, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          });
        }
        
        // Scroll Range 2: Card 1 -> Card 2 Transition (progress: 0.25 -> 0.35 -> 0.45)
        else if (progress > 0.25 && progress <= 0.45) {
          const ratio = (progress - 0.25) / 0.2; // normalized 0 to 1
          
          const card1 = cardElements[0];
          const card2 = cardElements[1];
          const card1Title = card1.querySelector('.item-title > div');
          const card1Words = card1.querySelectorAll('.card-desc-word');
          const card1Emojis = card1.querySelectorAll('.messy-element');
          
          const card2Title = card2.querySelector('.item-title > div');
          const card2Words = card2.querySelectorAll('.card-desc-word');
          const card2Emojis = card2.querySelectorAll('.messy-element');

          if (ratio < 0.5) {
            // Card 1 Exiting
            setCardState(0);
            const subRatio = ratio * 2; // 0 to 1
            gsap.to(card1, { opacity: 1 - subRatio, scale: 1 - subRatio * 0.1, autoAlpha: subRatio > 0.9 ? 0 : 1, duration: 0.1 });
            
            if (card1Title) gsap.to(card1Title, { yPercent: subRatio * 105, rotate: subRatio * 15, duration: 0.1 });
            if (card1Words.length > 0) gsap.to(card1Words, { yPercent: subRatio * 110, duration: 0.1 });
            
            // Card 1 emojis slide away in different directions
            if (card1Emojis.length === 4) {
              gsap.to(card1Emojis[0], { x: -subRatio * 100, y: -subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 }); // Top-Left goes further top-left
              gsap.to(card1Emojis[1], { x: subRatio * 100, y: -subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 });  // Top-Right goes top-right
              gsap.to(card1Emojis[2], { x: -subRatio * 100, y: subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 });  // Bottom-Left goes bottom-left
              gsap.to(card1Emojis[3], { x: subRatio * 100, y: subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 });    // Bottom-Right goes bottom-right
            }

            // Ensure card 2 is hidden
            gsap.to(card2, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          } else {
            // Card 2 Entering
            setCardState(1);
            const subRatio = (ratio - 0.5) * 2; // 0 to 1
            gsap.to(card2, { opacity: subRatio, scale: 0.9 + subRatio * 0.1, autoAlpha: 1, duration: 0.1 });
            
            if (card2Title) gsap.to(card2Title, { yPercent: (1 - subRatio) * 105, rotate: (1 - subRatio) * 15, duration: 0.1 });
            if (card2Words.length > 0) gsap.to(card2Words, { yPercent: (1 - subRatio) * 110, duration: 0.1 });
            
            // Card 2 emojis spin in
            if (card2Emojis.length > 0) {
              gsap.to(card2Emojis, {
                scale: subRatio,
                opacity: subRatio,
                rotation: (1 - subRatio) * 360,
                duration: 0.1
              });
            }

            // Ensure card 1 is fully hidden
            gsap.to(card1, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          }
        }

        // Scroll Range 3: Card 2 Active (progress: 0.45 -> 0.65)
        else if (progress > 0.45 && progress <= 0.65) {
          setCardState(1);
          const card2 = cardElements[1];
          const card2Emojis = card2.querySelectorAll('.messy-element');
          const card2Title = card2.querySelector('.item-title > div');
          const card2Words = card2.querySelectorAll('.card-desc-word');

          gsap.to(card2, { opacity: 1, scale: 1, autoAlpha: 1, duration: 0.2 });
          if (card2Title) gsap.to(card2Title, { yPercent: 0, rotate: 0, duration: 0.2 });
          if (card2Words.length > 0) gsap.to(card2Words, { yPercent: 0, duration: 0.2 });
          if (card2Emojis.length > 0) gsap.to(card2Emojis, { scale: 1, opacity: 1, rotation: 0, duration: 0.2 });

          // Keep card 1 & 3 hidden
          gsap.to(cardElements[0], { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          gsap.to(cardElements[2], { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
        }

        // Scroll Range 4: Card 2 -> Card 3 Transition (progress: 0.65 -> 0.75 -> 0.85)
        else if (progress > 0.65 && progress <= 0.85) {
          const ratio = (progress - 0.65) / 0.2; // normalized 0 to 1
          
          const card2 = cardElements[1];
          const card3 = cardElements[2];
          const card2Title = card2.querySelector('.item-title > div');
          const card2Words = card2.querySelectorAll('.card-desc-word');
          const card2Emojis = card2.querySelectorAll('.messy-element');
          
          const card3Title = card3.querySelector('.item-title > div');
          const card3Words = card3.querySelectorAll('.card-desc-word');
          const card3Emojis = card3.querySelectorAll('.messy-element');

          if (ratio < 0.5) {
            // Card 2 Exiting
            setCardState(1);
            const subRatio = ratio * 2; // 0 to 1
            gsap.to(card2, { opacity: 1 - subRatio, scale: 1 - subRatio * 0.1, autoAlpha: subRatio > 0.9 ? 0 : 1, duration: 0.1 });
            
            if (card2Title) gsap.to(card2Title, { yPercent: subRatio * 105, rotate: subRatio * 15, duration: 0.1 });
            if (card2Words.length > 0) gsap.to(card2Words, { yPercent: subRatio * 110, duration: 0.1 });
            
            // Card 2 emojis drop down vertically
            if (card2Emojis.length > 0) {
              gsap.to(card2Emojis, {
                y: subRatio * 200,
                opacity: 1 - subRatio,
                duration: 0.1
              });
            }

            // Ensure card 3 is hidden
            gsap.to(card3, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          } else {
            // Card 3 Entering
            setCardState(2);
            const subRatio = (ratio - 0.5) * 2; // 0 to 1
            gsap.to(card3, { opacity: subRatio, scale: 0.9 + subRatio * 0.1, autoAlpha: 1, duration: 0.1 });
            
            if (card3Title) gsap.to(card3Title, { yPercent: (1 - subRatio) * 105, rotate: (1 - subRatio) * 15, duration: 0.1 });
            if (card3Words.length > 0) gsap.to(card3Words, { yPercent: (1 - subRatio) * 110, duration: 0.1 });
            
            // Card 3 emojis pop in from 0 with elastic look (high amplitude scaling)
            if (card3Emojis.length > 0) {
              gsap.to(card3Emojis, {
                scale: subRatio,
                opacity: subRatio,
                x: 0,
                y: 0,
                duration: 0.1
              });
            }

            // Ensure card 2 is fully hidden
            gsap.to(card2, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          }
        }

        // Scroll Range 5: Card 3 Active (progress: 0.85 -> 1.0)
        else if (progress > 0.85) {
          setCardState(2);
          const card3 = cardElements[2];
          const card3Emojis = card3.querySelectorAll('.messy-element');
          const card3Title = card3.querySelector('.item-title > div');
          const card3Words = card3.querySelectorAll('.card-desc-word');

          gsap.to(card3, { opacity: 1, scale: 1, autoAlpha: 1, duration: 0.2 });
          if (card3Title) gsap.to(card3Title, { yPercent: 0, rotate: 0, duration: 0.2 });
          if (card3Words.length > 0) gsap.to(card3Words, { yPercent: 0, duration: 0.2 });
          if (card3Emojis.length > 0) gsap.to(card3Emojis, { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.2 });

          // Keep other cards hidden
          cardElements.slice(0, 2).forEach((card) => {
            gsap.to(card, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          });
        }
      }
    });
  }
  ```

- [ ] **Step 2: Add memory leak cleanup rules**
  Open [src/animations/overwhelmingAnimations.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/overwhelmingAnimations.js) and add revert rules for SplitType and ScrollTrigger inside the `killOverwhelmingAnimations()` function (around line 378).
  Insert the following lines inside the `killOverwhelmingAnimations()` body:
  ```javascript
  // Destroy ScrollTrigger instance
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }

  // Revert SplitType line/word wraps
  cardSplitParagraphs.forEach((split) => {
    if (split) {
      split.revert();
    }
  });
  cardSplitParagraphs = [];
  ```

- [ ] **Step 3: Commit javascript scroll animations**
  ```bash
  git add src/animations/overwhelmingAnimations.js
  git commit -m "feat: implement GSAP scroll-linked card transitions and emoji curves"
  ```

---

### Task 4: Compilation and Build Verification

- [ ] **Step 1: Run local production build check**
  Run: `npm run build`
  Expected: Successful compilation without TypeScript or bundling exceptions.

- [ ] **Step 2: Verify scroll experience in browser**
  Ensure Vite dev server is running, load `/overwhelming.html` and verify:
  1. Card 1 emojis drop/bounce on page load.
  2. Scroll down triggers smooth card exits and entrances with rotation mask reveals.
  3. Emojis animate away (Card 1 flies out, Card 2 falls down, Card 3 scale popped).
