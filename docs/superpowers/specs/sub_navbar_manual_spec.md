# Sub-Navbar Component Manual Spec

This document details the exact Webflow Designer configuration, element hierarchy, properties, CSS variables, and styling properties required to manually build the `Sub-Navbar` component.

---

## 1. Webflow Color & Size Variables
Select these variables from your **Nav & Theme tokens** variable collection when styling:
* **`electric`** (Hex: `#a1ff62`): Used for base background of marquee link block.
* **`neutral-800`** (Hex: `#201D1D`): Used for marquee text color and tag border/background.
* **`neutral-600`** (Hex: `#312E2E`): Used for tag border and hover backgrounds.
* **`neutral-200`** (Hex: `#E4E3E3`): Used for tag metadata text.
* **`nav-bar-height`** (Size: `4.625em`): Used for top padding offset.
* **`gap-l`** (Size: `1.875em`): Used for side padding alignments.

---

## 2. Component Element Hierarchy
Create the elements in Webflow inside your new component `Sub-Navbar`:

```
[Div Block] (Class: under-nav-bar)
 └── [Div Block] (Class: under-nav-bar__inner)
      ├── [Div Block] (Class: nav-tags-row)
      │    ├── [Div Block] (Class: tags-left)
      │    │    ├── [Div Block] (Class: tag is--category)
      │    │    │    └── [Text Block] (Class: eyebrow is--relative)
      │    │    └── [Div Block] (Class: tag is--name)
      │    │         └── [Text Block] (Class: eyebrow is--relative)
      │    └── [Div Block] (Class: tags-right)
      │         └── [Div Block] (Class: tag is--status)
      │              └── [Text Block] (Class: eyebrow is--relative)
      └── [Link Block] (Class: nav-marquee)
           └── [Div Block] (Class: marquee-css)
                ├── [Div Block] (Class: marquee-css__list)
                │    ├── [Div Block] (Class: marquee-css__item)
                │    │    ├── [Text Block] (Class: eyebrow is--nav-marquee)
                │    │    └── [HTML Embed] (Class: marquee-css__item-svg)
                │    ├── [Div Block] (Class: marquee-css__item)
                │    │    ├── [Text Block] (Class: eyebrow is--nav-marquee)
                │    │    └── [HTML Embed] (Class: marquee-css__item-svg)
                │    ├── [Div Block] (Class: marquee-css__item)
                │    │    ├── [Text Block] (Class: eyebrow is--nav-marquee)
                │    │    └── [HTML Embed] (Class: marquee-css__item-svg)
                │    └── [Div Block] (Class: marquee-css__item)
                │         ├── [Text Block] (Class: eyebrow is--nav-marquee)
                │         └── [HTML Embed] (Class: marquee-css__item-svg)
                └── [Div Block] (Class: marquee-css__list) (Duplicate list for seamless loop)
                     ├── [Div Block] (Class: marquee-css__item)
                     │    ├── [Text Block] (Class: eyebrow is--nav-marquee)
                     │    └── [HTML Embed] (Class: marquee-css__item-svg)
                     ├── [Div Block] (Class: marquee-css__item)
                     │    ├── [Text Block] (Class: eyebrow is--nav-marquee)
                     │    └── [HTML Embed] (Class: marquee-css__item-svg)
                     ├── [Div Block] (Class: marquee-css__item)
                     │    ├── [Text Block] (Class: eyebrow is--nav-marquee)
                     │    └── [HTML Embed] (Class: marquee-css__item-svg)
                     └── [Div Block] (Class: marquee-css__item)
                          ├── [Text Block] (Class: eyebrow is--nav-marquee)
                          └── [HTML Embed] (Class: marquee-css__item-svg)
```

---

## 3. Element-by-Element Styling Configurations

### 1. Outer Container (`.under-nav-bar`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Column`, Align = `Center`
  * **Size**: Width = `100%`
  * **Spacing**: 
    * Padding-top = Choose variable **`nav-bar-height`** (`4.625em`)
    * Padding-left = Choose variable **`gap-l`** (`1.875em`)
    * Padding-right = Choose variable **`gap-l`** (`1.875em`)
  * **Position**: Position = `Fixed`, Top = `0px`, Z-Index = `50`, Pointer Events = `None`
  * **Effects**: Transition = Property: `All`, Duration: `600ms`, Easing: `Cubic Bezier (0.625, 0.05, 0, 1)`
  * **Transform**: Translate Y = `0em`, Scale = `100%`, Rotate Z = `0.001deg`

*Note: Custom page-level CSS will scale/hide the sub-bar when the page is scrolled or menu is active:*
```css
body:has([data-nav-status="active"]) .under-nav-bar,
body:has([data-scrolling-started="true"]) .under-nav-bar {
  transform: translateY(-2em) scale(0.975) rotate(0.001deg);
}
```

---

### 2. Inner Capsule Frame (`.under-nav-bar__inner`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Column`, Align = `Stretch`, Gap = `0.375em`
  * **Size**: Width = `100%`, Max-width = `38em`
  * **Spacing**: Padding-top = `0.375em`
  * **Position**: Position = `Relative`

---

### 3. Tags Container Row (`.nav-tags-row`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Row`, Justify = `Space Between`, Align = `Center`
  * **Size**: Width = `100%`

---

### 4. Left Tags Wrapper (`.tags-left`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Row`, Align = `Center`, Gap = `0.375em`

