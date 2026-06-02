# Lusion Home Reel Section Design Spec

Replicate the premium scroll animations and WebGL morphing transitions of the `home-reel` section from `https://lusion.co` locally inside our Vite development environment, and prepare the elements for direct integration into Webflow.

## 1. Goal & Requirements
- **Local Sandbox Page**: Create a `/lusion.html` page running in the Vite sandbox.
- **Scroll Synchronization**: Connect the scroll state (monitored by Lenis) to animate elements based on viewport ranges.
- **Text Splitting & GSAP Tweens**: Split the title text into words and animate them in opposite directions (slide UP vs slide DOWN) using GSAP when scrolled into view.
- **WebGL Thumbnail-to-Video Morph**: Implement a Three.js scene mapping WebGL meshes to the bounding boxes of the thumbnail and video container, with a shader morphing the border radii and boundaries.
- **WebGL Spline Line Drawing**: Render a 3D line drawing itself during scroll by discarding segments in a custom shader, with a cursor indicator following the active tip.
- **Webflow Integration**: Structure the DOM and CSS cleanly so they can be exported to Webflow via `whtml_builder`, with scripts registered on Webflow's CDN.

---

## 2. Proposed Architecture

### Dependencies
We need to add the following npm packages locally for development:
- `three`: 3D rendering library.
- `split-type`: Text splitter utility.

### File Structure
- **HTML**: Create [lusion.html](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/lusion.html) in the project root.
- **Styling**: Write specific styles in `src/style.css` (or a dedicated section) to establish layers and element positions.
- **Animation Logic**: Create [src/animations/lusionAnimations.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/lusionAnimations.js) to manage the Three.js canvas, scroll triggers, custom shaders, and text splitting.

---

## 3. Element Specifications

### Element 1: Title & Description Animations
- **Structure**:
  - The title elements are wrapped inside an `#home-reel-title-inner` container with overflow hidden.
  - A SplitType class divides words.
- **Logic**:
  - Word indices `0-1` ("Bold", "Ideas,") are animated with GSAP `translate3d(slideX, slideY_Up, 0)`.
  - Word indices `2-4` ("Brought", "to", "Life") slide vertically down from above the baseline (`translate3d(0, slideY_Down, 0)`).
  - The container shifts vertically using a small parallax scroll factor.

### Element 2: Animated Scroll Line
- **Structure**:
  - Rendered inside the fixed WebGL canvas overlay.
  - Positioned using a 3D geometry loaded or generated as a spline path matching the visual shape of the lusion.co reel line.
- **Logic**:
  - A custom ShaderMaterial discards geometry fragments beyond the current scroll percentage:
    `if(v_lineRatio > u_showRatio) discard;`
  - A small sphere/circle mesh tracks the curve coordinates at index `u_showRatio` and displays at the front tip.

### Element 3: Thumbnail-to-Video Container Transition
- **Structure**:
  - DOM contains reference elements `#home-reel-thumb` (hidden box representing initial thumbnail) and `#home-reel-container-inner` (final video dimension).
  - WebGL meshes `ufxMeshThumb` and `ufxMesh` are synchronized with these DOM bounding boxes.
- **Logic**:
  - Interpolation factor `w` goes from `0` to `1` as the user scrolls between the thumb and video coordinates.
  - The custom fragment shader uses a rounded box Signed Distance Field (SDF) to warp the thumbnail box boundaries and corner radius into the full-screen video aspect ratio.

---

## 4. Webflow Export Strategy
1. **HTML & CSS Sync**: Use `whtml_builder` to push the `#home-reel` markup and associated styles directly to a page in the user's Webflow site.
2. **Scripts Injection**: 
   - Register `three.js` and `split-type` libraries via CDN script tags in Webflow.
   - Register the compiled `lusionAnimations.js` bundle using Webflow's inline script API.

---

## 5. Verification Plan
- **Local Testing**: Verify smooth scroll synchrony at `http://localhost:5173/lusion.html`.
- **Responsive Testing**: Test resizing and layout shifts from desktop to mobile viewports.
- **WebGL Fallbacks**: Validate behavior if WebGL is unsupported or disabled (fallback to standard video elements).
