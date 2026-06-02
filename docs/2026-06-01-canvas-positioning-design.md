# Absolute Canvas Positioning & Aspect-Ratio Scaling Design Spec

## Goal
Position the WebGL canvas absolutely inside the `#home-reel` section and lock its aspect ratio to the SVG viewbox (`1920:1480`) to eliminate height-wise shrinkage and coordinate drift during scroll. Start the drawing animation as soon as the `#home-reel` section enters the viewport.

---

## Architectural Changes

### 1. Absolute Canvas Position
The WebGL canvas will be placed inside `#home-reel` at the beginning of the container:
```css
#lusion-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
```
- **Benefit**: The canvas scrolls naturally with the page. Relative layouts of nested text elements, thumbnails, and morphing meshes remain completely static relative to the canvas origin.

### 2. Aspect-Ratio Locked Dimensions
We compute the height of the canvas and WebGL renderer dynamically to match the exact aspect ratio of the SVG design:
- `w = containerEl.clientWidth`
- `h = w * (1480 / 1920)`
This locks the aspect ratio to `1920:1480` on all viewports, preventing any stretching or vertical compression.

### 3. Coordinate Mapping
The coordinate mapping function `mapSvgPoint` scales the transformed SVG points using the aspect-ratio-locked `w` and `h` parameters:
- `glX = (xPct - 0.5) * w`
- `glY = (0.5 - yPct) * h`
This guarantees mathematically perfect curve shape replication.

### 4. Animation Timing
Modify `titleTl`'s scroll trigger start parameter to `'top bottom'` so the line animation begins drawing as soon as the top of `#home-reel` enters the bottom of the viewport.
- `start: 'top bottom'`
- `end: 'top top'` (finishes drawing when the section fills the viewport, prior to pinning/morphing).

---

## User Review

Please review this design and let me know if you approve so we can write the implementation plan.
