# Webflow Bottom-Up Component Migration Instructions

This document outlines the step-by-step methodology and sequence to port the capsule navbar system from our Vite sandbox to Webflow. 

> [!IMPORTANT]
> The previous automated Webflow migration attempt failed. **The new approach must be slow, interactive, and incremental: one component at a time.**
> * **DO NOT** attempt to write multiple components or establish nesting automatically.
> * **DO NOT** proceed to the next component until the USER has explicitly reviewed and confirmed the current one in the Webflow Designer.
> * **FOLLOW the bottom-up sequence** starting from the innermost items up to their parent containers.

---

## 1. Bottom-Up Component Sequence

We will build the navigation components in the following order (from children to parents):

1. **`Navbar Link` Component (Innermost Child)**
   * **Purpose**: Individual navigation list item with hover text, conditional tag badges (e.g. "NEW"), number count badges, and underline dividers.
   * **Task**: Create the component, define properties, build structure, bind properties, and ask the USER for review.

2. **`Promo Card` Component (Inner Child)**
   * **Purpose**: Dropdown advertising card with play-on-hover video preview, category tag badges, lock overlay, and rotating pill CTA button.
   * **Task**: Create the component, define properties, build structure, bind properties, style button text with `.nav-banner-btn-text`, and ask the USER for review.

3. **`Sub-Navbar` Component (Standalone Page-Level)**
   * **Purpose**: Sub-capsule row supporting Tags mode (CMS-driven category/name/status) or infinite marquee modes.
   * **Task**: Create the component, define boolean visibility props (`show-tags`, `show-marquee`), build structure, bind properties, and ask the USER for review.

4. **`Navbar` Component (Parent Wrapper Capsule)**
   * **Purpose**: Persistent capsule wrapping the top menu row (hamburger icon, logo wordmark/symbol translation, buttons) and the dropdown list.
   * **Task**: Create the component, build BEM structure, define slots for products, explore, and ads (`Products Slot`, `Explore Slot`, `Ad Slot`), and ask the USER for review.

5. **Page Integration & Populating Slots**
   * **Purpose**: Instantiating the parent components on the Home page canvas and inserting child component instances inside the slots.
   * **Task**: Insert parent instances on the Home page, insert child instances into slots, set property overrides, and perform final visual audit.

---

## 2. Guidelines for the Next Session

1. **Start by reviewing this file and aligning with the USER on the sequence.**
2. **Execute only one component phase at a time.**
3. **Ask for explicit user feedback/confirmation after completing each component.**
4. **Use exact Webflow Designer canvas navigation (`de_component_tool > open_canvas`)** to switch contexts.
5. **Verify that CSS variable tokens match** the "Nav & Theme tokens" collection variables:
   * Colors: `--color-neutral-800`, `--color-neutral-700`, `--color-neutral-600`, `--color-neutral-500`, `--color-neutral-900`, `--color-neutral-200`, `--color-electric`, `--color-purple`.
   * Sizes: `--nav-bar-height`, `--gap-l`.
