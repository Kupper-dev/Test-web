# Navbar Scroll Background Color Transition Design

Design spec for smooth background color transition on the navbar wrapper during scroll states.

## Goal Description
When the user scrolls down, the navbar shrinks, switches its logo to the icon version, and shows the WhatsApp button. This spec defines changing the navbar background (`.nav-bar__bg`) color to `--_dev---white-translucid` during the scroll state, while smoothly transitioning the color change. When the navbar menu is opened (active), it must revert to its default dark background color.

## Proposed Changes

### Component: Navigation Styles

#### [MODIFY] [style.css](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/style.css)
- Add CSS transition for the `background-color` property on `.nav-bar__bg` and `.nav-bar__outline` using the existing variable `--animation-default`.
- Add CSS transition for the `color` property on `.nav-menu` using the existing variable `--animation-default`.
- Add scroll state selector targeting `.nav-bar__bg` to apply `var(--_dev---white-translucid)`.
- Add scroll state selector targeting `.nav-bar__outline` to apply `var(--_dev---white-translucid)`.
- Add scroll state selector targeting `.nav-menu` to apply `var(--_dev---black)`.
- Add override selectors for when `[data-nav-status="active"]` is set on the nav parent to revert these elements to their default states.

```css
/* ── Navbar Background Styling on Scroll ── */
.nav-bar__bg {
  transition: background-color var(--animation-default);
}

[data-scrolling-started="true"] .nav-bar__bg {
  background-color: var(--_dev---white-translucid);
}

[data-nav-status="active"] .nav-bar__bg {
  background-color: hsla(227, 91.49%, 3.13%, 0.88);
}

/* ── Navbar Outline Styling on Scroll ── */
.nav-bar__outline {
  transition: background-color var(--animation-default);
}

[data-scrolling-started="true"] .nav-bar__outline {
  background-color: var(--_dev---white-translucid);
}

[data-nav-status="active"] .nav-bar__outline {
  background-color: var(--_dev---black);
}

/* ── Navbar Menu Text and Hamburger Styling on Scroll ── */
.nav-menu {
  transition: color var(--animation-default);
}

[data-scrolling-started="true"] .nav-menu {
  color: var(--_dev---black);
}

[data-nav-status="active"] .nav-menu {
  color: var(--_dev---white);
}
```

## Verification Plan

### Manual Verification
1. Start the Vite dev server with `npm run dev`.
2. Open the page and verify that:
   - When scrolled to the top, the navbar has its default dark background, black outline, and white menu text/hamburger bars.
   - Upon scrolling down, the background smoothly transitions to `white translucid`, the outline to `white translucid`, and the menu text/hamburger bars to `black`.
   - Clicking the hamburger menu to open it reverts the background back to dark, the outline to black, and the menu text/hamburger to white.
   - Closing the menu while scrolled down returns all components to their scrolled colors.
