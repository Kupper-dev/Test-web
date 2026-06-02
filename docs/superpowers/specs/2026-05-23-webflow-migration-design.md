# Webflow Migration Design: Bottom-Up Components

This document records the approved design, migration approach, and testing criteria for migrating the persistence capsule navigation system from the Vite sandbox to Webflow.

---

## 1. Migration Approach

* **WHTML Builder**: We will insert elements using HTML + CSS strings to preserve exact BEM structure and avoid styling discrepancies.
* **Incremental Verification**: We will migrate and verify one component phase at a time bottom-up:
  1. `Navbar Link` Component
  2. `Promo Card` Component
  3. `Sub-Navbar` Component
  4. `Navbar` Component
  5. Page Integration & Slots
* **Fine-Grained Properties**: We will bind component properties directly to Webflow element settings (e.g. visibility, text, URL).

---

## 2. Component Specifications File

Detailed specifications including:
* Element hierarchy
* Class names
* Detailed CSS properties (flexbox, borders, paddings, sizing)
* Property mapping arrays

Are saved in:
[webflow_component_specs.md](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/docs/superpowers/specs/webflow_component_specs.md)

---

## 3. Verification & Validation Criteria

* **Visual Verification**: Use `element_snapshot_tool` to capture component layout render states inside the Designer.
* **DOM Integrity**: Verify that BEM classes and attributes (`data-hover`, `data-underline-link`) are correct.
* **Component Props**: Check that properties are bound correctly, allowing layout variant combinations (`show-tag`, `show-number`, `show-divider`).
