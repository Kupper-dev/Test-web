# Webflow Components Porting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the scroll-reactive capsule navigation, sub-navbar tags/marquee modes, and mega-menu links as reusable, fine-grained components in Webflow.

**Architecture:** Create an atomic structure where individual items (Links, Promo Cards) are independent components nested inside the global Navbar component, with variable configurations managed using Webflow Variable Collections instead of hardcoded styling values.

**Tech Stack:** Webflow Designer API, HTML5, Custom CSS variables, JS state attributes.

---

### Task 1: Webflow Variable Collection Setup

**Files:**
- Create: Webflow Collection "Nav & Theme tokens"

- [ ] **Step 1: Create the variable collection**

Call `variable_tool > create_variable_collection` with name "Nav & Theme tokens".
Site ID: `695c194c86d5e76167047ce4`

- [ ] **Step 2: Add color variables**

Call `variable_tool > create_color_variable` for each color token below:
* `--color-neutral-800` (value: `#201D1D`)
* `--color-neutral-700` (value: `#2A2727`)
* `--color-neutral-600` (value: `#312E2E`)
* `--color-neutral-500` (value: `#817F7F`)
* `--color-neutral-900` (value: `#131212`)
* `--color-neutral-200` (value: `#E4E3E3`)
* `--color-electric` (value: `#a1ff62`)
* `--color-purple` (value: `#A58BFF`)

- [ ] **Step 3: Add size variables**

Call `variable_tool > create_size_variable` for:
* `--nav-bar-height` (value: `{ "value": 4.625, "unit": "em" }`)
* `--gap-l` (value: `{ "value": 1.875, "unit": "em" }`)

- [ ] **Step 4: Verify variable values exist**

Retrieve variables in the collection to check registration.
Call: `variable_tool > get_variables` with `variable_collection_id` returned in Step 1.
Expected: Full list of color and size tokens matches specifications.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "feat: setup webflow variable collection and styling tokens"
```

---

### Task 2: Create "Navbar Link" Component

**Files:**
- Create: Webflow Component `Navbar Link`

- [ ] **Step 1: Create a new blank component**

Call `de_component_tool > create_blank_component` with name `Navbar Link` and group `Navigation`.

- [ ] **Step 2: Add component property definitions**

Create properties on component `Navbar Link`:
* `link-text` (type: `string`, default value: "Link Text")
* `link-url` (type: `link`, default value: "#")
* `show-tag` (type: `boolean`, default value: false)
* `tag-text` (type: `string`, default value: "NEW")
* `show-number` (type: `boolean`, default value: false)
* `number-text` (type: `string`, default value: "180")
* `has-divider` (type: `boolean`, default value: true)

- [ ] **Step 3: Build component layout structure**

Using `whtml_builder`, add the list item tag to the component canvas:
```html
<li class="nav-bar__big-li">
  <a href="#" class="nav-bar__big-a">
    <span class="nav-bar__big-span">Link Text</span>
    <span class="nav-bar__big-span-number">180</span>
    <div class="nav-bar__a-tag">
      <div class="tag">
        <div class="button-bg" data-wf--button-theme--variant="purple"></div>
        <span class="eyebrow is--relative">NEW</span>
      </div>
    </div>
  </a>
  <div class="line is--nav-transparent"></div>
 </li>
```

- [ ] **Step 4: Bind component properties to element fields**

Call `element_tool > set_settings` to bind elements inside the component:
* Bind text span `.nav-bar__big-span` text content to prop `link-text`.
* Bind anchor `.nav-bar__big-a` link setting to prop `link-url`.
* Bind `.nav-bar__big-span-number` text content to prop `number-text`, and its visibility to `show-number`.
* Bind tag label `.tag .eyebrow` text content to prop `tag-text`, and the `.nav-bar__a-tag` visibility to `show-tag`.
* Bind separator `.line.is--nav-transparent` visibility to prop `has-divider`.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "feat: build Navbar Link component and map properties"
```

---

### Task 3: Create "Promo Card" Component

**Files:**
- Create: Webflow Component `Promo Card`

- [ ] **Step 1: Create a new blank component**

Call `de_component_tool > create_blank_component` with name `Promo Card` and group `Navigation`.

