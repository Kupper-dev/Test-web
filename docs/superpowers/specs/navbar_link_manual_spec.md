# Navbar Link Component Manual Spec

This document details the exact Webflow Designer configuration, element hierarchy, properties, CSS variables, and styling properties required to manually build the `Navbar Link` component.

---

## 1. Webflow Color Variables
These variables should be selected from your **Nav & Theme tokens** variable collection when styling color fields:
* **`neutral-200`** (Hex: `#E4E3E3`): Used for link text color.
* **`neutral-500`** (Hex: `#817F7F`): Used for number text color.
* **`neutral-600`** (Hex: `#312E2E`): Used for line divider background color.
* **`purple`** (Hex: `#A58BFF`): Used for the "purple" tag background.
* **`neutral-800`** (Hex: `#201D1D`): Used for the "neutral-800" tag background.

---

## 2. Component Element Hierarchy
Create the elements in Webflow in the following order:

```
[ListItem] (Class: nav-bar__big-li)
 ├── [Link Block] (Class: nav-bar__big-a)
 │    ├── [Text Block] (Class: nav-bar__big-span)
 │    ├── [Text Block] (Class: nav-bar__big-span-number)
 │    └── [Div Block] (Class: nav-bar__a-tag)
 │         └── [Div Block] (Class: tag)
 │              ├── [Div Block] (Class: button-bg)
 │              └── [Text Block] (Class: eyebrow is--relative)
 └── [Div Block] (Class: line is--nav-transparent)
```

---

## 3. Element-by-Element Styling Configurations

### 1. Root Element (`.nav-bar__big-li`)
* **HTML Tag**: `div` (You can use a normal Div Block instead of a List Item `li` element)
* **Styling**:
  * **Size**: Width = `100%`
  * **Position**: Position = `Relative`

---

### 2. Link Block (`.nav-bar__big-a`)
* **HTML Tag**: `a` (Created as a Link Block element)
* **Custom Attributes**: Add attribute `data-hover=""` (value can be left blank)
* **Styling (Base State)**:
  * **Layout**: Display = `Flex`, Direction = `Row`, Align = `Center`
  * **Size**: Width = `100%`
  * **Spacing**: Padding-top = `1.0625em`, Padding-bottom = `1.125em`
  * **Typography**:
    * Color = Choose variable **`neutral-200`**
    * Decoration = `None`
  * **Effects**: Transition = Property: `Color`, Duration: `250ms` (or `0.25s`), Easing: `Ease`
* **Styling (Hover State)**:
  * Select `Hover` state in class dropdown.
  * **Typography**: Color = `#ffffff` (Pure White)

---

### 3. Title Span (`.nav-bar__big-span`)
* **HTML Tag**: `span` (Created as a Text Block element)
* **Custom Attributes**: Add attribute `data-underline-link=""` (value can be left blank)
* **Styling**:
  * **Typography**:
    * Font Size = `1.5em`
    * Line Height = `1`
    * Under "Font Variation Settings" (if using variable fonts), set weight to `430`.

---

### 4. Number Span (`.nav-bar__big-span-number`)
* **HTML Tag**: `span` (Created as a Text Block element)
* **Styling**:
  * **Layout**: Display = `Block`
  * **Size**: Height = `auto`
  * **Spacing**: Margin-top = `-0.75em`, Margin-left = `0.25em`
  * **Position**: Position = `Relative`
  * **Typography**:
    * Color = Choose variable **`neutral-500`**
    * Font Size = `0.75em`
    * Line Height = `1`

---

### 5. Tag Wrapper (`.nav-bar__a-tag`)
* **HTML Tag**: `div` (Created as a Div Block element)
* **Styling**:
  * **Layout**: Display = `Flex`
  * **Spacing**: Padding-top = `0.25em`, Padding-left = `0.625em`

---

### 6. Tag Body (`.tag`)
* **HTML Tag**: `div` (Created as a Div Block element)
* **Styling**:
  * **Layout**: Display = `Inline Flex`, Align = `Center`
  * **Size**: Height = `auto`
  * **Spacing**: Padding = `0.25em` top/bottom, `0.625em` left/right
  * **Position**: Position = `Relative`, Overflow = `Hidden`
  * **Borders**: Radius = `100em` (pill shape)
  * **Typography**: Color = `#ffffff` (Pure White)

---

### 7. Tag Background (`.button-bg`)
* **HTML Tag**: `div` (Created as a Div Block element)
* **Custom Attributes**: Add attribute `data-wf--button-theme--variant=""` and bind it to the **Tag Variant** property.
* **Styling**:
  * **Position**: Position = `Absolute`, Inset = `0` (top/right/bottom/left = `0px`), Z-Index = `0`
  * **Effects**: Transition = Property: `Background Color`, Duration: `250ms`, Easing: `Ease`

---

### 8. Tag Text (`.eyebrow` combined with `.is--relative`)
* **HTML Tag**: `span` (Created as a Text Block element)
* **Styling**:
  * **Position**: Position = `Relative`, Z-Index = `1`
  * **Typography**:
    * Color = `Inherit` (will inherit White from `.tag`)
    * Font Size = `0.65em`
    * Under "Font Variation Settings", set weight to `600` (Semi-bold).
    * Case = `Uppercase`
    * Letter Spacing = `0.05em`

---

### 9. Divider Line (`.line` combined with `.is--nav-transparent`)
* **HTML Tag**: `div` (Created as a Div Block element)
* **Styling**:
  * **Size**: Width = `100%`, Height = `1px`
  * **Spacing**: Margin/Padding = `0px`
  * **Backgrounds**: Color = Choose variable **`neutral-600`**
  * **Effects**: Opacity = `30%` (or `0.3`)

---

## 4. Underline Hover Interaction CSS
To make the underline draw dynamically from left to right on hover and collapse to the right on leave, copy this CSS block into your Webflow Page Settings -> **Custom Code (Head)** block:

```css
/* Underline link hover animation mechanics */
[data-underline-link] {
  position: relative;
  cursor: pointer;
}

[data-underline-link]::before {
  content: "";
  position: absolute;
  bottom: -0.175em;
  left: 0;
  width: 100%;
  height: calc(0.0625em / 3);
  background-color: currentColor;
  transition: transform 0.6s cubic-bezier(0.625, 0.05, 0, 1);
  transform-origin: right;
  transform: scaleX(0) rotate(0.001deg);
}

[data-hover]:hover [data-underline-link]::before {
  transform-origin: left;
  transform: scaleX(1) rotate(0.001deg);
}
```
