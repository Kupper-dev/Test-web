# Menu Branches Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the navigation menu to accommodate 3 business branches with a top-level switcher and directionally staggered GSAP animations.

**Architecture:** We use an Absolute Stack for the 3 branches inside the navigation container to seamlessly orchestrate macro sliding and micro staggering without seeing intermediate branches.

**Tech Stack:** HTML/CSS, GSAP, JS (Vite).

---

### Task 1: CSS Updates for Absolute Stack and Buttons

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Add CSS rules**
Append the new CSS logic for the buttons and absolute stacking to `src/style.css`.
```css
/* Branch Buttons */
.nav-branch-buttons {
  display: flex;
  gap: 12px;
  padding: 16px 24px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.nav-branch-btn {
  background: transparent;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;
  color: #666;
}

.nav-branch-btn.is--active {
  background: #000;
  color: #fff;
}

/* Branch Container Stacking */
.nav-branch-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: hidden;
}

.nav-branch-wrapper.is--active {
  position: relative;
  visibility: visible;
  z-index: 2;
}

/* Ensure overflow container is relative */
.nav-bar__bottom-overflow {
  position: relative;
  overflow: hidden;
}
```

### Task 2: HTML Structure Update

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Insert Branch Buttons and Wrap Branch 1**
In `index.html`, locate `<div class="nav-bar__bottom">`. Directly inside it, insert the `.nav-branch-buttons` container. Then locate `<div class="nav-bar__bottom-inner" data-lenis-prevent="">` and wrap it with `<div class="nav-branch-wrapper is--active" data-branch="0">`.

```html
<div class="nav-bar__bottom">
  <div class="nav-branch-buttons">
    <button class="nav-branch-btn is--active" data-branch-btn="0">Inicio</button>
    <button class="nav-branch-btn" data-branch-btn="1">Branch 2</button>
    <button class="nav-branch-btn" data-branch-btn="2">Branch 3</button>
  </div>
  <div class="nav-bar__bottom-overflow">
    <div class="nav-branch-wrapper is--active" data-branch="0">
      <div class="nav-bar__bottom-inner" data-lenis-prevent="">
```

- [ ] **Step 2: Add List Item Classes**
Inside the `nav-bar__bottom-inner` content, find every `<li class="nav-bar__big-li">` and add the `nav-bar-link-list-item` class to it.
Example modification:
```html
<li class="nav-bar__big-li nav-bar-link-list-item">
```

- [ ] **Step 3: Duplicate for Branch 2 and Branch 3**
Copy the entire `<div class="nav-branch-wrapper is--active" data-branch="0">...</div>` block. Paste it twice directly below it, changing the attributes to `data-branch="1"` and `data-branch="2"`, and removing the `is--active` class from both copies. Ensure you copy the closing `</div>` tags correctly.

### Task 3: Branch Animation Logic

**Files:**
- Create: `src/animations/branchAnimations.js`
- Modify: `src/animations/index.js`

- [ ] **Step 1: Write GSAP logic**
Create `src/animations/branchAnimations.js` with the exact macro and micro stagger logic.

```javascript
import { gsap } from 'gsap';

let currentBranch = 0;
let isAnimating = false;

export function initBranchAnimations() {
  const buttons = document.querySelectorAll('[data-branch-btn]');
  const branches = document.querySelectorAll('[data-branch]');
  if (!buttons.length || !branches.length) return;

  // Initialize hidden branches
  branches.forEach((branch, index) => {
    if (index !== currentBranch) {
      gsap.set(branch, { autoAlpha: 0, xPercent: 100 });
    } else {
      gsap.set(branch, { autoAlpha: 1, xPercent: 0 });
    }
  });

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => switchBranch(index, buttons, branches));
  });
}

function switchBranch(newIndex, buttons, branches) {
  if (newIndex === currentBranch || isAnimating) return;
  isAnimating = true;

  const isForward = newIndex > currentBranch;
  const outgoing = branches[currentBranch];
  const incoming = branches[newIndex];

  // Update Buttons
  buttons.forEach((btn, idx) => {
    btn.classList.toggle('is--active', idx === newIndex);
  });

  // Outgoing animation
  gsap.to(outgoing, {
    xPercent: isForward ? -100 : 100,
    autoAlpha: 0,
    duration: 0.6,
    ease: "power3.inOut",
    onComplete: () => {
      outgoing.classList.remove('is--active');
    }
  });

  // Prepare Incoming
  incoming.classList.add('is--active');
  gsap.set(incoming, {
    xPercent: isForward ? 100 : -100,
    autoAlpha: 0
  });

  // Prepare Stagger Elements
  const columns = Array.from(incoming.querySelectorAll('.nav-bar__bottom-col'));
  if (!isForward) columns.reverse(); // If going backwards, reverse column order so Ad is first

  const listItems = incoming.querySelectorAll('.nav-bar-link-list-item');
  gsap.set(columns, { x: isForward ? 30 : -30, opacity: 0 });
  gsap.set(listItems, { x: isForward ? 20 : -20, opacity: 0 });

  const tl = gsap.timeline({
    onComplete: () => {
      currentBranch = newIndex;
      isAnimating = false;
    }
  });

  // Macro slide
  tl.to(incoming, {
    xPercent: 0,
    autoAlpha: 1,
    duration: 0.6,
    ease: "power3.inOut"
  }, 0);

  // Micro Stagger columns
  tl.to(columns, {
    x: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out"
  }, 0.2);

  // Micro Stagger list items
  tl.to(listItems, {
    x: 0,
    opacity: 1,
    duration: 0.4,
    stagger: 0.05,
    ease: "power2.out"
  }, 0.3);
}

export function killBranchAnimations() {
  const buttons = document.querySelectorAll('[data-branch-btn]');
  // Clean up event listeners if necessary for SPA transitions
}
```

- [ ] **Step 2: Register in index.js**
Modify `src/animations/index.js` to import and call `initBranchAnimations`.

```javascript
import { initWhatsappGlow, killWhatsappGlow } from './whatsappGlow';
import { initCardAnimations, killCardAnimations } from './cardAnimations';
import { initBranchAnimations, killBranchAnimations } from './branchAnimations';

// Central registry to start all animations
export function initAnimations() {
  initWhatsappGlow();
  initCardAnimations();
  initBranchAnimations();
  // Add future animation inits here (e.g. initSpanGradient())
}

// Central registry to clean up all animations on page leave
export function killAnimations() {
  killWhatsappGlow();
  killCardAnimations();
  killBranchAnimations();
  // Add future animation kills here (e.g. killSpanGradient())
}
```
