# IT Flow 3D Carved Groove & Rolling Sphere Design Document

## 1. Overview & Architectural Isolation Goal
Implement a carved capsule-shaped 3D groove and rolling frosted glass sphere playhead exclusively for `.it-flow-section` using a dedicated, standalone renderer module `ItFlowRibbonRenderer.js`. 

**Critical Constraint:** The Hero Reel ribbon (`#home-reel` / `KupperRibbonRenderer.js`) and its WebGL lighting/canvas MUST remain 100% untouched and isolated.

---

## 2. Component Design & Changes

### A. SVG Cleaning & Path Isolation (`src/devlink/ItFlowSection.jsx`)
- Remove SVG track lines (`use.track-line`) and core stroke lines (`use.core-line`) for all 3 paths.
- Remove `<path id="itSignalPath1">` and `<path id="itSignalPath3">`.
- Retain ONLY `<path id="itSignalPath2">` (`d="m 33,85h 444c 96,0 190,107 190,201v 224c 0,116 -98,188 -190,187l -192,-2c -92,0 -166,75 -166,168v 278c 0,94 74,169 166,169h 194c 92,0 188,94 188,188v 228c 0,94 -104,191 -214,191H 105"`).

### B. Standalone Renderer `ItFlowRibbonRenderer.js` (`src/animations/itFlowRibbonRenderer.js`)
- **Canvas:** Creates `#it-flow-ribbon-canvas` pinned to fixed viewport (or section container).
- **3D Groove Geometry:** Builds capsule-shaped trench cross-section (flat bottom, curved inner walls) extruded along `itSignalPath2` WebGL mapping. Flush with surface at $Z=0$.
- **"Blue Grain" Gradient Material:** 
  - Fragment shader multi-stop ramp: `#5900ff` (Deep Purple) $\to$ `#00d4ff` (Bright Cyan).
  - Tiled noise grain (`/textures/noise.webp`, `15.7 x 2.1`, `bumpScale = 0.05`, `roughness = 0.0`, `metalness = 0.6`).
- **Frosted Glass Rolling Sphere:**
  - `THREE.SphereGeometry` with physical frosted glass transmission (`transmission = 0.9`, `roughness = 0.15`, `ior = 1.45`, `dispersion = 0.02`).
  - Environment map (`warehouse.hdr`) applied **only** to this sphere mesh (`isSignalGlass = true`).
  - Position calculated via 1,000 pre-sampled LUT trajectory points (`lutPoints`, `lutTangents`, `lutNormals`), cradled inside the carved groove.

### C. Component Lifecycle & Integration (`ItFlowSection.jsx`)
- Instantiate `ItFlowRibbonRenderer` inside `useEffect` in `ItFlowSection.jsx`.
- Update scroll progress via `rendererInstance.setScrollProgress(progress)` on window scroll.
- Clean up canvas and event listeners in `useEffect` unmount cleanup callback (`rendererInstance.destroy()`).

---

## 3. Strict Guardrails & Verification Plan
- **Hero Protection:** Zero modifications to `KupperRibbonRenderer.js` or `heroRibbonAnimations.js`.
- **Pre-sampled LUT:** Zero dynamic `getPointAt()` calls inside frame loop.
- **Build Verification:** Run `npm run build` to confirm zero compilation errors.
