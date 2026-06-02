# Osmo Supply Design & Structure Findings

This document tracks core design principles, layout findings, and structure specs discovered from [osmo.supply](https://www.osmo.supply/). Keep these guidelines in mind during edits to ensure structural integrity and prevent unexpected regressions.

---

## 1. Fluid Layout Scaling System

- **Why it is structured this way**: All elements are sized using `em` units rather than standard `px` or `rem`. This is because the entire page viewport scale is driven by a dynamic base font-size calculated on the `body` tag:
  ```css
  :root {
    --size-unit: 16;
    --size-container-ideal: 1440;
    --size-container-min: 992px;
    --size-container-max: 1920px;
    --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
    --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
  }

  body {
    font-size: var(--size-font);
  }
  ```
- **Constraint**: Changing elements to use `px` or `rem` will break responsive alignment. Keep padding, borders, margins, widths, and gaps in `em` units to preserve fluid scaling across monitors.

---

## 2. Scroll-Reactive Capsule States

- **Why it is structured this way**: We avoid calculating inline offsets in JS on scroll. Instead, JS updates metadata attributes on the `nav` and `body` tags, letting pure CSS handle the layouts:
  - `data-nav-status="active | not-active"`
  - `data-scrolling-started="true | false"`
  - `data-scrolling-direction="up | down"`
- **Key Layout Transitions**:
  - **Capsule Inset**: The nav background starts full-width (`inset: 0`). When `data-scrolling-started="true"`, it shrinks to `inset: 0.1875em` (desktop) and gains rounded corners (`border-radius: 1.25em`).
  - **Logo Wordmark-to-Symbol Morph**: The wordmark transitions down out of sight (`transform: translateY(100%)`) while the center symbol logo slides in from top to center.
- **Constraint**: Do not hardcode height values on the nav wrapper. All vertical spacing must follow relative `em` offsets.

---

## 3. Barba.js Page Architecture

- **Why it is structured this way**: The persistent capsule navbar sits **outside** the `<div data-barba="wrapper">` element.
- **Reasoning**:
  - Placing the navbar outside the PJAX container ensures it is not re-rendered or destroyed during page transitions.
  - The menu status and theme persist seamlessly across page changes.
  - Navbar links that require updates on page changes (e.g., logo links or home indicators) are decorated with `data-barba-update=""` so they are updated manually inside the Barba hooks.
- **Constraint**: Never place the main `<nav>` inside the Barba wrapper. Doing so will reset menu states and interrupt transitions.

---

## 4. CSS Grid Dropdown Mega-Menu

- **Why it is structured this way**: Expanding height dynamically is achieved using CSS Grid template rows transition:
  ```css
  .nav-bar__bottom {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows var(--animation-default);
  }
  [data-nav-status="active"] .nav-bar__bottom {
    grid-template-rows: 1fr;
  }
  ```
- **Reasoning**: Animating heights from `0` to `auto` is not natively supported in CSS. By using `0fr -> 1fr` transitions on a grid, we get smooth, hardware-accelerated dropdown expansions without hardcoding pixel heights.

---

## 5. Infinite Sliding Marquee Placement

- **Why it is structured this way**: The green marquee is absolute-positioned inside `.under-nav-bar` directly beneath the navbar capsule:
  - It uses `padding-top: var(--nav-bar-height)` to avoid being obscured by the capsule.
  - When scrolling starts, `.under-nav-bar` translates vertically up behind the capsule.
  - When the dropdown opens, the green marquee is hidden or paused to prevent visual clutter and reduce background render load.