- [ ] **Step 2: Add component properties**

Create properties on component `Promo Card`:
* `banner-title` (type: `string`, default value: "Page Transition Course")
* `video-src` (type: `string`, default value: "https://osmo.b-cdn.net/website/page-transition-course/page-transition-course-thumb-720x450.mp4")
* `is-locked` (type: `boolean`, default value: true)
* `button-text` (type: `string`, default value: "More info")
* `banner-url` (type: `link`, default value: "#")

- [ ] **Step 3: Build component layout structure**

Using `whtml_builder`, add the promo card markup:
```html
<a href="#" class="nav-banner">
  <div class="nav-banner__before"></div>
  <div class="nav-banner__bg"></div>
  <div class="nav-banner__content">
    <div class="nav-banner__tags">
      <div class="tag">
        <div class="button-bg" data-wf--button-theme--variant="neutral-800"></div>
        <span class="eyebrow is--relative">Start</span>
      </div>
      <div class="tag">
        <div class="button-bg" data-wf--button-theme--variant="purple"></div>
        <span class="eyebrow is--relative">Learning</span>
      </div>
    </div>
    <div class="nav-banner__center-content">
      <div class="nav-banner__title">
        <h2>Page Transition Course</h2>
      </div>
      <div class="nav-banner__ptc-preview" data-video-lazy-hover="">
        <div class="product-card__ptc-preview-before"></div>
        <video loop muted playsinline class="cover-video" preload="metadata"></video>
        <div class="ptc-card__locked">
          <svg viewBox="0 0 14 14" fill="none" class="ptc-card__locked-svg"><path d="M9.91602 12.2497H4.08268C3.4381 12.2497 2.91602 11.7276 2.91602 11.083V6.99967C2.91602 6.35509 3.4381 5.83301 4.08268 5.83301H9.91602C10.5606 5.83301 11.0827 6.35509 11.0827 6.99967V11.083C11.0827 11.7276 10.5606 12.2497 9.91602 12.2497Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.66602 5.83333V4.08333C4.66602 2.79475 5.71077 1.75 6.99935 1.75C8.28793 1.75 9.33268 2.79475 9.33268 4.08333V5.83333" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
    </div>
    <div class="nav-banner__btn">
      <button class="button">
        <div class="button-bg" data-wf--button-theme--variant="neutral-200"></div>
        <span style="position: relative; z-index: 1;">More info</span>
      </button>
    </div>
  </div>
</a>
```

- [ ] **Step 4: Bind component settings**

Call `element_tool > set_settings` to bind inputs:
* Bind `.nav-banner` anchor to prop `banner-url`.
* Bind `.nav-banner__title h2` text to prop `banner-title`.
* Bind `.cover-video` custom source attribute (`data-video-src`) to prop `video-src`.
* Bind `.ptc-card__locked` visibility to prop `is-locked`.
* Bind CTA button text `.button span` to prop `button-text`.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "feat: build Promo Card component with video preview slot"
```

---

### Task 4: Create "Sub-Navbar" Component

**Files:**
- Create: Webflow Component `Sub-Navbar`

- [ ] **Step 1: Create a new blank component**

Call `de_component_tool > create_blank_component` with name `Sub-Navbar` and group `Navigation`.

- [ ] **Step 2: Add component properties**

Create properties on component `Sub-Navbar`:
* `layout-mode` (type: `string`, default value: "Tags") - options: "Tags", "Marquee"
* `tag-category` (type: `string`, default value: "Product")
* `tag-name` (type: `string`, default value: "Button Pack")
* `tag-status` (type: `string`, default value: "✓ Included in Membership")
* `marquee-text` (type: `string`, default value: "New: Osmo Button Pack")
* `marquee-link-url` (type: `link`, default value: "#")

- [ ] **Step 3: Build component layout structure**

Using `whtml_builder`, add the sub-navbar structure:
```html
<div class="under-nav-bar">
  <div class="under-nav-bar__inner">
    <!-- Tags Container -->
    <div class="nav-tags-row">
      <div class="tags-left">
        <span class="tag is--category">Product</span>
        <span class="tag is--name">Button Pack</span>
      </div>
      <div class="tags-right">
        <span class="tag is--status">✓ Included in Membership</span>
      </div>
    </div>
    
    <!-- Marquee Container -->
    <a href="#" class="nav-marquee">
      <div class="marquee-css">
        <div class="marquee-css__list">
          <div class="marquee-css__item">
            <p class="eyebrow">New: Osmo Button Pack</p>
          </div>
        </div>
      </div>
    </a>
  </div>
