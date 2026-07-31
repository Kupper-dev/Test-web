# Design Specification: Fluent Glassmorphism & Glowing WebGL Signal Paths

## Objective
Replace the flat 2D CSS SVG paths in `ItFlowSection` with a 3D WebGL WebGL Catmull-Rom tube pipeline rendering frosted glass tubes with an electric cyan-blue scrolling energy wave and transparent edge falloffs.

---

## Architecture & Design Details

### 1. WebGL Pipeline Canvas & Alignment (`src/animations/itGlassFlowAnimations.js`)
- **Container**: Canvas overlays `.it-flow-cards` container with `pointer-events: none; z-index: 1`.
- **Curve Extraction**: Map exact coordinates from `itSignalPath1`, `itSignalPath2`, and `itSignalPath3` into 3D `CatmullRomCurve3` splines:
  - Path 1: Main Helpdesk pipeline.
  - Path 2: Central infrastructure pipeline.
  - Path 3: Incident response pipeline.
- **Tube Geometry**: `TubeGeometry` with smooth radial resolution (16 segments, radius 8px).

### 2. Custom GLSL Glass & Glowing Energy Shader (`ShaderMaterial`)
- **Uniforms**:
  - `u_time`: Continuous floating animation.
  - `u_scrollProgress`: Driven by GSAP `ScrollTrigger` mapped to section scroll depth.
  - `u_colorBase`: Frosted glass tint (`rgba(255, 255, 255, 0.15)`).
  - `u_colorStart`: Royal Electric Blue (`#2563EB`).
  - `u_colorEnd`: Cyan Burst (`#00F0FF`).
- **Vertex Shader**: Computes normal vectors for Fresnel glass edge highlighting and maps length along curve (`vUv.x`).
- **Fragment Shader**:
  - **Fresnel Glass Rim**: Highlights tube outer borders to look like Microsoft Fluent glass/acrylic tubes.
  - **Transparent Edge Falloff**: Gaussian opacity envelope `exp(-dist * dist)` so the wave starts and ends at `alpha: 0.0`.
  - **Additive Glow Wave**: Traveling energy packet wave synced with scroll depth.

### 3. Component Integration (`src/devlink/ItFlowSection.jsx`)
- Replaces SVG line paths with WebGL Canvas container `.it-network-webgl`.
- Initializes `initItGlassFlowAnimations()` on mount and cleans up on unmount.

---

## Verification Plan
1. Launch dev server (`npm run dev`) and test `/devlink.html`.
2. Scroll through `.it-flow-section` and inspect frosted glass tube borders.
3. Confirm electric cyan-blue energy wave moves smoothly with transparent start/end fade.
4. Run `npm run build` to verify production bundling.
