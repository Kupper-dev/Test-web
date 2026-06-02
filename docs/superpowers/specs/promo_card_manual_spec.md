# Promo Card Component Manual Spec

This document details the exact Webflow Designer configuration, element hierarchy, properties, CSS variables, and styling properties required to manually build the `Promo Card` component.

---

## 1. Webflow Color Variables
Select these variables from your **Nav & Theme tokens** variable collection when styling:
* **`neutral-700`** (Hex: `#2A2727`): Used for base card background color.
* **`neutral-600`** (Hex: `#312E2E`): Used for hover card background color and border of preview circle.
* **`neutral-800`** (Hex: `#201D1D`): Used for video preview background.
* **`neutral-200`** (Hex: `#E4E3E3`): Used for locked icon color, and button background fallback.
* **`purple`** (Hex: `#A58BFF`): Used for theme accent tag background.

---

## 2. Component Element Hierarchy
Create the elements in Webflow inside your new component `Promo Card`:

```
[Link Block] (Class: nav-banner)
 └── [Div Block] (Class: nav-banner__content)
      ├── [Div Block] (Class: nav-banner__tags)
      │    ├── [Div Block] (Class: tag)
      │    │    ├── [Div Block] (Class: button-bg)
      │    │    └── [Text Block] (Class: eyebrow is--relative)
      │    └── [Div Block] (Class: tag)
      │         ├── [Div Block] (Class: button-bg)
      │         └── [Text Block] (Class: eyebrow is--relative)
      ├── [Div Block] (Class: nav-banner__center-content)
      │    ├── [Div Block] (Class: nav-banner__title)
      │    │    └── [Heading] (Class: h2-banner-title, Tag: h2)
      │    └── [Div Block] (Class: nav-banner__ptc-preview)
      │         ├── [Video Element] (Class: cover-video)
      │         └── [Div Block] (Class: ptc-card__locked)
      │              └── [HTML Embed] (For Locked SVG Icon)
      └── [Div Block] (Class: nav-banner__btn)
           └── [Link Block / Button] (Class: button)
                ├── [Div Block] (Class: button-bg)
                └── [Text Block] (Class: nav-banner-btn-text)
```

---

## 3. Element-by-Element Styling Configurations

### 1. Root Link Block (`.nav-banner`)
* **HTML Tag**: `a` (Created as a Link Block element)
* **Custom Attributes**: Add attribute `data-hover=""`
* **Styling (Base State)**:
  * **Layout**: Display = `Flex`, Direction = `Column`, Align = `Stretch`
  * **Size**: Width = `100%`, Height = `100%`, Min-height = `20em`
  * **Spacing**: Padding = `2em` (all sides)
  * **Backgrounds**: Color = Choose variable **`neutral-700`**
  * **Borders**: Radius = `1em`
  * **Position**: Position = `Relative`, Overflow = `Hidden`
  * **Typography**: Decoration = `None`
  * **Effects**: Transition = Property: `Background Color`, Duration: `250ms`, Easing: `Ease`
* **Styling (Hover State)**:
  * **Backgrounds**: Color = Choose variable **`neutral-600`**

---

### 2. Card Content Wrapper (`.nav-banner__content`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Column`, Justify = `Space Between`, Align = `Stretch`
  * **Size**: Height = `100%`, Flex Grow = `1`
  * **Position**: Z-Index = `2`

---

### 3. Tag Row Wrapper (`.nav-banner__tags`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Row`, Align = `Center`, Gap = `0.375em`

---

### 4. Tag Badge (`.tag` and child elements)
* *Note: Reuse the `.tag`, `.button-bg`, and `.eyebrow.is--relative` classes created in the Navbar Link component.*
* **Tag Background** (`.button-bg`):
  * Assign the custom attribute `data-wf--button-theme--variant` to either `"neutral-800"` (first tag) or `"purple"` (second tag).
* **Tag Text** (`.eyebrow.is--relative`):
  * Set text content to `"Start"` (first tag) and `"Learning"` (second tag).

---

### 5. Center Content Wrapper (`.nav-banner__center-content`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Column`, Align = `Stretch`, Gap = `1em`
  * **Spacing**: Margin-top = `auto`, Margin-bottom = `auto`

---

### 6. Banner Title Heading (`.h2-banner-title`)
* **HTML Tag**: `h2` (Heading element, Level 2)
* **Styling**:
  * **Typography**:
    * Font Size = `1.75em`
    * Line Height = `1.1`
    * Color = `#ffffff` (Pure White)
    * Under "Font Variation Settings", set weight to `450`.

---