</div>
```

- [ ] **Step 4: Bind visibility and values**

Call `element_tool > set_settings`:
* Bind visibility of `.nav-tags-row` to `layout-mode == "Tags"`.
* Bind visibility of `.nav-marquee` to `layout-mode == "Marquee"`.
* Bind `.tag.is--category` text to prop `tag-category`.
* Bind `.tag.is--name` text to prop `tag-name`.
* Bind `.tag.is--status` text to prop `tag-status`.
* Bind `.nav-marquee` link to prop `marquee-link-url`.
* Bind `.marquee-css__item p` text to prop `marquee-text`.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "feat: build Sub-Navbar component supporting tags and marquee modes"
```

---

### Task 5: Create "Navbar" Component and Nest Children

**Files:**
- Create: Webflow Component `Navbar`

- [ ] **Step 1: Create a new blank component**

Call `de_component_tool > create_blank_component` with name `Navbar` and group `Navigation`.

- [ ] **Step 2: Build the core Navbar Capsule structure**

Using `whtml_builder`, write the main persistent menu structure:
```html
<nav class="nav" data-marketing-theme="dark" data-nav-theme="light" data-nav-status="not-active" data-scrolling-started="false" data-scrolling-direction="up">
  <div class="nav__bg" data-nav-toggle="close"></div>
  <div class="nav-bar__wrap">
    <div class="nav-bar__width">
      <div class="nav-bar">
        <div class="nav-bar__back">
          <div class="nav-bar__outline"></div>
          <div class="nav-bar__bg"></div>
        </div>
        <div class="nav-bar__top">
          <div class="nav-bar__menu">
            <div class="nav-menu" data-nav-toggle="toggle">
              <div class="nav-menu__hamburger">
                <div class="nav-menu__hamburger-bar"></div>
                <div class="nav-menu__hamburger-bar"></div>
              </div>
              <span class="nav-menu__label">Menu</span>
            </div>
          </div>
          <div class="nav-bar__logo">
            <a href="/index.html" class="nav-logo">
              <!-- Logo placeholders -->
              <span class="logo-wordmark">Wordmark</span>
              <span class="logo-symbol">Symbol</span>
            </a>
          </div>
          <div class="nav-bar__buttons">
            <a href="#login" class="nav-button is--login">Login</a>
            <a href="#join" class="nav-button is--join">Join</a>
          </div>
        </div>
        <div class="nav-bar__line"></div>
        <div class="nav-bar__bottom">
          <div class="nav-bar__bottom-overflow">
            <div class="nav-bar__bottom-inner" data-lenis-prevent="">
              <div class="nav-bar__bottom-row">
                <div class="nav-bar__bottom-col is--products">
                  <span class="eyebrow">Our Products</span>
                  <ul class="nav-bar__ul-big" id="col-products-slot"></ul>
                </div>
                <div class="nav-bar__bottom-col">
                  <span class="eyebrow">Explore</span>
                  <ul class="nav-bar__ul-big" id="col-explore-slot"></ul>
                </div>
                <div class="nav-bar__bottom-col is--ad" id="col-ad-slot"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>
```

- [ ] **Step 3: Setup slots and nest inner components**

Convert lists into slots and instantiate inner items:
* Insert Component instances of `Navbar Link` into `#col-products-slot`.
* Insert Component instances of `Navbar Link` into `#col-explore-slot`.
* Insert Component instance of `Promo Card` into `#col-ad-slot`.
All nested components should be added using `component_builder > insert_in_slot`.

- [ ] **Step 4: Verify full rendering**

Render the combined Navbar component on a test page in the Designer and verify nesting layout fits spacing parameters.

- [ ] **Step 5: Commit**

```bash
git commit --allow-empty -m "feat: complete Navbar capsule setup with nested atomic components"
```
