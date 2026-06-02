# Osmo Replica - Webflow Navbar and Marquee Migration Spec

This spec outlines the migration of the persistent capsule navbar, the SPA transition overlay, and the green infinite marquee from the Vite sandbox to Webflow. The migration is performed using the `whtml_builder` tool to create the exact structural elements on the Webflow page without using Webflow components.

## 1. System Overview & Constraints
* **No Webflow Components**: The elements will be injected as normal elements on the home page. The user will convert them to components manually once the layout is ready.
* **No List Items for Nav Links**: To avoid parent-child structural mismatches in Webflow, the columns (`.nav-bar__ul-big`) and individual items (`.nav-bar__big-li`) are implemented using standard `div` blocks instead of `<ul>` and `<li>` elements.
* **CSS Integration**: Existing class names and styles from the sandbox are preserved.

---

## 2. Component Structures

### 2.1 SPA Transition Overlay
```html
<div data-transition-theme="light" class="transition">
  <div class="loading-icon">
    <div class="loading-icon__inner"></div>
  </div>
</div>
```

### 2.2 Persistent Capsule Navbar
```html
<nav data-marketing-theme="dark" data-nav-theme="light" data-nav-status="not-active"
  data-scrolling-started="false" data-scrolling-direction="up" class="nav">
  <div data-nav-toggle="close" class="nav__bg"></div>

  <div class="nav-bar__wrap">
    <div class="nav-bar__width">
      <div class="nav-bar">
        <!-- Background & Outline for the capsule -->
        <div class="nav-bar__back">
          <div class="nav-bar__outline"></div>
          <div class="nav-bar__bg"></div>
        </div>

        <!-- Top Row -->
        <div data-nav-bar-height="" class="nav-bar__top">
          <div class="nav-bar__menu">
            <div data-nav-toggle="toggle" class="nav-menu">
              <div class="nav-menu__hamburger">
                <div class="nav-menu__hamburger-bar"></div>
                <div class="nav-menu__hamburger-bar"></div>
              </div>
              <span class="nav-menu__label">Menu</span>
            </div>
          </div>

          <div class="nav-bar__logo">
            <a aria-label="go to homepage" href="/index.html" class="nav-logo" data-barba-update="">
              <!-- Wordmark SVG (collapses/slides down out of view on scroll) -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 156" fill="none" class="nav-logo__wordmark-svg">
                <path d="M78.1189 156C104.864 156 128.46 142.594 142.542 122.162C150.631 142.968 171.556 156 199.261 156C219.221 156 236.057 149.64 246.874 139.183L245.315 152.771H279.112L287.201 82.4124L305.982 152.771H339.811L358.592 82.4124L366.676 152.771H400.473L396.853 121.273C410.857 142.204 434.75 156 461.881 156C505.024 156 540 121.128 540 78.1118C540 35.096 505.014 0.223607 461.871 0.223607C428.397 0.223607 399.852 21.2219 388.733 50.7173L383.272 3.22411H345.923L322.886 89.5314L299.849 3.22411H262.5L257.253 48.8556C256.617 35.5796 251.151 23.5516 241.721 14.8413C231.212 5.13257 216.53 0 199.256 0C183.072 0 169.126 4.59695 158.924 13.2968C151.403 19.7139 146.48 27.9977 144.576 37.1864C130.812 15.0025 106.205 0.223607 78.1189 0.223607C34.9757 0.223607 0 35.096 0 78.1118C0 121.128 34.9757 156 78.1189 156ZM461.871 35.2728C485.602 35.2728 504.837 54.451 504.837 78.1118C504.837 101.773 485.602 120.951 461.871 120.951C438.14 120.951 418.905 101.773 418.905 78.1118C418.905 54.451 438.14 35.2728 461.871 35.2728ZM199.261 32.6467C213.927 32.6467 222.929 39.4173 223.336 50.7589L223.461 54.2066H256.643L253.222 83.9932C251.521 81.2631 249.503 78.741 247.151 76.4478C239.411 68.9179 228.062 63.7905 213.411 61.2112L193.66 57.6855C180.574 55.335 177.893 51.2581 177.893 45.8603C177.893 44.5083 178.493 32.6415 199.261 32.6415V32.6467ZM185.08 90.4258L208.352 94.7784C223.378 97.6541 225.402 103.733 225.402 109.302C225.402 118.096 215.383 123.556 199.251 123.556C180.094 123.556 172.855 112.781 172.474 103.556L172.333 100.129H153.046C155.106 93.1455 156.233 85.7613 156.233 78.1118C156.233 77.7478 156.212 77.3838 156.207 77.0198C163.143 83.5876 172.829 88.1689 185.075 90.4258H185.08ZM78.1189 35.2728C101.85 35.2728 121.085 54.451 121.085 78.1118C121.085 101.773 101.85 120.951 78.1189 120.951C54.388 120.951 35.153 101.773 35.153 78.1118C35.153 54.451 54.388 35.2728 78.1189 35.2728Z" fill="currentColor" />
              </svg>
              <!-- Symbol SVG (reveals in center on scroll) -->
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none" class="nav-logo__icon-svg">
                <path d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z" fill="currentColor" />
              </svg>
            </a>
          </div>

          <div class="nav-bar__buttons">
            <a href="#login" class="nav-button is--login">Login</a>
            <a href="#join" class="nav-button is--join">Join</a>
          </div>
        </div>

        <div class="nav-bar__line"></div>

        <!-- Bottom Dropdown Row (CSS Grid transition) -->
        <div class="nav-bar__bottom">
          <div class="nav-bar__bottom-overflow">
            <div data-lenis-prevent="" class="nav-bar__bottom-inner">
              <div class="nav-bar__bottom-row">

                <!-- Column 1: Products -->
                <div class="nav-bar__bottom-col is--products">
                  <div class="nav-bar__tag-row">
                    <span class="eyebrow">Our Products</span>
                  </div>
                  <div class="nav-bar__ul-big">
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#vault" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">The Vault</span>
                      </a>
                      <div class="line is--nav-transparent"></div>
                    </div>
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#transitions" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">Page Transition Course</span>
                      </a>
                      <div class="line is--nav-transparent"></div>
                    </div>
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#buttons" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">Button Pack</span>
                        <div class="nav-bar__a-tag">
                          <div class="tag">
                            <div data-wf--button-theme--variant="purple" class="button-bg"></div>
                            <span class="eyebrow is--relative">NEW</span>
                          </div>
                        </div>
                      </a>
                      <div class="line is--nav-transparent"></div>
                    </div>
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#community" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">Community</span>
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Column 2: Explore -->
                <div class="nav-bar__bottom-col">
                  <div class="nav-bar__tag-row">
                    <span class="eyebrow">Explore</span>
                  </div>
                  <div class="nav-bar__ul-big">
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#showcase" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">Osmo Showcase</span>
                      </a>
                      <div class="line is--nav-transparent"></div>
                    </div>
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#collection" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">Collection</span>
                        <span class="nav-bar__big-span-number">180</span>
                      </a>
                      <div class="line is--nav-transparent"></div>
                    </div>
                    <div class="nav-bar__big-li">
                      <a data-hover="" href="#pricing" class="nav-bar__big-a">
                        <span data-underline-link="" class="nav-bar__big-span">Pricing</span>
                      </a>
                    </div>
                  </div>

                  <!-- Social icons -->
                  <div class="nav-bar__socials">
                    <div class="button-row">
                      <a href="#" class="social-circle">Li</a>
                      <a href="#" class="social-circle">Tw</a>
                      <a href="#" class="social-circle">Yt</a>
                    </div>
                  </div>
                </div>

                <!-- Column 3: Ad Card -->
                <div class="nav-bar__bottom-col is--ad">
                  <a data-hover="" href="#learning" class="nav-banner">
                    <div class="nav-banner__before"></div>
                    <div class="nav-banner__bg"></div>
                    <div class="nav-banner__content">
                      <div class="nav-banner__tags">
                        <div class="tag">
                          <div data-wf--button-theme--variant="neutral-800" class="button-bg"></div>
                          <span class="eyebrow is--relative">Start</span>
                        </div>
                        <div class="tag">
                          <div data-wf--button-theme--variant="purple" class="button-bg"></div>
                          <span class="eyebrow is--relative">Learning</span>
                        </div>
                      </div>

                      <div class="nav-banner__center-content">
                        <div class="nav-banner__title">
                          <h2>Page Transition Course</h2>
                        </div>
                        <div class="nav-banner__ptc-preview" data-video-lazy-hover="">
                          <div class="product-card__ptc-preview-before"></div>
                          <video loop muted playsinline data-video-lazy="" data-video-src="https://osmo.b-cdn.net/website/page-transition-course/page-transition-course-thumb-720x450.mp4" class="cover-video" preload="metadata"></video>

                          <div class="ptc-card__locked">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 14" fill="none" class="ptc-card__locked-svg">
                              <path d="M9.91602 12.2497H4.08268C3.4381 12.2497 2.91602 11.7276 2.91602 11.083V6.99967C2.91602 6.35509 3.4381 5.83301 4.08268 5.83301H9.91602C10.5606 5.83301 11.0827 6.35509 11.0827 6.99967V11.083C11.0827 11.7276 10.5606 12.2497 9.91602 12.2497Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M4.66602 5.83333V4.08333C4.66602 2.79475 5.71077 1.75 6.99935 1.75C8.28793 1.75 9.33268 2.79475 9.33268 4.08333V5.83333" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div class="nav-banner__btn">
                        <span class="button">
                          <span data-wf--button-theme--variant="neutral-200" class="button-bg"></span>
                          <span style="position: relative; z-index: 1;">More info</span>
                        </span>
                      </div>
                    </div>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</nav>
```

