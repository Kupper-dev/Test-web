# Handoff Documentation: Network Signal Paths 3D Render & Multi-Texture Preset Setup

This document serves as the official handoff context for the upcoming development session.

---

## 1. Accomplished Work & Active Baseline

- **Repository Branch:** `experimental-ribbon-new` on `https://github.com/Kupper-dev/Test-web.git`.
- **Checkpoint Commit:** `functioning ribbon blue grain` (`f7b9112` / `fb493a6`).
- **Core Renderer:** [`kupperRibbonRenderer.js`](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/kupperRibbonRenderer.js).
- **Core Animation Driver:** [`heroRibbonAnimations.js`](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/heroRibbonAnimations.js).

### Current "Blue Grain" Ribbon Material Parameters (DO NOT ALTER):
- **Base Shader:** Custom GLSL multi-stop gradient hook on `MeshPhysicalMaterial`.
- **Gradient Ramp:**
  - **Start Color (`0.0`):** `#012eff`
  - **Mid Color (`0.07`):** `#0062ff`
  - **End Color (`0.70`):** `#47b9ff`
  - **Fresnel Rim Light:** `#ade9ff`
- **PBR Surface Properties:**
  - **Roughness:** `0.0`
  - **Metalness:** `0.6`
  - **Transmission (Glass Refraction):** `0.4` (Thickness `8.0`, IOR `1.45`, Opacity `1.0`, Transparent `true`)
  - **EnvMap Reflectivity:** `1.0` (Warehouse HDR Environment Map `/env/warehouse.hdr`)
- **Texture Map:**
  - **Noise Micro-grain:** `/textures/noise.webp` tiled at `15.7 x 2.1` with `bumpScale = 0.05`.
- **Lighting Setup:**
  - **Key Light:** `7.0` (White)
  - **Fill Light:** `6.3` (`#00b3ff`)
  - **Ambient Light:** `0.9`

---

## 2. Next Session Requirements & Specifications

### A. Remove SVG Path Stroke (Prerequisite)
- Locate the SVG path element for the **3 network signal paths**.
- Remove the existing stroke/gradient CSS stroke attributes (`stroke="url(#...)"`, `stroke-width`, etc.) so only the raw vector paths remain as 3D trajectories without visual SVG overlap or confusion.

### B. 3D Ribbon Extrusion Along Network Signal Paths (3 Paths)
- Extrude 3 separate 3D ribbons following the 3 SVG network paths.
- **No Twists:** Unlike the hero main ribbon, these signal paths will **NOT** have rotational twisting (`startTwist = 0`). They must cleanly follow the 3D curves.

### C. Multi-Texture & Preset Setup
1. **Middle Path (Locked):**
   - Must use the **exact** "Blue Grain" material configuration defined above without any changes.
2. **Left & Right Paths (Configurable with Tweak Panel):**
   - Must be instantiated with dedicated material instances.
   - Re-enable the `lil-gui` Tweak Panel specifically for the **Left** and **Right** paths.
   - Provide interactive dropdowns to swap material presets (Granite, Steel, Frosted Glass, Marble, Glossy Acrylic) and fine-tune color gradients, PBR properties, transmission, and texture tiling so the user can compare and select the best look.

---

## 3. Key Files for Next Session

- [`kupperRibbonRenderer.js`](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/kupperRibbonRenderer.js) — 3D Renderer module.
- [`heroRibbonAnimations.js`](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/heroRibbonAnimations.js) — Main GSAP ScrollTrigger timeline controller.
- [`hero-reel.html`](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/hero-reel.html) — HTML markup containing section elements & SVG paths.
