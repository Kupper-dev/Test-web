# Osmo Sliders Sandbox Implementation Plan (Updated)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correctly swap the sliders, displaying testimonials in the horizontal slider and updates (resources) in the vertical slider, styled to match the reference image.

---

### Task 1: Update React Entrypoint

**Files:**
- Modify: `src/resources-slider-entry.jsx`

- [ ] **Step 1: Update src/resources-slider-entry.jsx**
Replace the component structure to swap the sliders and lay out the updates inside the vertical circular slider.
```javascript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../resources-slider/slider-sandbox.css';
import { initOsmoSlider, initVerticalSlider } from '../resources-slider/slider-animations';

function App() {
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/Draggable').then(({ Draggable }) => {
        gsap.registerPlugin(Draggable);
        window.gsap = gsap;
        window.Draggable = Draggable;
        
        initOsmoSlider();
        initVerticalSlider();
      });
    });
  }, []);

  return (
    <div className="sandbox-container">
      <h1 style={{ display: "none" }}>Osmo Sliders Sandbox</h1>
      
      {/* Horizontal Testimonials Slider Section */}
      <section className="sandbox-section">
        <h2 className="sandbox-section-title">What People Say</h2>
        <div data-gsap-slider-init="testimonials" data-gsap-slider-rotate="true" className="product-slider">
          <div data-gsap-slider-collection="true" className="gsap-slider__collection">
            <div data-gsap-slider-list="true" className="gsap-slider__list">
              {[
                { name: "John Doe", text: "Osmo supply has completely transformed how we build Webflow projects. Highly recommend!" },
                { name: "Jane Smith", text: "The premium design aesthetics and smooth animations make our sites look like they cost $50k+." },
                { name: "Alex Johnson", text: "Unbelievable library of code snippets and templates. Dennis and Ilja are genius creators." },
                { name: "Emily Davis", text: "The fluid scaling system makes responsive design automatic. A game changer." },
                { name: "Michael Brown", text: "Cleanest GSAP integrations on the web. Easy to customize and super lightweight." }
              ].map((t, idx) => (
                <div key={idx} data-gsap-slider-item="true" className="gsap-slider__item">
                  <div className="testimonial-card">
                    <p className="testimonial-text">"{t.text}"</p>
                    <span className="testimonial-author">- {t.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="gsap-slider__controls">
            <button data-gsap-slider-control="prev" className="gsap-slider__control">
              <span className="slider-arrow-text">← Prev</span>
            </button>
            <div className="gsap-slider__counter">
              <span data-gsap-slider-active-slide>01</span>
              <span className="counter-divider">/</span>
              <span data-gsap-slider-total-slide>05</span>
            </div>
            <button data-gsap-slider-control="next" className="gsap-slider__control">
              <span className="slider-arrow-text">Next →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vertical Updates Section */}
      <section className="sandbox-section">
        <div data-vertical-slider="true" className="vertical-slider-container">
          
          <div className="about-map-section">
            <div className="about-map__outline">
              <div className="vertical-slider__header">
                <span className="slider-header-tag">Latest updates</span>
                <span className="slider-header-sub">from Osmo</span>
              </div>
              
              <div className="vertical-slider__content-wrap">
                <div data-vertical-slider-list="true" className="vertical-slider__list">
                  {[
                    { title: "Film Grain Effect", category: "VISUAL EFFECTS", tags: ["4 DAYS AGO", "NEW RESOURCE"], text: "FILM GRAIN" },
                    { title: "Split Text Reveal", category: "TYPOGRAPHY", tags: ["1 WEEK AGO", "EFFECT"], text: "SPLIT TEXT" },
                    { title: "Web Dynamic Map", category: "COMPONENTS", tags: ["2 WEEKS AGO", "INTERACTIVE"], text: "GLOBE MAP" },
                    { title: "Lenis Smooth Scroll", category: "SCROLL", tags: ["3 WEEKS AGO", "LIBRARY"], text: "SMOOTH SCROLL" },
                    { title: "Vite React Starter", category: "STARTERS", tags: ["4 WEEKS AGO", "TEMPLATE"], text: "REACT COMP" }
                  ].map((item, idx) => (
                    <div key={idx} data-vertical-slider-item="true" className="vertical-slider__item">
                      <div className="demo-card">
                        <div className="demo-card__top">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="demo-card__tag">{tag}</span>
                          ))}
                        </div>
                        <div className="demo-card__middle">
                          <h3 className="transitions__card-title">{item.title}</h3>
                          <p className="demo-card__description">{item.category}</p>
                        </div>
                        <div className="demo-card__image-placeholder">
                          <span>{item.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="vertical-slider__footer">
                New stuff is<br />added every week!
              </div>
            </div>
          </div>
          
          <div className="vertical-slider__controls-wrap">
            <div className="vertical-slider__controls">
              <button data-prev="true" className="gsap-slider__control">↑ Prev</button>
              <div className="vertical-slider__bullets">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button key={idx} data-vertical-slider-bullet={idx === 0 ? "active" : "not-active"} className="vertical-slider__bullet">
                    <span className="vertical-slider__bullet-item-line"></span>
                  </button>
                ))}
              </div>
              <button data-next="true" className="gsap-slider__control">↓ Next</button>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### Task 2: Update Vertical Slider Animation Active State Attribute

**Files:**
- Modify: `resources-slider/slider-animations.js`

- [ ] **Step 1: Set data-vertical-slider-item-status on slides**
In `resources-slider/slider-animations.js`, update `updateSlider()` and the initial layout loop to set the attribute `data-vertical-slider-item-status` to `"active"` or `"not-active"`.
```javascript
      items.forEach((item, idx) => {
        const stateKey = String(getRelativeStateIndex(idx, activeIndex));
        const state = states[stateKey] || { y: `-${yVal}em`, z: `-${zVal}em`, rx: rotVal, opacity: 0 };
        const isCurrent = idx === activeIndex;
        item.setAttribute("data-vertical-slider-item-status", isCurrent ? "active" : "not-active");
        ...
```

---

### Task 3: Update CSS for Circular Layout and Card Styling

**Files:**
- Modify: `resources-slider/slider-sandbox.css`

- [ ] **Step 1: Add new styles and overrides**
Append/update the CSS file with:
```css
/* Color Overrides for Lime Green theme */
:root {
  --color-electric: #a1ff62; /* Brand green */
}

/* Adjust circle size and background */
.about-map__outline {
  width: 44em !important;
  height: 44em !important;
  background-color: var(--color-neutral-900);
  border: 1px solid var(--color-neutral-600);
  flex-direction: column;
  justify-content: space-between;
  padding: 3em 0;
  box-sizing: border-box;
}

/* Header within circle */
.vertical-slider__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
}
.slider-header-tag {
  color: var(--color-electric);
  font-size: 1.1em;
  font-weight: bold;
}
.slider-header-sub {
  color: var(--color-neutral-100);
  font-size: 1.6em;
}

/* Footer within circle */
.vertical-slider__footer {
  color: var(--color-electric);
  text-align: center;
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 1.2em;
  line-height: 1.3;
}

/* Center card wrap inside circle */
.vertical-slider__content-wrap {
  width: 28em;
  height: 16em;
  flex: none;
}
.vertical-slider__list {
  height: 100%;
}

/* Make demo card in vertical slider render horizontally */
.about-map__outline .demo-card {
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1.5em;
  border-radius: 1.5em;
  background-color: var(--color-neutral-800);
  border: 1px solid var(--color-neutral-600);
  gap: 1em;
}

.demo-card__top {
  display: flex;
  gap: 0.5em;
}

.demo-card__middle {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5em;
  text-align: left;
}

.about-map__outline .demo-card__image-placeholder {
  width: 10em;
  height: 100%;
  flex-grow: 0;
  margin: 0;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ff9d00;
  font-weight: bold;
  font-size: 1em;
}

/* Active vertical slide styles */
[data-vertical-slider-item-status="active"] .demo-card {
  background-color: var(--color-electric) !important;
  border-color: var(--color-electric) !important;
  color: var(--color-neutral-900) !important;
}

[data-vertical-slider-item-status="active"] .demo-card .transitions__card-title,
[data-vertical-slider-item-status="active"] .demo-card .demo-card__description {
  color: var(--color-neutral-900) !important;
}

[data-vertical-slider-item-status="active"] .demo-card .demo-card__tag {
  background-color: var(--color-neutral-900) !important;
  color: var(--color-electric) !important;
}

/* Adjust layout of controls to be on the right side of the circle */
.vertical-slider-container {
  position: relative;
}
.vertical-slider__controls-wrap {
  position: absolute;
  right: 2em;
  top: 50%;
  transform: translateY(-50%);
}
.vertical-slider__controls {
  flex-direction: column;
  align-items: center;
  margin: 0;
}
.vertical-slider__bullets {
  flex-direction: column;
}
.vertical-slider__bullet-item-line {
  width: 2px;
  height: 2em;
  transform: scale(1, 0.6);
}
[data-vertical-slider-bullet="active"] .vertical-slider__bullet-item-line {
  transform: scale(1, 1);
}
```