### 2.3 Scrolling Green Infinite Marquee
```html
<div data-wf--under-nav-bar--variant="lightning" class="under-nav-bar">
  <div class="under-nav-bar__inner">
    <a href="#marquee-click" class="nav-marquee w-inline-block">
      <div data-css-marquee="" style="animation-duration: 30s" class="marquee-css">

        <!-- List Part 1 -->
        <div data-css-marquee-list="nav" class="marquee-css__list">
          <div class="marquee-css__item">
            <p class="eyebrow is--nav-marquee">New: Osmo Button Pack</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none" class="marquee-css__item-svg">
              <path d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z" fill="currentColor" />
            </svg>
          </div>
          <div class="marquee-css__item">
            <p class="eyebrow is--nav-marquee">New: Osmo Button Pack</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none" class="marquee-css__item-svg">
              <path d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <!-- List Part 2 (Seamless loop duplicate) -->
        <div data-css-marquee-list="nav" class="marquee-css__list">
          <div class="marquee-css__item">
            <p class="eyebrow is--nav-marquee">New: Osmo Button Pack</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none" class="marquee-css__item-svg">
              <path d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z" fill="currentColor" />
            </svg>
          </div>
          <div class="marquee-css__item">
            <p class="eyebrow is--nav-marquee">New: Osmo Button Pack</p>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 187 187" fill="none" class="marquee-css__item-svg">
              <path d="M126.049 76.7471L167.276 35.5197L150.805 19.0486L109.577 60.276C107.82 62.0398 104.808 60.7915 104.808 58.3009V0H81.517V70.3375C81.517 76.511 76.511 81.517 70.3375 81.517H0V104.808H58.3009C60.7915 104.808 62.0398 107.82 60.276 109.577L19.0548 150.805L35.5259 167.276L76.7533 126.049C78.5109 124.291 81.5232 125.533 81.5232 128.024V186.324H104.814V115.987C104.814 109.813 109.82 104.808 115.993 104.808H186.331V81.517H128.03C125.539 81.517 124.291 78.5047 126.055 76.7471H126.049Z" fill="currentColor" />
            </svg>
          </div>
        </div>

      </div>
    </a>
  </div>
</div>
```

---

## 3. Verification Plan
1. Trigger injection on the Home page using Webflow's `whtml_builder` tool.
2. Select and inspect generated elements to confirm class names are set correctly.
3. Take snapshots of the injected structures using `element_snapshot_tool` to confirm initial rendering.