### 7. Preview Circle (`.nav-banner__ptc-preview`)
* **HTML Tag**: `div` (Div Block element)
* **Custom Attributes**: Add attribute `data-video-lazy-hover=""`
* **Styling**:
  * **Layout**: Display = `Flex`, Align = `Center`, Justify = `Center`
  * **Size**: Width = `4.5em`, Height = `4.5em`
  * **Backgrounds**: Color = Choose variable **`neutral-800`**
  * **Borders**: Radius = `50%`, Width = `1px`, Color = Choose variable **`neutral-600`**
  * **Position**: Position = `Relative`, Overflow = `Hidden`

---

### 8. Cover Video (`.cover-video`)
* **HTML Tag**: `video` (Video element)
* **Custom Attributes**:
  * Add attribute `data-video-src` and bind it to the **Video URL** property.
  * Add custom properties: `loop` (boolean/static), `muted` (boolean/static), `playsinline` (boolean/static). Set preload to `metadata`.
* **Styling**:
  * **Size**: Width = `100%`, Height = `100%`
  * **Position**: Position = `Absolute`, Inset = `0`
  * **Effects**: Opacity = `0%`, Transition = Property: `Opacity`, Duration: `250ms`, Easing: `Ease`
  * **Fitting**: Object Fit = `Cover`

*Note: For the hover preview script, when a video is loaded on hover, we add `data-video-status="loaded"` to the preview parent. Add this CSS in page custom code:*
```css
.nav-banner__ptc-preview[data-video-status="loaded"] .cover-video {
  opacity: 1;
}
```

---

### 9. Lock Overlay (`.ptc-card__locked`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Align = `Center`, Justify = `Center`
  * **Size**: Width = `1.25em`, Height = `1.25em`
  * **Position**: Z-Index = `2`
  * **Typography**: Color = Choose variable **`neutral-200`**

* **Locked SVG Embed Content**:
```html
<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 14" fill="none" style="display:block; width:100%; height:100%;">
  <path d="M9.91602 12.2497H4.08268C3.4381 12.2497 2.91602 11.7276 2.91602 11.083V6.99967C2.91602 6.35509 3.4381 5.83301 4.08268 5.83301H9.91602C10.5606 5.83301 11.0827 6.35509 11.0827 6.99967V11.083C11.0827 11.7276 10.5606 12.2497 9.91602 12.2497Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M4.66602 5.83333V4.08333C4.66602 2.79475 5.71077 1.75 6.99935 1.75C8.28793 1.75 9.33268 2.79475 9.33268 4.08333V5.83333" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

---

### 10. Button Wrapper (`.nav-banner__btn`)
* **HTML Tag**: `div` (Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`, Direction = `Row`, Align = `Center`
  * **Spacing**: Margin-top = `auto`

---

### 11. Pill Button (`.button`)
* **HTML Tag**: `div` or `button` (Created as a Div Block styled like a button)
* **Styling (Base State)**:
  * **Layout**: Display = `Inline Flex`, Align = `Center`, Justify = `Center`
  * **Spacing**: Padding = `0.75em` top/bottom, `1.5em` left/right
  * **Borders**: Radius = `3em`
  * **Position**: Position = `Relative`, Overflow = `Hidden`
  * **Typography**:
    * Color = Choose variable **`neutral-800`**
    * Font Size = `0.875em`
    * Case = `Uppercase`
    * Under "Font Variation Settings", set weight to `600` (Semi-bold).
* **Button Background (`.button-bg`)**:
  * Custom Attribute: `data-wf--button-theme--variant="neutral-200"`
  * Styling: Position = `Absolute`, Inset = `0`, Z-Index = `0`, Background Color = Choose variable **`neutral-200`**

---

### 12. Button Text (`.nav-banner-btn-text`)
* **HTML Tag**: `span` (Created as a Text Block element)
* **Styling**:
  * **Position**: Position = `Relative`, Z-Index = `1`
  * **Typography**: Color = `Inherit` (will inherit Neutral-800 from button)

---

## 4. Component Properties (Inputs)

Define the following properties in the Component Settings panel:

| Property Name | Webflow Prop Type | Default Value | Target Mapping |
| :--- | :--- | :--- | :--- |
| **`Banner Title`** | `textContent` | `"Page Transition Course"` | Heading `.h2-banner-title` text |
| **`Video URL`** | `string` | `""` | Video `.cover-video` `data-video-src` attribute |
| **`Is Locked`** | `boolean` | `true` | Div `.ptc-card__locked` visibility toggle |
| **`Button Text`** | `textContent` | `"More info"` | Text block `.nav-banner-btn-text` text |
| **`Banner URL`** | `link` | `/` | Root link block `.nav-banner` Link setting |
