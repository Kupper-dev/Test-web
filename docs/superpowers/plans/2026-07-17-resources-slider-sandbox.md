# Osmo Sliders Sandbox Implementation Plan (Focus on Resources Slider)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplify the sandbox to render only the resources updates vertical slider inside a circular container, removing testimonials, the globe SVG, and card spinning animations.

---

### Task 1: Update React Entrypoint

**Files:**
- Modify: `src/resources-slider-entry.jsx`

- [ ] **Step 1: Clean up src/resources-slider-entry.jsx**
Remove the testimonials section and the SVG globe, keeping only the circular outline containing the updates vertical slider:
```javascript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../resources-slider/slider-sandbox.css';
import { initVerticalSlider } from '../resources-slider/slider-animations';

function App() {
  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      window.gsap = gsap;
      initVerticalSlider();
    });
  }, []);

  return (
    <div className="sandbox-container">
      <h1 style={{ display: "none" }}>Osmo Sliders Sandbox</h1>
      
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

### Task 2: Remove Card Spinning in Script

**Files:**
- Modify: `resources-slider/slider-animations.js`

- [ ] **Step 1: Edit resources-slider/slider-animations.js**
Modify `initVerticalSlider()` to animate cards strictly on the Y-axis and opacity (setting `rotationX` to `0` / removing it):
```javascript
export function initVerticalSlider() {
  if (typeof window === "undefined" || !window.gsap) return;

  const gsap = window.gsap;

  document.querySelectorAll("[data-vertical-slider]").forEach(container => {
    const list = container.querySelector("[data-vertical-slider-list]");
    if (!list) return;

    const items = Array.from(container.querySelectorAll("[data-vertical-slider-item]"));
    if (items.length < 5) return;

    const prevBtn = container.querySelector("[data-prev]");
    const nextBtn = container.querySelector("[data-next]");
    const bullets = Array.from(container.querySelectorAll("[data-vertical-slider-bullet]"));

    const isMobile = window.innerWidth < 768;
    const yVal = isMobile ? 30 : 25;
    const zVal = isMobile ? 20 : 15;

    const states = {
      "-2": { y: `${yVal}em`, z: `-${zVal}em`, opacity: 0 },
      "-1": { y: `${yVal}em`, z: `-${zVal}em`, opacity: 0.7 },
      "0":  { y: "0em",       z: "0em",       opacity: 1 },
      "1":  { y: `-${yVal}em`, z: `-${zVal}em`, opacity: 0.7 },
      "2":  { y: `-${yVal}em`, z: `-${zVal}em`, opacity: 0 }
    };

    let activeIndex = 0;
    let isAnimating = false;

    const getRelativeStateIndex = (itemIndex, activeIdx) => {
      const len = items.length;
      let diff = ((itemIndex - activeIdx) % len + len) % len;
      if (diff > Math.floor(len / 2)) {
        diff -= len;
      }
      return Math.max(-2, Math.min(2, diff));
    };

    const updateSlider = (newIndex) => {
      if (isAnimating || newIndex === activeIndex) return;
      isAnimating = true;

      activeIndex = (newIndex + items.length) % items.length;

      bullets.forEach((bullet, idx) => {
        if (idx === activeIndex) {
          bullet.setAttribute("data-vertical-slider-bullet", "active");
        } else {
          bullet.setAttribute("data-vertical-slider-bullet", "not-active");
        }
      });

      items.forEach((item, idx) => {
        const stateKey = String(getRelativeStateIndex(idx, activeIndex));
        const state = states[stateKey] || { y: `-${yVal}em`, z: `-${zVal}em`, opacity: 0 };
        const isCurrent = idx === activeIndex;
        item.setAttribute("data-vertical-slider-item-status", isCurrent ? "active" : "not-active");

        gsap.to(item, {
          y: state.y,
          z: state.z,
          opacity: state.opacity,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => {
            if (idx === items.length - 1) {
              isAnimating = false;
            }
          }
        });
      });
    };

    items.forEach((item, idx) => {
      const stateKey = String(getRelativeStateIndex(idx, activeIndex));
      const state = states[stateKey] || { y: `-${yVal}em`, z: `-${zVal}em`, opacity: 0 };
      const isCurrent = idx === activeIndex;
      item.setAttribute("data-vertical-slider-item-status", isCurrent ? "active" : "not-active");
      
      gsap.set(item, {
        transformOrigin: "50% 50%",
        force3D: true,
        y: state.y,
        z: state.z,
        opacity: state.opacity
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => updateSlider(activeIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => updateSlider(activeIndex + 1));
    }

    bullets.forEach((bullet, idx) => {
      bullet.addEventListener("click", () => updateSlider(idx));
    });
  });
}
```
