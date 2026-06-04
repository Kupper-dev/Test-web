# Tickets Sandbox Color Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transition the Tickets Sandbox page to use Webflow DevLink theme variables, applying a light background theme with blue and dark gray accents, replacing the legacy lime green styling.

**Architecture:** Use CSS custom properties mapped to the imported `/src/devlink/css/global.css` variables, maintaining code boundaries and ensuring text legibility on the light background theme.

**Tech Stack:** HTML5, Vanilla CSS, Vite (Vite multi-page server for local testing).

---

### Task 1: Link Webflow DevLink Stylesheet
Import the Webflow global stylesheet into the Tickets Sandbox page to access DevLink CSS custom variables.

**Files:**
- Modify: `tickets-sandbox/index.html:1-9`

- [ ] **Step 1: Link global.css in index.html**
  Insert `<link rel="stylesheet" href="../src/devlink/css/global.css">` right before the local `style.css` stylesheet in `tickets-sandbox/index.html`.
  ```html
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT Tickets Gravity Sandbox</title>
    <link rel="stylesheet" href="../src/devlink/css/global.css">
    <link rel="stylesheet" href="./style.css">
  </head>
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add tickets-sandbox/index.html
  git commit -m "feat(sandbox): import devlink global.css in sandbox page"
  ```

---

### Task 2: Configure Custom Variables and Body Styling
Define local variable mappings linked to Webflow custom properties and update body background.

**Files:**
- Modify: `tickets-sandbox/style.css:1-24`

- [ ] **Step 1: Map variables in :root and style body**
  Replace `:root` color definitions with mappings to Webflow variables and update `body` styles:
  ```css
  :root {
    --color-bg: var(--_dev---background, #fafbfc);
    --color-black: var(--_dev---black, #252731);
    --color-blue-2: var(--_dev---blue-2, hsla(214, 100%, 50.2%, 1));
    --color-blue-3: var(--_dev---blue-3, #65c2ff);
    --color-white: var(--_dev---white, #ffffff);
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
    background-color: var(--color-bg);
    color: var(--color-black);
    overflow-x: hidden;
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add tickets-sandbox/style.css
  git commit -m "style(sandbox): map root colors to devlink variables and style body bg"
  ```

---

### Task 3: Refine Section and Content Styling
Update section spacer backgrounds, tickets background container, and badges to match the light theme with blue accenting.

**Files:**
- Modify: `tickets-sandbox/style.css:25-136`

- [ ] **Step 1: Update spacers, tickets home section background, content lines, and badges**
  Replace spacers, tickets section, content decorations, and the support badge style:
  ```css
  .spacer {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    color: var(--color-black);
    font-size: 2rem;
    font-weight: 300;
  }

  .s-tickets-home {
    position: relative;
    height: 200vh;
    background: var(--color-bg);
    clip-path: inset(0);
  }
  ```
  And update the content background gradient and lines/badges:
  ```css
  .s-tickets-home .s__content .s__background {
    position: absolute;
    top: calc(50% - var(--content-diag) * 2 / 2);
    left: calc(50% - var(--content-diag) * 1.75 / 2);
    z-index: -1;
    width: calc(var(--content-diag) * 1.75);
    height: calc(var(--content-diag) * 2);
    background: radial-gradient(closest-side, rgba(32, 81, 255, 0.12) 25%, rgba(32, 81, 255, 0));
    border-radius: 999rem;
    will-change: transform;
  }

  .s-tickets-home .s__content:before,
  .s-tickets-home .s__content:after {
    position: absolute;
    left: 50%;
    z-index: 1;
    width: 1px;
    height: 200vh;
    background: var(--color-black);
    content: "";
  }
  .s-tickets-home .s__content:before {
    bottom: 100%;
  }
  .s-tickets-home .s__content:after {
    top: 100%;
  }

  .s-tickets-home .s__suptitle {
    display: inline-block;
    margin: 0 0 .4em;
    padding: .05em .35em;
    border-radius: 999rem;
    box-shadow: 0 0 0 .09rem currentcolor;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: -0.06em;
    line-height: 1;
    background: var(--color-blue-2);
    color: var(--color-white);
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add tickets-sandbox/style.css
  git commit -m "style(sandbox): style spacers, home section background, lines, suptitle badge"
  ```

---

### Task 4: Polish Ticket and Message Speech Bubble Cards
Update card color schemes and SVG fill properties to match blue accents and dark black bubbles.

**Files:**
- Modify: `tickets-sandbox/style.css:184-220`

- [ ] **Step 1: Set ticket and message card text and shape colors**
  Modify card dimension text colors:
  ```css
  /* Dimensions for Ticket vs Message shapes */
  .s-tickets-home .sb-ticket--ticket {
    --width: 8.5em;
    --height: 5.5em;
    width: var(--width);
    height: var(--height);
    color: var(--color-white) !important;
  }

  .s-tickets-home .sb-ticket--message {
    --width: 8.0em;
    --height: 7.2em;
    width: var(--width);
    height: var(--height);
    color: var(--color-blue-3) !important;
  }
  ```
  And modify background SVG shape colors and drop shadows:
  ```css
  /* Background SVGs shape styling */
  .s-tickets-home .sb-ticket__shape {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
  }

  .s-tickets-home .sb-ticket--ticket .sb-ticket__shape {
    color: var(--color-blue-2);
    filter: drop-shadow(0 4px 8px rgba(32, 81, 255, 0.15));
  }

  .s-tickets-home .sb-ticket--message .sb-ticket__shape {
    color: var(--color-black);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.15));
  }
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add tickets-sandbox/style.css
  git commit -m "style(sandbox): polish ticket and message shape color and text contrast"
  ```

---

### Task 5: Verify Implementation
Check implementation rendering and interactivity under the Vite development server.

**Files:**
- Verify: `tickets-sandbox/index.html`

- [ ] **Step 1: Open sandbox page in Chrome**
  Direct the browser tool or manual verification to `http://localhost:5173/tickets-sandbox/index.html` (the local port might differ; check running dev server).
  Verify:
  - Spacers and body background are light `#fafbfc`.
  - Spacers text is dark gray/black.
  - Active tickets section background is light `#fafbfc`.
  - "Support Center" badge background is deep blue, text is white.
  - Glowing background gradient is subtle blue.
  - Floating ticket speech bubbles:
    - Tickets (e.g. "Reset Password") have deep blue background and white text.
    - Messages (e.g. "VPN Connection Failure") have black background and light blue text.
  - Scroll interactivity: make sure Lenis scroll is smooth and cards float up/down correctly according to queue velocity configuration.

- [ ] **Step 2: Commit**
  ```bash
  git commit --allow-empty -m "test(sandbox): verify rendering and color accessibility"
  ```
