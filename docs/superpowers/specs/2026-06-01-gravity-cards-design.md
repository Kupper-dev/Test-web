# Gravity Cards Section Extraction Design

Design spec for extracting, analyzing, and building a sandbox for the `s-education-home` section from `https://247artists.com`, featuring the gravity cards physics animation.

## Goals
- Replicate the exact visual styling and layout of the `s-education-home` section.
- Extract the gravity cards falling animation logic and implement it cleanly using GSAP and Lenis.
- Provide a dedicated, self-contained `gravity-sandbox/` directory served via Vite for testing and tweaking.

## Proposed Changes

### [gravity-sandbox]

#### [NEW] [index.html](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/gravity-sandbox/index.html)
- Define a boilerplate HTML structure loading `Inter` from Google Fonts.
- Implement the DOM hierarchy from the original site:
  - Outer container `.s-education-home`
  - Fixed viewport container `.s__inner`
  - Floating content `.s__content` containing title, subtitle, copy, and radial gradient background `.s__background`
  - Cards container `.s__courses` and list `.s__courses__list` containing the title course (`20+ Courses`) and 20 individual course list items as absolute positioned cards.
  - Links to local styles and scripts.

#### [NEW] [style.css](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/gravity-sandbox/style.css)
- Implement CSS variables for branding color variables:
  - `--color-brand-11`: `#ABF139` (Neon green)
  - `--color-black`: `#231E25` (Dark charcoal)
- Position `.s-education-home` as `relative` with `height: 200vh` (to allow scroll).
- Position `.s__inner` as `fixed` with `height: 100vh` and full width.
- Center `.s__content` in the middle of the screen.
- Style cards (`.sb-course`) to have border, dark background (for title), neon background (for normal courses), and hidden overflow.
- Configure absolute positioning styles mapping to `--radius`, `--width`, `--height` variables.

#### [NEW] [script.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/gravity-sandbox/script.js)
- Import `gsap` and `lenis` using standard npm module syntax.
- Create a `GravitySandbox` class:
  - `init()`: Sets up sizes, registers scroll listener via Lenis, triggers the requestAnimationFrame update loop, and handles window resize.
  - `setSizes()`: Calculates dimensions and sets CSS variables for diagonal and content height.
  - `setCourses()`: Stores bounding boxes, randomizes initial position, z-index, speed variance, and rotation.
  - `initCourse(course)`: Randomized spawn coordinates based on window width and velocity direction.
  - `tick()`: Runs on every frame. Adjusts card positions `y` and rotation based on physics formulas and scroll speed (`scrollDiff`).
  - `initScroll()`: Scroll-scrub animation mapping center text `.s__content` from `y: 150%` to `y: -150%` matching the original design.

## Verification Plan

### Automated/Manual Verification
- Run the local dev server using `npm run dev`.
- Visit `http://localhost:5173/gravity-sandbox/` (or actual port).
- Scroll up and down:
  - Verify cards fall vertically.
  - Verify cards speed up or rise/fall when scrolling fast.
  - Verify the center text container (`.s__content`) scrolls smoothly from bottom to top and fades.
  - Verify cards loop/respawn when going off-screen.
