# Handoff: Fresh 3D Ribbon Implementation Plan (`experimental-ribbon-new`)

## Overview
We are abandoning the bloated reverse-engineered WebComponent bundle from the `atuin blue` project. Instead, we are building a clean, lightweight, custom Three.js 3D Ribbon Renderer from scratch directly inside `test 2 web osmo`.

---

## 1. Core Requirements

### A. Trajectory & Path (`line lusion svg.svg`)
- **Source**: Use the exact curve defined in [`line lusion svg.svg`](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/line%20lusion%20svg.svg).
- **Control Points**: 6-segment cubic Bezier curve:
  1. `p0: [52.796, -439.037]` $\rightarrow$ `cp1: [308.755, -437.397]`, `cp2: [1571.89, -207.871]`, `p1: [878.391, 680.295]`
  2. `p0: [878.391, 680.295]` $\rightarrow$ `cp1: [358.606, 1345.99]`, `cp2: [-355.117, 522.324]`, `p1: [520.344, 117.153]`
  3. `p0: [520.344, 117.153]` $\rightarrow$ `cp1: [1571.89, -369.513]`, `cp2: [1036.56, 848.89]`, `p1: [2006.41, 113.677]`
  4. `p0: [2006.41, 113.677]` $\rightarrow$ `cp1: [2941.51, -595.185]`, `cp2: [2030.75, 449.53]`, `p1: [3169.2, 624.676]`
  5. `p0: [3169.2, 624.676]` $\rightarrow$ `cp1: [3553.32, 683.771]`, `cp2: [2913.7, 1318.17]`, `p1: [2762.48, 1452.01]`
  6. `p0: [2762.48, 1452.01]` $\rightarrow$ `cp1: [2319.53, 1844.05]`, `cp2: [3276.96, 1973.44]`, `p1: [3276.96, 1973.44]`
- **Plane Constraint**: The path trajectory must lie 100% flat in a 2D plane ($Z = 0$), matching the screen layout of the SVG line.

### B. What to Borrow from `atuin blue`
1. **3D Rectangular Mesh Shape**: An extruded ribbon strip with rectangular cross-section thickness (not a thin 2D line or round tube).
2. **Surface Shader & Texture**: Metallic/glossy 3D shading, specular highlights, and ambient/directional light response.

### C. What NOT to Include (Exclusions)
- ❌ NO 3D camera rotation around X/Y/Z as you scroll down.
- ❌ NO spring decay, idle timers, spherical point normalization, or auto-resetting path logic.
- ❌ NO internal global window scroll listeners.

---

## 2. Scroll & Visibility Integration

1. **Scroll-Driven Draw**:
   - The ribbon self-draws from progress `0.0` to `1.0` as the user scrolls through the `#home-reel` section.
   - Progress is controlled directly by GSAP / Lenis in `src/animations/lusionAnimations.js`.

2. **Hero Section Visibility**:
   - While the user is in the Hero section (above `#home-reel`), the ribbon canvas is completely hidden (`opacity: 0`, progress `0.0`).
   - The ribbon fades in (`opacity: 1`) smoothly as `#home-reel` comes into view.
   - If the user scrolls back UP into the Hero section, the ribbon fades out (`opacity: 0`) and resets progress to `0.0`.

---

## 3. Recommended Implementation Architecture

- **Renderer File**: `src/animations/atuinRibbonRenderer.js`
- **Class**: `AtuinRibbonRenderer`
- **Geometry**: Extruded flat ribbon strip mesh generated along a `THREE.CurvePath` composed of the 6 Bezier curve segments.
- **Shader Material**: `THREE.MeshStandardMaterial` or `THREE.MeshPhysicalMaterial` with metallic, roughness, and custom gradient map.
- **Lifecycle Methods**:
  - `constructor(canvasContainer)`
  - `setScrollProgress(progress)` (Updates extruded geometry draw range or shader `uDrawProgress` uniform)
  - `resize()` (Handles window aspect ratio & pixel-ratio updates)
  - `destroy()` (Disposes geometries and materials)

---

## 4. Branch Context
- **Current Branch**: `experimental-ribbon-new` (Clean branch off `main`).
- **Archive Branch**: `experimental-ribbon` (Contains all reverse-engineered WebComponent attempt files for reference).

---

## 5. Solving White / Opaque Canvas Background Issues (Reference)
If the canvas or ribbon container ever displays a solid white or opaque background blocking underlying DOM elements:

1. **Three.js WebGLRenderer Alpha Initialization**:
   - Ensure the WebGL renderer is created with `alpha: true`:
     ```javascript
     const renderer = new THREE.WebGLRenderer({
       canvas: canvasElement,
       alpha: true,
       antialias: true
     });
     ```
   - Clear background color with 0 alpha (fully transparent):
     ```javascript
     renderer.setClearColor(0x000000, 0); // Hex 0x000000 with alpha = 0
     ```

2. **Post-Processing Pass Transparency**:
   - If using `EffectComposer` or post-processing passes (e.g. pixelation / bloom), set `renderToScreen` and pass alpha clearing explicitly:
     ```javascript
     composer.renderTarget1.texture.format = THREE.RGBAFormat;
     composer.renderTarget2.texture.format = THREE.RGBAFormat;
     ```

3. **CSS Container Rules**:
   - Ensure canvas/container has explicit transparent background & overlay pointer passing:
     ```css
     #atuin-ribbon-canvas,
     atuin-ribbon {
       background: transparent !important;
       background-color: transparent !important;
       pointer-events: none;
     }
     ```
