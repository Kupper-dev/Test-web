# Webflow Component Specifications

This document defines the exact specifications, HTML/Webflow structure, BEM classes, style properties, variable mapping, properties, and variants for each component to be migrated.

---

## 1. Navbar Link Component (`Navbar Link`)

Recreates individual list items with hover underlines, count badges, label tags, and dividers.

### Structure & Hierarchy

```
[List Item] (tag: li, class: "nav-bar__big-li")
 └── [Link Block] (tag: a, class: "nav-bar__big-a", attribute: data-hover="")
      ├── [Text Span] (tag: span, class: "nav-bar__big-span", attribute: data-underline-link="")
      ├── [Number Span] (tag: span, class: "nav-bar__big-span-number")
      └── [Tag Wrapper] (tag: div, class: "nav-bar__a-tag")
           └── [Tag Body] (tag: div, class: "tag")
                ├── [Tag Background] (tag: div, class: "button-bg", attribute: data-wf--button-theme--variant="{variant}")
                └── [Tag Text] (tag: span, class: "eyebrow is--relative")
 └── [Divider Line] (tag: div, class: "line is--nav-transparent")
```

### Styling Specifications

| Element / Class Name | Tag | Styles / Properties Applied | Variables / Tokens Used |
| :--- | :--- | :--- | :--- |
| **`nav-bar__big-li`** | `li` | Width: `100%`<br>Position: `relative` | - |
| **`nav-bar__big-a`** | `a` (Link Block) | Display: `flex`<br>Align Items: `center`<br>Width: `100%`<br>Padding-top: `1.0625em`<br>Padding-bottom: `1.125em`<br>Color: `var(--color-neutral-200)` (fallback: `#E4E3E3`)` | `neutral-200` |
| **`nav-bar__big-a:hover`** | - | Color: `var(--color-light)` (fallback: `#FFFFFF`) | - |
| **`nav-bar__big-span`** | `span` (Text) | Font variation weight: `430`<br>Font size: `1.5em`<br>Line height: `1` | - |
| **`nav-bar__big-span-number`** | `span` (Text) | Color: `var(--color-neutral-500)` (fallback: `#817F7F`)` <br>Margin-top: `-0.75em`<br>Margin-left: `0.25em`<br>Font size: `0.75em`<br>Line height: `1`<br>Display: `block`<br>Position: `relative` | `neutral-500` |
| **`nav-bar__a-tag`** | `div` (Block) | Padding-top: `0.25em`<br>Padding-left: `0.625em`<br>Display: `flex` | - |
| **`tag`** | `div` (Block) | Display: `inline-flex`<br>Align Items: `center`<br>Padding: `0.25em 0.625em`<br>Border-radius: `100em`<br>Position: `relative`<br>Color: `var(--color-light)` (fallback: `#FFFFFF`)` <br>Overflow: `hidden` | - |
| **`button-bg`** | `div` (Block) | Position: `absolute`<br>Inset: `0`<br>Z-index: `0`<br>Transition: `background-color 0.2s ease` | - |
| **`line`** | `div` (Block) | Width: `100%`<br>Height: `1px`<br>Background-color: `var(--color-neutral-600)` (fallback: `#312E2E`)` | `neutral-600` |
| **`line.is--nav-transparent`**| - | Opacity: `0.3` | - |

*Note: For the tag background theme color variation, custom attribute binding is used:*
* `[data-wf--button-theme--variant="purple"] .button-bg` -> `background-color: var(--color-purple)` (`#A58BFF`)
* `[data-wf--button-theme--variant="neutral-800"] .button-bg` -> `background-color: var(--color-neutral-800)` (`#201D1D`)

### Component Properties (Inputs)

| Property Name | Webflow Prop Type | Default Value | Target Mapping | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`Link Text`** | `textContent` | `"Link Title"` | `nav-bar__big-span` (Text) | The visible title of the navigation link |
| **`Link URL`** | `link` | `/` | `nav-bar__big-a` (Link Block) | Destination URL or Page Section |
| **`Show Number`** | `boolean` | `false` | `nav-bar__big-span-number` (Visibility) | Toggle visibility of count badge |
| **`Number Text`** | `textContent` | `"0"` | `nav-bar__big-span-number` (Text) | Numeric label for count badge |
| **`Show Tag`** | `boolean` | `false` | `nav-bar__a-tag` (Visibility) | Toggle visibility of the label tag |
| **`Tag Text`** | `textContent` | `"NEW"` | `eyebrow` (Text) | Text inside the tag |
| **`Tag Variant`** | `string` | `"purple"` | `button-bg` (data-wf--button-theme--variant attribute) | Controls background variant of tag |
| **`Show Divider`** | `boolean` | `true` | `line` (Visibility) | Toggle bottom line divider |

