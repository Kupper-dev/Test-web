# Design Spec: Remove Testimonials and Globe, Fix Card Spinning

This updated design spec simplifies the resources page to focus exclusively on the updates (resources) vertical slider:
- Remove the horizontal Testimonials slider completely.
- Remove the globe SVG and map sections completely.
- Stop the 3D spinning/rotation of the cards when transitioning (set `rotationX: 0` / remove `rotationX` animation).
- Position the vertical resources slider cleanly.

## Proposed Changes

### 1. React Entrypoint (`src/resources-slider-entry.jsx`)
- Clean up the component layout. Remove the Testimonials section.
- Under the Updates section, remove the `about-map-section` containing the SVG globe, and just render the circular wrapper `.about-map__outline` (acting as the circular black container shown in the reference image) with the updates vertical slider inside it.

### 2. Slider Animations script (`resources-slider/slider-animations.js`)
- In `initVerticalSlider()`, remove the GSAP animation properties for `rotationX` (`rx` / `rotationX`) and `z` (if needed, keep only vertical `y` transitions and opacity fades) to prevent the cards from spinning.
- Remove any references or rotations to `mapOutline`.

### 3. Custom Layout Styles (`resources-slider/slider-sandbox.css`)
- Remove `.testimonial-card` and other testimonial-specific styles.
- Keep the clean circular wrapper and absolute positioned header/footer, centered card layout, and vertical bullet styling.
