# Design Spec: Osmo Sliders Sandbox Integration

This document outlines the design for integrating the Osmo Sliders (horizontal and vertical) into the Vite + React sandbox environment.

## Goals
- Set up a custom HTML entry point for the slider page to compile and run under Vite.
- Create a React mounting component that replicates the UI layout from the Next.js `page.tsx`.
- Dynamically import GSAP and Draggable and register them globally for compatibility with the vanilla slider-animations script.

## Proposed Changes

### 1. HTML Entry Point (`resources-slider.html`)
A new HTML document at the root of the project to serve as the entry point:
- Anchors the React application with `<div id="root"></div>`.
- Imports `src/resources-slider-entry.jsx` as a module.

### 2. React Entry Point (`src/resources-slider-entry.jsx`)
A mounting script that:
- Imports React and ReactDOM.
- Imports the CSS styles from `resources-slider/slider-sandbox.css`.
- Imports slider initialization functions from `resources-slider/slider-animations.js`.
- Mounts the App component.
- Dynamically registers GSAP and Draggable to the window object to ensure vanilla animations run correctly.

### 3. Vite Rollup Configuration (`vite.config.js`)
- Appends `resourcesSlider: resolve(__dirname, 'resources-slider.html')` to the input object of the rollup configuration.

## Verification
- Run `npm run dev` and navigate to `http://localhost:5173/resources-slider.html`.
- Verify the layout renders correctly and slider controls (Prev/Next buttons, bullets) work as expected.
