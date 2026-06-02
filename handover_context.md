# Replicating the Osmo Supply Reactive Navbar System — Handover Context

This document serves as a complete context summary and handover guide for replicating the high-fidelity, scroll-reactive capsule navigation bar, 3-column dropdown mega-menu, infinite marquee, and page transitions from [osmo.supply](https://www.osmo.supply/).

---

## 1. Project Goal & Success Criteria

The core objective is to reconstruct the interactive navbar experience of the live Osmo Supply site in a local Vite sandbox, verify its performance and transitions, and then port it to Webflow.

### Success Criteria:
*   **Scroll-Reactive Inset Capsule**: Navbar spans full screen at the top of the page (`inset: 0em`), then shrinks/insets to a floating rounded capsule on scroll > 50px (`inset: 0.1875em` on desktop, `0.5em` on mobile).
*   **Logo Translation**: Wordmark logo collapses and slides down out of view, while the symbol logo slides down and reveals itself in the center on scroll.
*   **CSS Grid Dropdown Height Transition**: Dropdown menu expands smoothly from height 0 to full contents using the CSS Grid template rows interpolation (`grid-template-rows: 0fr -> 1fr`).
*   **3-Column Dropdown Content**:
    *   **Column 1 (Products)**: Secondary links and list items with tag badges ("NEW").
    *   **Column 2 (Explore)**: Navigation links, item count badge (e.g. `180`), and a row of circular social icons.
    *   **Column 3 (Promo)**: Promotional banner card featuring a video preview that loads and plays/pauses on hover, a lock icon, and a rotating Ferris-wheel action button.
*   **Infinite Sliding Marquee**: Smooth, linear marquee bar directly below the navbar translating indefinitely, pausing when scroll reactions trigger.
*   **Barba.js + GSAP Transitions**: Single-page application feel with page wipe transitions that coordinate container scaling, backdrop fades, and theme swaps.

---

## 2. Environment Context & Constraints

*   **Vite Sandbox Structure**: A basic Vite structure containing:
    *   `index.html` (Home Page layout)
    *   `about.html` (Secondary Page for testing transitions)
    *   `src/sandbox.css` (Target stylesheet for the navbar system)
    *   `src/sandbox.js` (Target scripts container)
*   **Webflow Destination ID**: `695c194c86d5e76167047ce4`
*   **Blacklist File**: A JSON configuration listing components and IDs that must not be altered during the replication process.

---

## 3. Core Technologies & Dependencies

*   **HTML5 & CSS3 Variables**: Core layout, structural grid, flex columns, and transitions.
*   **GSAP (GreenSock Animation Platform)**: Handles page entry/exit transforms and dynamic timeline animations.
*   **Barba.js**: PJAX router managing seamless page content replacement.
*   **Lenis**: Hardware-accelerated smooth scrolling.
*   **Vite**: Fast local bundling and hot reloading.

---

## 4. Key Technical Discoveries & CSS Specifications

### A. Fluid Clamp Scaling System
Osmo achieves seamless responsiveness across all screen sizes by scaling the base font size of the `body` tag relative to the viewport width. Spacing, padding, margins, and sizes of nested elements are defined in `em` units, inheriting from this scaled base:
```css
:root {
  --size-unit: 16;
  --size-container-ideal: 1440;
  --size-container-min: 992px;
  --size-container-max: 1920px;
  --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
  --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
}

body {
  font-size: var(--size-font);
}
```

### B. Scroll State Attributes (JS to CSS)
Instead of animating values inside scroll loops, a lightweight scroll listener updates metadata attributes on the parent `.nav-root` container. The visual states are defined statically in CSS:
```javascript
// Example properties updated on scroll:
navRoot.setAttribute('data-scrolling-started', window.scrollY > 50 ? 'true' : 'false');
navRoot.setAttribute('data-scrolling-direction', currentScrollY > lastScrollY ? 'down' : 'up');
```
CSS selectors target these states:
```css
/* Capsule Shrinking Inset */
.nav-capsule {
  position: absolute;
  inset: 0em;
  transition: inset 0.6s cubic-bezier(0.625, 0.05, 0, 1);
}
[data-scrolling-started="true"] .nav-capsule {
  inset: 0.1875em 0.1875em 0 0.1875em;
  border-radius: 1.25em 1.25em 0 0;
}
```

### C. Logo wordmark-to-symbol slide
```css
.logo-wordmark {
  transform: translateY(0em);
  opacity: 1;
  transition: transform 0.6s cubic-bezier(0.625, 0.05, 0, 1), opacity 0.3s;
}
[data-scrolling-started="true"] .logo-wordmark {
  transform: translateY(0.75em);
  opacity: 0;
}

.logo-symbol {
  transform: translateY(-0.75em);
  opacity: 0;
  transition: transform 0.6s cubic-bezier(0.625, 0.05, 0, 1), opacity 0.3s;
}
[data-scrolling-started="true"] .logo-symbol {
  transform: translateY(0em);
  opacity: 1;
}
```

### D. CSS Grid Row Height Dropdown transition
```css
.nav-menu-dropdown {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.6s cubic-bezier(0.625, 0.05, 0, 1);
  overflow: hidden;
}
[data-nav-status="active"] .nav-menu-dropdown {
  grid-template-rows: 1fr;
}
```


---

## 5. Constraints & Precautions

1.  **No "Osmo" Names in Classes**: To protect brand assets, keep all styling classes and variables generic and semantic (e.g. `.nav-root`, `.nav-capsule`, `.nav-logo-wrap`).
2.  **Blacklisted Components Safeguard**: Ensure no components or component IDs listed in the blacklist config are modified, replaced, or deleted.
3.  **Barba.js Node Replacements**: Be careful with event listener attachments (such as toggle clicks or video hovers). Barba updates replace DOM elements, which can lead to dead listeners unless re-initialized during transition `enter()` hooks.
4.  **Avoid Class Clashes**: Avoid adding sequential class variants like `class-1-1`. Use a standard methodology like BEM (Block Element Modifier) for clear class architecture.

---

## 6. Suggested Tools & Resources for Deeper Context

To gain a more complete understanding of the live site's setup, the following tools and techniques are recommended in the new session:

1.  **Chrome DevTools MCP — `evaluate_script`**: 
    Use this to inspect global library configurations in real-time. For instance:
    *   Query the exact options passed to Lenis: `JSON.stringify(window.lenis)`
    *   Log registered Barba transitions: `console.log(barba.history)`
2.  **Chrome DevTools MCP — `list_network_requests` & `get_network_request`**:
    Capture dynamic assets requested during navigation or hover events, such as font files, fallback SVGs, WebM/MP4 preview source files, and stylesheet overrides loaded from external builders like Slater.
3.  **Webflow MCP — Style and Variable Inspection (`get_styles`, `get_variables`)**:
    Query your own Webflow project style assets before starting, ensuring that variable namespaces match Webflow's conventions.
4.  **`read_url_content` / Slater JS Fetching**:
    Read the contents of Slater build scripts (`https://slater.app/16596/55554.js`) to study the exact scroll boundary checks and page container scale parameters utilized on the production site.

---

## 7. Revised Implementation Strategy: Local-First to Webflow

Instead of building components immediately in Webflow and using DevLink to test locally (which introduces Webflow UI delays and limitations), the next session should follow this process:

### Phase 1: Local Sandbox Replication
1.  **Consolidate Sandbox HTML**: Align structure and class hooks in `index.html` and `about.html` so they share identical namespaces.
2.  **Build High-Fidelity CSS**: Implement structural rules, animations, transitions, marquee keyframes, and video card states in `src/sandbox.css`.
3.  **Build High-Fidelity JS**: Update `src/sandbox.js` to resolve target mismatches, calculate `--y` button transforms, and handle dynamic video play/pause on hover.
4.  **Visual Audit**: Verify scroll reactions, page transitions, and animations locally using the headless browser screenshots.

### Phase 2: Webflow Porting
1. Use Webflow Designer MCP tools or the Webflow interface to recreate the verified local layout structure.
2. Add CSS variables and keyframe rules inside Webflow global code embeds.
3. Implement Javascript behaviors via Webflow page settings or custom scripts.
4. Sync with DevLink to verify that Webflow exports work identically to the pure sandbox code.

---

## 8. Summary of Accomplishments & Webflow CLI Workarounds

During this session, we completed the migration of the persistent navbar structures and created a local React-based DevLink testing sandbox.

### Key Workarounds & Findings:
* **Webflow CLI DevLink Setup**: 
  * Installed `@webflow/webflow-cli` as a local dev dependency.
  * Resolved the `Manifest config for key "devlink" not found` CLI error by configuring `webflow.json` with a top-level `"devlink"` key (instead of `"devlink-export"`) and declaring `"rootDir": "./src/devlink"`.
  * Added `"devlink": "webflow devlink"` to `package.json` to allow clean execution via `npm run devlink sync`.
* **React SVG Style Prop Crash**:
  * Found that the DevLink compiler exported the lock SVG's style attribute as a raw string (`style={"width: 100%; height: 100%;"}`). This caused a fatal React runtime error.
  * Workaround: Replaced it with a standard React object `style={{ width: "100%", height: "100%" }}` in `src/devlink/Global.jsx`.
* **Barba.js Isolation**:
  * Wrapped `barba.init` in `src/main.js` with `if (!window.location.pathname.includes('devlink'))` to prevent Barba from attempting DOM page transitions or throwing "container not found" errors during React DevLink component testing.
* **Vite 5 React Compatibility**:
  * Installed `@vitejs/plugin-react@5` (using `--legacy-peer-deps`) to prevent peer conflicts with the local Vite v5 bundle system.

---

## 9. Next Session Prompt: Breakpoint Styling

### Task Goal:
Migrate and verify layout styling for Webflow breakpoints to ensure the navbar collapses and scrolls fluidly on mobile/tablet viewports.

### Action Plan:
1. **Analyze Live Breakpoint Data**:
   * Use Chrome DevTools MCP (`evaluate_script` or inspecting stylesheet requests) to query media query breakpoints on `osmo.supply`.
   * Extract layout settings (padding, max-width, font scaling) for different viewport widths.
2. **Map to standard Webflow Breakpoints**:
   * Align the live site's media queries to the closest normal Webflow breakpoints (main/desktop, medium/tablet, small/mobile landscape, tiny/mobile portrait) to avoid creating custom breakpoint configurations.
3. **Verify Locally first in Vanilla Index**:
   * Implement and verify the styling transitions in `index.html` (vanilla page) and `src/style.css`.
   * **DO NOT** test or verify inside the React `devlink.html` page first.
4. **Update Webflow Classes**:
   * Once verified in the vanilla local index, update the Webflow classes via the Designer MCP `style_tool`.
   * **CRITICAL SELECTOR RULE**: Update existing classes with media queries/breakpoints. Do not create new duplicate classes or sequential combo overrides (e.g. `.nav-bar-2`) to keep the design clean.