---

## 2. Promo Card Component (`Promo Card`)

Dropdown ad card with video preview on hover, tags, title, locked icon overlay, and action button.

### Structure & Hierarchy

```
[Link Block] (tag: a, class: "nav-banner", attribute: data-hover="")
 └── [Card Content Wrapper] (tag: div, class: "nav-banner__content")
      ├── [Tag Row] (tag: div, class: "nav-banner__tags")
      │    └── [Tag Instance(s)] (tag: div, class: "tag")
      ├── [Title Container] (tag: div, class: "nav-banner__title")
      │    └── [Heading] (tag: h2, text: "{title}")
      ├── [Center Content Wrapper] (tag: div, class: "nav-banner__center-content")
      │    └── [Preview Circle] (tag: div, class: "nav-banner__ptc-preview", attribute: data-video-lazy-hover="")
      │         ├── [Video Element] (tag: video, class: "cover-video", attributes: loop, muted, playsinline, data-video-src="{video-url}")
      │         └── [Lock Overlay] (tag: div, class: "ptc-card__locked")
      │              └── [Lock SVG Icon]
      └── [Button Wrapper] (tag: div, class: "nav-banner__btn")
           └── [Pill Button] (tag: button, class: "button")
                ├── [Button BG] (tag: div, class: "button-bg", attribute: data-wf--button-theme--variant="neutral-200")
                └── [Button Text] (tag: span, text: "{btn-text}")
```

### Styling Specifications

| Element / Class Name | Tag | Styles / Properties Applied | Variables / Tokens Used |
| :--- | :--- | :--- | :--- |
| **`nav-banner`** | `a` | Display: `flex`<br>Direction: `column`<br>Width: `100%`<br>Height: `100%`<br>Background-color: `var(--color-neutral-700)` (fallback: `#2A2727`)` <br>Border-radius: `1em`<br>Padding: `2em`<br>Min-height: `20em`<br>Position: `relative`<br>Overflow: `hidden`<br>Transition: `background-color 0.2s ease` | `neutral-700` |
| **`nav-banner:hover`** | - | Background-color: `var(--color-neutral-600)` (fallback: `#312E2E`)` | `neutral-600` |
| **`nav-banner__content`**| `div` | Display: `flex`<br>Direction: `column`<br>Justify Content: `space-between`<br>Height: `100%`<br>Flex Grow: `1`<br>Z-index: `2` | - |
| **`nav-banner__tags`** | `div` | Display: `flex`<br>Gap: `0.375em` | - |
| **`nav-banner__center-content`** | `div` | Display: `flex`<br>Direction: `column`<br>Gap: `1em`<br>Margin-top: `auto`<br>Margin-bottom: `auto` | - |
| **`nav-banner__title h2`**| `h2` | Font size: `1.75em`<br>Font variation weight: `450`<br>Line height: `1.1`<br>Color: `var(--color-light)` (fallback: `#FFFFFF`)` | - |
| **`nav-banner__ptc-preview`**| `div` | Width: `4.5em`<br>Height: `4.5em`<br>Border-radius: `50%`<br>Position: `relative`<br>Overflow: `hidden`<br>Background-color: `var(--color-neutral-800)` (fallback: `#201D1D`)` <br>Display: `flex`<br>Align Items: `center`<br>Justify Content: `center`<br>Border: `1px solid var(--color-neutral-600)` (fallback: `#312E2E`)` | `neutral-800`, `neutral-600` |
| **`cover-video`** | `video` | Width: `100%`<br>Height: `100%`<br>Object Fit: `cover`<br>Position: `absolute`<br>Top: `0`<br>Left: `0`<br>Opacity: `0`<br>Transition: `opacity 0.2s ease` | - |
| **`nav-banner__ptc-preview[data-video-status="loaded"] .cover-video`** | - | Opacity: `1` | - |
| **`ptc-card__locked`** | `div` | Width: `1.25em`<br>Height: `1.25em`<br>Display: `flex`<br>Align Items: `center`<br>Justify Content: `center`<br>Color: `var(--color-neutral-200)` (fallback: `#E4E3E3`)` <br>Z-index: `2` | `neutral-200` |
| **`button`** | `button`| Display: `inline-flex`<br>Align Items: `center`<br>Justify Content: `center`<br>Padding: `0.75em 1.5em`<br>Border-radius: `3em`<br>Position: `relative`<br>Cursor: `pointer`<br>Color: `var(--color-neutral-800)` (fallback: `#201D1D`)` <br>Overflow: `hidden`<br>Font size: `0.875em`<br>Text transform: `uppercase`<br>Font variation weight: `600`<br>Border: `none`<br>Background: `transparent` | `neutral-800` |

