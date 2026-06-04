# Tickets Sandbox Color Refinement Design

This design document outlines the transition of the Tickets Sandbox page to use Webflow DevLink theme variables, establishing a premium light-themed support center dashboard utilizing blue and dark gray accents.

## Design Goals

1. **Brand Alignment:** Leverage custom color variables imported from Webflow DevLink to align with the main site's styling.
2. **Option A (Light Theme):** Change the page styling from a dark theme to a clean light theme using `--_dev---background` for page and component backgrounds.
3. **No Neon Green:** Remove the previous bright green styling (`var(--color-brand-11)` / `#ABF139`) and replace it with `--_dev---blue-2` as the primary accent color.
4. **Legibility & Contrast:** Ensure all ticket cards, message cards, text, and SVG shapes maintain high accessibility and professional contrast.

## Theme & Variables Mapping

The following mappings will be established in `tickets-sandbox/style.css` matching the custom properties defined in `/src/devlink/css/global.css`:

| Sandbox Variable | Webflow DevLink Variable | Fallback Value | Purpose |
|---|---|---|---|
| `--color-bg` | `var(--_dev---background)` | `#fafbfc` | Main page & spacers background |
| `--color-black` | `var(--_dev---black)` | `#252731` | Body and primary dark text |
| `--color-blue-2` | `var(--_dev---blue-2)` | `hsla(214, 100%, 50.2%, 1)` | Primary accent brand color (support badge, tickets) |
| `--color-blue-3` | `var(--_dev---blue-3)` | `#65c2ff` | Light blue text for dark message bubbles |
| `--color-white` | `var(--_dev---white)` | `#ffffff` | Contrast white text |

## Proposed Changes

### Component 1: Tickets Sandbox Markup
File: [index.html](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/tickets-sandbox/index.html)

- Add a stylesheet link to `/src/devlink/css/global.css` inside the `<head>` of the HTML before `style.css` to load the Webflow variables:
  ```html
  <link rel="stylesheet" href="../src/devlink/css/global.css">
  <link rel="stylesheet" href="./style.css">
  ```

### Component 2: Tickets Sandbox Styling
File: [style.css](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/tickets-sandbox/style.css)

- Update `:root` variables:
  - Remove/repurpose `--color-brand-11`.
  - Define `--color-bg`, `--color-black`, `--color-blue-2`, `--color-blue-3`, and `--color-white` using DevLink variables.
- Update `body` to use `var(--color-bg)` as background and `var(--color-black)` as color.
- Update `.spacer` and `.s-tickets-home` to have `background: var(--color-bg)` and `color: var(--color-black)`.
- Update `.s-tickets-home .s__suptitle` to use `background: var(--color-blue-2)` and `color: var(--color-white)`.
- Update `.s-tickets-home .s__content .s__background` (the glowing center radial gradient) to fade from `var(--color-blue-2)` opacity to transparent, rather than neon green.
- Update the decorative lines (`.s-tickets-home .s__content:before`, `.s-tickets-home .s__content:after`) to use `var(--color-black)`.
- Update Ticket vs Message bubbles:
  - **Tickets (.sb-ticket--ticket):**
    - Shape fill: `var(--color-blue-2)`
    - Drop shadow: tint with `rgba(32, 81, 255, 0.15)`
    - Text color: `var(--color-white) !important`
  - **Messages (.sb-ticket--message) & Titles (.sb-ticket--title):**
    - Shape fill: `var(--color-black)`
    - Text color: `var(--color-blue-3) !important`
    - Drop shadow: standard dark shadow

## Verification Plan

### Manual Verification
1. Inspect the layout locally on Vite Dev server (typically `http://localhost:5173/tickets-sandbox/index.html`).
2. Verify that `global.css` variables are resolved correctly.
3. Check the color contrast of support message bubbles (white text on blue shape, light blue text on black shape).
4. Perform scroll interaction and check queue velocity and floating cards.
