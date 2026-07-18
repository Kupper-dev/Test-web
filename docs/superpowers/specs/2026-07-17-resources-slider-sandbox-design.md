# Design Spec: Add Purple Box Placeholder and Clip Slider Cards

This update aligns the layout with the actual design:
- Add a purple box placeholder on the left of the circular resources slider inside the `.vertical-slider-container` row layout.
- Clip the non-active vertical cards by adding `overflow: hidden` to `.about-map__outline` (the circular container) so that cards transitioning in/out are not visible outside the circle boundaries.

## Proposed Changes

### 1. React Entrypoint (`src/resources-slider-entry.jsx`)
- In `.vertical-slider-container`, prepend a placeholder div `<div className="about-us-placeholder" />` on the left of the `.about-map-section`.

### 2. Custom Layout Styles (`resources-slider/slider-sandbox.css`)
- Add styling for `.about-us-placeholder`: `width: 36em; height: 44em; background-color: #5a3df4; border-radius: 2em; flex-shrink: 0;`.
- Add `overflow: hidden` to `.about-map__outline` to clip cards transitioning outside the circle.