### Component Properties (Inputs)

| Property Name | Webflow Prop Type | Default Value | Target Mapping | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`Banner Title`** | `textContent` | `"Title"` | `nav-banner__title h2` (Text) | Heading text for the ad card |
| **`Video URL`** | `string` | `""` | `cover-video` (`data-video-src` attribute) | Video source URL for play-on-hover preview |
| **`Is Locked`** | `boolean` | `true` | `ptc-card__locked` (Visibility) | Toggle lock overlay icon |
| **`Button Text`** | `textContent` | `"More info"` | `button` text (Text) | Call to action button label |
| **`Banner URL`** | `link` | `/` | `nav-banner` (Link Block) | Destination link for card click |

---

## 3. Sub-Navbar Component (`Sub-Navbar`)

Horizontal sub-bar anchored below the navbar capsule supporting two variants: Tag Details or Marquee.

### Structure & Hierarchy

```
[Outer Container] (tag: div, class: "under-nav-bar")
 └── [Inner Width] (tag: div, class: "under-nav-bar__inner")
      ├── [Tags Variant Row] (tag: div, class: "nav-tags-row", visibility: show-tags)
      │    ├── [Left Tags Wrapper] (tag: div, class: "tags-left")
      │    │    ├── [Category Tag] (tag: span, class: "tag is--category")
      │    │    └── [Name Tag] (tag: span, class: "tag is--name")
      │    └── [Right Tags Wrapper] (tag: div, class: "tags-right")
      │         └── [Status Tag] (tag: span, class: "tag is--status")
      └── [Marquee Variant Link] (tag: a, class: "nav-marquee", visibility: show-marquee)
           └── [Marquee Wrapper] (tag: div, class: "marquee-css")
                ├── [Marquee List 1] (tag: div, class: "marquee-css__list")
                │    └── [Marquee Item] (tag: div, class: "marquee-css__item")
                │         ├── [Label] (tag: p, class: "eyebrow is--nav-marquee")
                │         └── [Icon SVG]
                └── [Marquee List 2] (tag: div, class: "marquee-css__list") -> Duplicate for loop
```

### Styling Specifications

| Element / Class Name | Tag | Styles / Properties Applied | Variables / Tokens Used |
| :--- | :--- | :--- | :--- |
| **`under-nav-bar`** | `div` | Position: `fixed`<br>Top: `0`<br>Z-index: `50`<br>Width: `100%`<br>Padding-top: `var(--nav-bar-height)` (fallback: `4.625em`)` <br>Padding-right: `var(--gap-l)` (fallback: `1.875em`)` <br>Padding-left: `var(--gap-l)` (fallback: `1.875em`)` <br>Pointer-events: `none`<br>Transition: `transform 0.4s ease, scale 0.4s ease`<br>Transform: `translateY(0)` | `nav-bar-height`, `gap-l` |
| **`under-nav-bar__inner`**| `div`| Width: `100%`<br>Max-width: `53.125em` (Capsule small width)<br>Display: `flex`<br>Direction: `column`<br>Gap: `0.375em`<br>Padding-top: `0.375em` | - |
| **`nav-marquee`** | `a` | Background-color: `var(--color-electric)` (fallback: `#a1ff62`)` <br>Color: `var(--color-neutral-800)` (fallback: `#201D1D`)` <br>Width: `100%`<br>Height: `1.25em`<br>Border-radius: `0.1875em`<br>Display: `flex`<br>Position: `relative`<br>Overflow: `hidden`<br>Align Items: `center`<br>Pointer-events: `auto` | `electric`, `neutral-800` |
| **`marquee-css`** | `div` | Width: `100%`<br>Display: `flex`<br>Position: `relative`<br>Overflow: `hidden` | - |
| **`marquee-css__list`**| `div` | Display: `flex`<br>Flex-shrink: `0`<br>Align Items: `center`<br>Animation: `translateX 30s linear infinite` | - |
| **`marquee-css__item`**| `div` | Display: `flex`<br>Align Items: `center`<br>Gap: `1.5em`<br>Padding-right: `1.5em`<br>Flex-shrink: `0` | - |
| **`eyebrow.is--nav-marquee`**| `p`| Font size: `0.65em`<br>Font variation weight: `600`<br>Color: `inherit`<br>Margin-top: `0.0625em` | - |

