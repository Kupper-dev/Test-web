# Design Spec: SVG Flow Animation Redesign — Frosted Glass Track & Blue Data Pipeline

## Overview
Redesign the existing SVG path animation in the `#home-reel` section to feature a **3D translucent frosted-glass track** housing a **vibrant, animated blue energy flow line**. 

The design reuses the exact SVG Bezier curve geometry from the home-reel section without altering the path coordinates, transforming it into a physical volumetric frosted tube with internal liquid-data flow dynamics.

---

## Key Requirements & Visual Objectives

1. **Frosted-Glass Translucent Track (Primary Objective):**
   - 3D physical tube/channel structure following the original SVG path.
   - Translucent frosted glass look: subtle blur, soft lighting, depth, gentle specular reflections, luminous rim edges.
   - Blends naturally into the page background.

2. **Animated Blue Flow Line (Secondary Objective):**
   - Evokes data moving through a pipeline, drawing/moving itself smoothly from start to end.
   - Positioned 100% inside the frosted glass tube.
   - Appears softened and blurred through the translucent glass wall.
   - Incorporates moving highlights, dynamic animated gradients, and layered energy pulses.

3. **Technical & Engineering Quality:**
   - Smooth 60 FPS performance powered by WebGL (Three.js + GLSL custom shader).
   - Responsive coordinate mapping matching viewport aspect ratio on window resize.
   - Modular architecture separating rendering logic from animation/scroll triggers.
   - Fully configurable engine options object.

---

## System Architecture & Component Design

```
                     ┌───────────────────────────────────────┐
                     │          GSAP ScrollTrigger          │
                     │    (Drives timeline progress u_progress)│
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          GlassFlowRenderer Module                               │
│  src/animations/glassFlowRenderer.js                                            │
│                                                                                 │
│  ┌──────────────────────────────┐        ┌───────────────────────────────────┐  │
│  │   Curve Geometry Engine      │        │      Custom Shader Material       │  │
│  │  - SVG Bezier Path Mapping   │        │  - Fresnel Glass Rim Lighting    │  │
│  │  - CatmullRomCurve3 Spline   │        │  - Translucent Frosted Scattering │  │
│  │  - Three.js TubeGeometry     │        │  - Inner Blue Line Self-Drawing   │  │
│  └──────────────┬───────────────┘        │  - Moving Highlights & Pulse      │  │
│                 │                        └─────────────────┬─────────────────┘  │
│                 └─────────────────┬────────────────────────┘                    │
│                                   │                                             │
│                                   ▼                                             │
│                     ┌───────────────────────────┐                               │
│                     │   WebGL Canvas Renderer   │                               │
│                     └───────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Configuration API (`GlassFlowConfig`)

The renderer exposes a configuration interface for tuning all visual characteristics:

```javascript
export const GlassFlowConfig = {
  // Tube Geometry & Dimensions
  tubeRadius: 18,              // Outer tube diameter (px equivalent in WebGL space)
  tubularSegments: 400,        // High-density curve smooth points
  radialSegments: 32,          // Circular cross-section smoothness
  
  // Frosted Glass Material
  glassColor: '#dbeafe',       // Soft icy translucent glass base color
  glassOpacity: 0.45,          // Outer envelope transparency (0.0 to 1.0)
  glassBlur: 0.35,             // Internal blur factor for inner core diffusion
  rimGlowIntensity: 1.2,       // Luminous edge / Fresnel highlight multiplier
  rimWidth: 2.5,               // Sharpness of rim reflection
  
  // Inner Blue Flow Stream
  coreRadiusRatio: 0.70,       // Inner stream radius (0.7 = 70% inside tube wall)
  coreColor: '#1d4ed8',        // Rich primary blue flow color
  glowColor: '#60a5fa',        // Electric cyan/blue highlight color
  flowSpeed: 2.0,              // Speed of traveling highlight waves along path
  flowDirection: 1,            // Forward (1) or Reverse (-1)
  highlightDensity: 12.0,      // Frequency of energy pulses along the tube
  
  // Animation / Timeline
  progress: 0.0,               // Draw progress (0.0 = start, 1.0 = fully drawn)
};
```

---

## Shader Implementation (GLSL Shaders)

### 1. Vertex Shader (`glassFlow.vert`)
- Passes surface normal, view vector, 2D UV coordinates (`vUv.x` = curve length $0 \to 1$, `vUv.y` = circumference $0 \to 1$), and world positions to the fragment shader.

### 2. Fragment Shader (`glassFlow.frag`)
- **Fresnel Rim Lighting:**
  Calculates $F = \text{pow}(1.0 - |\mathbf{n} \cdot \mathbf{v}|, \text{rimWidth}) \times \text{rimGlowIntensity}$ to create luminous, glass-like edge reflections.
- **Translucent Frosted Envelope:**
  Blends background tint with icy glass color using surface orientation and opacity parameters.
- **Inner Blue Energy Stream:**
  - Evaluates radial distance from tube center axis $R = |vUv.y - 0.5| \times 2.0$.
  - Restricts energy core to $R \le \text{coreRadiusRatio}$.
  - Applies line drawing cutoff: $\text{smoothstep}(\text{uProgress} + 0.02, \text{uProgress}, vUv.x)$.
  - Superimposes dynamic animated wave highlights: $\sin(vUv.x \times \text{highlightDensity} - \text{uTime} \times \text{flowSpeed})$.
  - Blurs energy core boundaries using smooth Gaussian falloff to simulate looking through frosted glass.

---

## File Changes & Modifications

- **`[NEW]` `src/animations/glassFlowRenderer.js`**: Modular engine class creating scene, geometry, custom shader material, uniforms management, window resize handling, and render loop.
- **`[MODIFY]` `src/animations/lusionAnimations.js`**: Integrates `GlassFlowRenderer` into `#home-reel` section, connecting GSAP ScrollTrigger timeline to `renderer.setProgress(progress)`.

---

## Verification & Quality Assurance

1. **60 FPS Performance:** Verify smooth rendering on high-DPI screens without frame drops.
2. **Path Accuracy:** Ensure the 3D tube exactly follows the original SVG Bezier curve geometry connecting the home-reel cards.
3. **Responsiveness:** Test window resize behavior to verify 1:1 camera depth and resolution scaling.
4. **Configurability:** Test updating options live via the configuration API.
