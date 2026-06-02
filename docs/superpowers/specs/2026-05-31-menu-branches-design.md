# Menu Branches Navigation Design

## Overview
The goal of this project is to expand the existing navigation menu to accommodate 3 distinct business branches. The navigation will be enhanced with a top-level switcher, and each branch will have its own independent content view featuring staggered directional animations when navigating between branches.

## Architecture: Absolute Stack
Instead of building a single slider track, we will use an **Absolute Stack** approach for the branch contents. 

- The `nav-bar__bottom-overflow` container will be set to `position: relative` with hidden overflow.
- Inside it, each of the 3 branches will be wrapped in a container that is `position: absolute`, stacking them on top of one another.
- This ensures that jumping non-sequentially (e.g., from Branch 1 to Branch 3) only animates the outgoing and incoming branches, avoiding any visual "flash" of Branch 2 mid-transition.
- This architecture scales cleanly. If a 4th or 5th branch is added in the future, the identical structural and animation logic will continue to work without modification.

## Components & Layout

### 1. Branch Buttons (The Switcher)
- **Location:** Placed inside `nav-bar__bottom`, at the very top (above `nav-bar__bottom-overflow`).
- **Layout:** A horizontal flex wrapper with padding, containing 3 buttons ("Branch 1", "Branch 2", "Branch 3").
- **State:** The active branch button will be visually distinct from the inactive ones.

### 2. Branch Content Structure
Every branch (current and future) will maintain the identical internal layout footprint to ensure visual consistency and predictable animation behavior:
- **Column 1:** Links column (`nav-bar__bottom-col`).
- **Column 2:** Links column (`nav-bar__bottom-col`).
- **Column 3 (Ad):** Promotional/ad column (`nav-bar__bottom-col is--ad`).
- **Link Items:** Inside Columns 1 and 2, the individual list elements will be designated with the class `nav-bar-link-list-item`.

## Animation Data Flow (GSAP)
We will leverage GSAP to build robust, directional animations. 

### Macro Slide (Branch Transition)
When a user clicks a branch button, we determine the direction based on the index (e.g., moving from index 0 to 2 is "forward/right-to-left").
- **Forward (Right to Left):** Outgoing branch slides to the left and fades out. Incoming branch starts off-screen right and slides into position.
- **Backward (Left to Right):** Outgoing branch slides to the right and fades out. Incoming branch starts off-screen left and slides into position.

### Micro Stagger (Internal Elements)
As the incoming branch slides into view, its internal elements animate in a staggered sequence that matches the macro direction.
- **Moving Right to Left:**
  1. Column 1 starts animating first.
  2. Column 2 follows.
  3. Ad Column follows last.
- **Moving Left to Right:**
  1. Ad Column starts animating first.
  2. Column 2 follows.
  3. Column 1 follows last.
- **List Items (`nav-bar-link-list-item`):** Inside the animating columns, the individual list items will stagger sequentially from top to bottom (handling anywhere from 2 to 5 items gracefully using GSAP's native stagger utility).

## Error Handling & Edge Cases
- **Spam Clicking:** We will ensure that GSAP animations can be safely interrupted or use a lock mechanism so rapid clicking between branch buttons doesn't result in overlapping or visually broken states.
- **Identical Index Click:** Clicking the currently active branch will short-circuit and do nothing.

## Testing Strategy
1. Verify the macro slide behavior when moving sequentially (1 -> 2 -> 3) and non-sequentially (1 -> 3, 3 -> 1).
2. Ensure the staggered micro animations respect the correct direction (Column 1 first vs Ad Column first).
3. Confirm that the UI scales naturally if simulated items are added to a list column (stagger correctly captures 5 items instead of 3).