### Component Properties (Inputs)

| Property Name | Webflow Prop Type | Default Value | Target Mapping | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`Show Tags`** | `boolean` | `false` | `nav-tags-row` (Visibility) | Toggle tag info layout |
| **`Category Tag`** | `textContent` | `"NEW"` | `tag is--category` (Text) | Category type metadata tag |
| **`Name Tag`** | `textContent` | `"Vault"` | `tag is--name` (Text) | Specific item name tag |
| **`Status Tag`** | `textContent` | `"Included"` | `tag is--status` (Text) | Status or metadata detail tag |
| **`Show Marquee`**| `boolean` | `true` | `nav-marquee` (Visibility) | Toggle scrolling marquee layout |
| **`Marquee Text`** | `textContent` | `"OSMO Pack"` | `eyebrow is--nav-marquee` (Text) | Text to scroll inside marquee |
| **`Marquee Link`** | `link` | `/` | `nav-marquee` (Link Block) | Destination URL for marquee clicks |

---

## 4. Navbar Component (`Navbar`)

Main persistent outer wrapper capsule enclosing the top row, logo translation transitions, and the mega dropdown.

### Structure & Hierarchy

```
[Navbar Wrapper] (tag: nav, class: "nav", attributes: data-marketing-theme="dark", data-nav-theme="light", data-nav-status="not-active")
 └── [Navbar BG Cover] (tag: div, class: "nav__bg")
 └── [Capsule Alignment] (tag: div, class: "nav-bar__wrap")
      └── [Capsule Width Box] (tag: div, class: "nav-bar__width")
           └── [Capsule Frame] (tag: div, class: "nav-bar")
                ├── [Layered BG] (tag: div, class: "nav-bar__back")
                │    ├── [Outline overlay] (tag: div, class: "nav-bar__outline")
                │    └── [Base Background] (tag: div, class: "nav-bar__bg")
                ├── [Top Row Container] (tag: div, class: "nav-bar__top")
                │    ├── [Menu Menu Trigger] (tag: div, class: "nav-bar__menu")
                │    ├── [Logo Wrapper] (tag: div, class: "nav-bar__logo")
                │    └── [Login/Join Buttons] (tag: div, class: "nav-bar__buttons")
                ├── [Dropdown Divider Line] (tag: div, class: "nav-bar__line")
                └── [Mega Dropdown Area] (tag: div, class: "nav-bar__bottom")
                     └── [Dropdown Inner] (tag: div, class: "nav-bar__bottom-inner")
                          └── [Grid / Columns Row] (tag: div, class: "nav-bar__bottom-row")
                               ├── [Column 1: Products] (class: "nav-bar__bottom-col is--products")
                               │    ├── [Col Eyebrow] (text: "Our Products")
                               │    └── [Products Slot] (type: ComponentSlot)
                               ├── [Column 2: Explore] (class: "nav-bar__bottom-col")
                               │    ├── [Col Eyebrow] (text: "Explore")
                               │    ├── [Explore Slot] (type: ComponentSlot)
                               │    └── [Socials Row]
                               └── [Column 3: Ad Card] (class: "nav-bar__bottom-col is--ad")
                                    └── [Ad Card Slot] (type: ComponentSlot)
```

### Component Properties (Slots)

| Slot Name | Allowed Elements | Description |
| :--- | :--- | :--- |
| **`Products Slot`** | Component Instances only (`Navbar Link`) | Inserts list items in Column 1 |
| **`Explore Slot`** | Component Instances only (`Navbar Link`) | Inserts list items in Column 2 |
| **`Ad Card Slot`** | Component Instances only (`Promo Card`) | Inserts the ad banner card in Column 3 |