---

### 5. Right Tags Wrapper (`.tags-right`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Row`, Align = `Center`

---

### 6. Category Tag (`.tag` + `.is--category`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Inline Flex`, Align = `Center`
  * **Spacing**: Padding = `0.25em` top/bottom, `0.625em` left/right
  * **Backgrounds**: Color = Choose variable **`neutral-800`**
  * **Borders**: Radius = `100em`, Width = `1px`, Style = `Solid`, Color = Choose variable **`neutral-600`**
  * **Typography**: Color = Choose variable **`neutral-200`**

---

### 7. Name Tag (`.tag` + `.is--name`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Inline Flex`, Align = `Center`
  * **Spacing**: Padding = `0.25em` top/bottom, `0.625em` left/right
  * **Backgrounds**: Color = `transparent` (No background)
  * **Borders**: Radius = `100em`, Width = `1px`, Style = `Solid`, Color = Choose variable **`neutral-600`**
  * **Typography**: Color = Choose variable **`neutral-200`**

---

### 8. Status Tag (`.tag` + `.is--status`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Inline Flex`, Align = `Center`
  * **Spacing**: Padding = `0.25em` top/bottom, `0.625em` left/right
  * **Backgrounds**: Color = Choose variable **`neutral-800`**
  * **Borders**: Radius = `100em`, Width = `1px`, Style = `Solid`, Color = Choose variable **`neutral-600`**
  * **Typography**: Color = Choose variable **`neutral-200`**

---

### 9. Marquee Link block (`.nav-marquee`)
* **HTML Tag**: `a` (Created as a Link Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Align = `Center`, Justify = `Start`
  * **Size**: Width = `100%`, Height = `1.25em`
  * **Backgrounds**: Color = Choose variable **`electric`**
  * **Borders**: Radius = `0.1875em`
  * **Position**: Position = `Relative`, Overflow = `Hidden`, Pointer Events = `Auto`
  * **Typography**: Decoration = `None`, Color = Choose variable **`neutral-800`**

---

### 10. Marquee Wrapper (`.marquee-css`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Align = `Center`
  * **Size**: Width = `100%`, Height = `100%`
  * **Position**: Position = `Relative`, Overflow = `Hidden`

---

### 11. Marquee List Wrapper (`.marquee-css__list`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Align = `Center`
  * **Size**: Flex-Shrink = `0%` (Do not shrink)
  * **Position**: Position = `Relative`

---

### 12. Marquee Item (`.marquee-css__item`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Align = `Center`, Gap = `1.5em`
  * **Spacing**: Padding-right = `1.5em`
  * **Size**: Flex-Shrink = `0%`

---

### 13. Marquee Eyebrow Text (`.eyebrow` + `.is--nav-marquee`)
* **HTML Tag**: `p` (Created as a Text Block element)
* **Styling**:
  * **Spacing**: Margin-top = `0.0625em`
  * **Typography**:
    * Font Size = `0.65em`
    * Line Height = `1`
    * Case = `Uppercase`
    * Under "Font Variation Settings", set weight to `600` (Semi-bold).
    * Color = `Inherit` (will inherit Neutral-800 from `.nav-marquee`)

---

### 14. Marquee Item Icon SVG (`.marquee-css__item-svg`)
* **HTML Tag**: `div` (Created as an HTML Embed element)
* **Styling**:
  * **Size**: Width = `0.4375em`, Height = `0.4375em`
  * **Typography**: Color = `Inherit` (will inherit Neutral-800)
* **SVG Embed Content**:
```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none" style="display:block; width:100%; height:100%;">
  <path d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z" fill="currentColor"/>
</svg>
```

---

## 4. Marquee Animation & Scroll CSS
Copy this CSS block into your Webflow Page Settings -> **Custom Code (Head)** block to animate the marquee and pause it when the navbar menu is open or scrolling starts:

```css
/* Infinite scrolling keyframe animation */
@keyframes translateX {
  to {
    transform: translateX(-100%);
  }
}

.marquee-css__list {
  animation: translateX 30s linear infinite;
}

/* Pause the scrolling marquee when navbar is active or page starts scrolling */
body:has([data-scrolling-started="true"]) .marquee-css__list,
body:has([data-nav-status="active"]) .marquee-css__list {
  animation-play-state: paused;
}
```

---

## 5. Component Properties (Inputs)

Define the following properties in the Component Settings panel:

| Property Name | Webflow Prop Type | Default Value | Target Mapping |
| :--- | :--- | :--- | :--- |
| **`Show Tags`** | `boolean` | `false` | Div `.nav-tags-row` visibility toggle |
| **`Category Tag`** | `textContent` | `"Product"` | Text inside `.tag.is--category .eyebrow` |
| **`Name Tag`** | `textContent` | `"Button Pack"` | Text inside `.tag.is--name .eyebrow` |
| **`Status Tag`** | `textContent` | `"✓ Included in Membership"` | Text inside `.tag.is--status .eyebrow` |
| **`Show Marquee`** | `boolean` | `true` | Link Block `.nav-marquee` visibility toggle |
| **`Marquee Text`** | `textContent` | `"New: Osmo Button Pack"` | Text inside all `.eyebrow.is--nav-marquee` |
| **`Marquee Link`** | `link` | `/` | Link Block `.nav-marquee` Link setting |
