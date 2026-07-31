# IT Flow Section Integration Design Plan

## Overview
We will cleanly port and embed the `it-flow-section` component (including exact layout, card feeds, custom CSS, Phosphor icons, and the animated SVG path script as detailed in `webflow-custom-code.html` and `webflow-vault-export.json`) into the DevLink environment (`devlink-test.jsx`).

## Key Updates
1. **GitHub Synchronization**: Ensured working branch `main` is completely pushed and up to date with `origin/main`.
2. **Placement**: Mount `<ItFlowSection />` **after** `<HomeReel />` inside `<Main mainContent={...} />` in `src/devlink-test.jsx`.
3. **Exact SVG Animation**: Use Webflow custom code stroke-dashoffset scroll animation logic (`webflow-custom-code.html`) so the SVG path dynamically reveals with scroll exactly as designed.

## Implementation Steps
- Create `src/styles/suite-section.css` with exact suite section styles.
- Create `src/devlink/ItFlowSection.jsx` with full component markup and interactive ticket feed scroll handler.
- Mount `<ItFlowSection />` in `src/devlink-test.jsx` right after `<HomeReel />`.
