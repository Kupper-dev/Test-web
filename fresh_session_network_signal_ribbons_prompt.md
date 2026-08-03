# Fresh Session Prompt: Network Signal Paths 3D Render & Multi-Texture Preset Setup

Copy and paste the entire prompt below into a new chat session to start fresh from the checkpoint commit.

---

```markdown
<USER_REQUEST>
# Network Signal Paths 3D Render & Multi-Texture Preset Setup

We are building 3D Ribbon Extrusions along the 3 Network Signal Paths in the IT Flow Section, starting fresh from baseline commit `functioning ribbon blue grain` (`f7b9112` / `fb493a6`).

---

## 1. Context & Checkpoint Baseline
- **Repository Branch:** `experimental-ribbon-new` on `https://github.com/Kupper-dev/Test-web.git`.
- **Checkpoint Commit:** `functioning ribbon blue grain` (`f7b9112` / `fb493a6`).
- **Core Renderer:** `src/animations/kupperRibbonRenderer.js`.
- **Core Animation Driver:** `src/animations/heroRibbonAnimations.js`.

### Locked "Blue Grain" Material Parameters (DO NOT ALTER for Hero & Middle Signal Path):
- **Base Shader:** Custom GLSL multi-stop gradient hook on `MeshPhysicalMaterial`.
- **Gradient Ramp:**
  - Start Color (`0.0`): `#012eff`
  - Mid Color (`0.07`): `#0062ff`
  - End Color (`0.70`): `#47b9ff`
  - Fresnel Rim Light: `#ade9ff`
- **PBR Surface Properties:**
  - Roughness: `0.0`
  - Metalness: `0.6`
  - Transmission (Glass Refraction): `0.4` (Thickness `8.0`, IOR `1.45`, Opacity `1.0`, Transparent `true`)
  - EnvMap Reflectivity: `1.0` (Warehouse HDR `/env/warehouse.hdr`)
- **Texture Map:**
  - Noise Micro-grain: `/textures/noise.webp` tiled at `15.7 x 2.1` with `bumpScale = 0.05`.
- **Lighting Setup:** Key Light `7.0` (White), Fill Light `6.3` (`#00b3ff`), Ambient Light `0.9`.

---

## 2. Technical Requirements

### A. Clean Up Legacy 2D SVG Path Overlays & Scripts
- Locate the SVG element for the 3 network signal paths inside `.it-flow-section` / `.it-flow-cards` (`src/devlink/ItFlowSection.jsx`).
- Remove legacy 2D `<use>` tags (`.track-line`, `.core-line`), CSS stroke styling, and 2D `strokeDashoffset` JS handlers.
- Retain ONLY the clean raw SVG path vector definitions (`<path id="itSignalPath1" ... />`, `itSignalPath2`, `itSignalPath3`) inside `<defs>` for vector trajectory sampling.

### B. 3D Ribbon Extrusion Along Network Signal Paths (IT Flow Section)
- Extrude 3 separate 3D ribbons following the 3 SVG network paths (`itSignalPath1`, `itSignalPath2`, `itSignalPath3`).
- **Location:** The 3D signal ribbons must remain inside `.it-flow-section` (`.it-flow-cards` container) exactly where the 2D paths were, preserving their scroll reveal animation as the user scrolls into the section.
- **No Twists:** Unlike the hero main ribbon, these signal paths will NOT have rotational twisting (`startTwist = 0.0`).
- **No Size Increase:** Uniform width and thickness (`endScale = 1.0`).

### C. Multi-Texture & Preset Setup
1. **Middle Path (Signal Path 2 - Locked):** Must use the exact "Blue Grain" material configuration defined above without any changes.
2. **Left (Signal Path 1) & Right (Signal Path 3) Paths (Configurable):**
   - Instantiate dedicated `MeshPhysicalMaterial` instances defaulting to **ANRI - Semi-Translucent Frosted Glass**:
     - Gradient: `#ffffff` -> `#d4f0ff` -> `#a6e3ff`, rim `#ffffff`.
     - Roughness: `0.25`, Metalness: `0.1`, Transmission: `0.85`, Thickness: `12.0`, IOR: `1.45`.
   - Re-enable the `lil-gui` Tweak Panel specifically for the **Left** and **Right** paths.
   - Provide interactive dropdowns to swap material presets (**Blue Grain**, **ANRI Frosted Glass**, **Granite**, **Steel**, **Marble**, **Glossy Acrylic**) and fine-tune color gradients, PBR properties, transmission, and texture tiling.
   - *Note:* After tweaking Left & Right paths, a different texture will be applied to the third path later.

---

## 3. Architecture & Debugging Checklist (Lessons Learned)
- **Camera-Attached Lighting:** Directional key and fill lights MUST be attached to `this._camera` (or move with the view) so that when scrolling ~3000px down to `.it-flow-section`, the PBR materials receive full 7.0 / 6.3 light intensity.
- **Canvas Visibility & Fallback:** `this._canvas` must remain visible (`opacity = 1.0`), and `KupperRibbonRenderer` must instantiate cleanly on all page entrypoints (`containerEl` fallback).
- **Spatial Alignment Math:** Map SVG `(pt.x, pt.y)` coordinates for viewBox `0 0 740 2000` to WebGL coordinates relative to top-center of `.it-flow-cards`: `localX = (pt.x - 370) * scaleX` and `localY = -pt.y * scaleY`. Position `_signalGroup` at `(rect.left + rect.width/2 - w/2, h/2 - rect.top, 1.0)`.
- **Lifecycle & Safety Guards:** Unbind window resize listeners in `destroy()`, and add null guards (`if (!this._scene || !this._renderer) return;`) inside async loader callbacks.

Please review the repository, confirm we are at commit `functioning ribbon blue grain` (`f7b9112` / `fb493a6`), and implement the requirements step-by-step.
</USER_REQUEST>
```
