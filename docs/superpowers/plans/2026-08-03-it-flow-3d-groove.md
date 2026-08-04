# IT Flow 3D Carved Groove & Rolling Sphere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone 3D carved groove & rolling sphere animation exclusively for `.it-flow-section` using `ItFlowRibbonRenderer.js`, ensuring zero impact on the Hero section ribbon.

**Architecture:** Isolate `itSignalPath2` in `ItFlowSection.jsx`. Build `ItFlowRibbonRenderer.js` with capsule U-shaped groove geometry, purple-to-cyan gradient material, and frosted glass rolling sphere playhead with 1,000-point LUT curve sampling.

**Tech Stack:** Three.js, React (Devlink), GLSL shader extensions (`onBeforeCompile`).

---

### Task 1: Clean Up 2D SVG Network Signal Paths in `ItFlowSection.jsx`

**Files:**
- Modify: `src/devlink/ItFlowSection.jsx:68-93`

- [ ] **Step 1: Clean SVG in `ItFlowSection.jsx`**

Remove SVG track lines (`use.track-line`), core stroke lines (`use.core-line`), `itSignalPath1`, and `itSignalPath3`. Retain only `itSignalPath2`.

- [ ] **Step 2: Commit**

```bash
git add src/devlink/ItFlowSection.jsx
git commit -m "refactor(it-flow): clean legacy SVG tracks and isolate middle path itSignalPath2"
```

---

### Task 2: Create Standalone `ItFlowRibbonRenderer.js`

**Files:**
- Create: `src/animations/itFlowRibbonRenderer.js`

- [ ] **Step 1: Write `ItFlowRibbonRenderer.js` module**

Construct `ItFlowRibbonRenderer` class:
- Dedicated `#it-flow-ribbon-canvas` element.
- Extrude capsule U-groove cross section along `itSignalPath2` vector points.
- Multi-stop purple (`#5900ff`) to cyan (`#00d4ff`) gradient `MeshPhysicalMaterial` with noise grain (`/textures/noise.webp`).
- Frosted glass rolling sphere playhead with 1,000-point LUT sampling.
- Isolated environment map (`warehouse.hdr`) applied only to sphere mesh.

- [ ] **Step 2: Commit**

```bash
git add src/animations/itFlowRibbonRenderer.js
git commit -m "feat(it-flow): create standalone ItFlowRibbonRenderer class for carved groove & rolling sphere"
```

---

### Task 3: Mount Renderer & Wire Scroll Progress in `ItFlowSection.jsx`

**Files:**
- Modify: `src/devlink/ItFlowSection.jsx`

- [ ] **Step 1: Instantiate & hook `ItFlowRibbonRenderer` in `ItFlowSection.jsx`**

Import `ItFlowRibbonRenderer` and instantiate in `useEffect`. Connect `setScrollProgress(progress)` on scroll, and call `destroy()` on unmount.

- [ ] **Step 2: Verify build**

Run `npm run build` to verify clean compilation.

- [ ] **Step 3: Commit**

```bash
git add src/devlink/ItFlowSection.jsx
git commit -m "feat(it-flow): mount ItFlowRibbonRenderer and hook scroll progress animation"
```
