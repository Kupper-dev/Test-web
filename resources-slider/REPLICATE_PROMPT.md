# Prompt for Replicating Sliders in test 2 web osmo

You are in `/Users/usuario/Desktop/Kupper/Dev/test 2 web osmo`. The user has copied three files into `resources-slider/`:
1. `page.tsx` (Next.js React Page component)
2. `slider-animations.js` (GSAP vanilla slider animation initializers)
3. `slider-sandbox.css` (Fluid base font scaling & slider CSS styles)

Since this project is a **Vite + React sandbox** (not Next.js), you must set up a custom HTML entry point for the slider page to compile and run under `npm run dev`.

---

## 🛠️ Step-by-Step Integration Plan

### Step 1: Create HTML Entrypoint
Create `resources-slider.html` at the project root:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Osmo Sliders Sandbox</title>
</head>
<body data-scrolling-started="false">
  <div id="root"></div>
  <script type="module" src="/src/resources-slider-entry.jsx"></script>
</body>
</html>
```

### Step 2: Create React Mounting Entrypoint
Create `src/resources-slider-entry.jsx` and translate the Next.js `page.tsx` structure into a clean React mounting component:
```javascript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../resources-slider/slider-sandbox.css';
import { initOsmoSlider, initVerticalSlider } from '../resources-slider/slider-animations';

function App() {
  useEffect(() => {
    // GSAP and Draggable are already in the project package.json dependencies!
    // Simply register the plugins and run the initializers:
    import('gsap').then(({ gsap }) => {
      import('gsap/Draggable').then(({ Draggable }) => {
        gsap.registerPlugin(Draggable);
        // Make them globally available for vanilla scripts
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
      
      {/* Horizontal Slider Section */}
      <section className="sandbox-section">
        <h2 className="sandbox-section-title">Latest Updates from Osmo</h2>
        <div data-gsap-slider-init="updates" data-gsap-slider-rotate="true" className="product-slider">
          <div data-gsap-slider-collection="true" className="gsap-slider__collection">
            <div data-gsap-slider-list="true" className="gsap-slider__list">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div key={num} data-gsap-slider-item="true" className="gsap-slider__item">
                  <div className="demo-card">
                    <span className="demo-card__tag">Resource {num}</span>
                    <div className="demo-card__image-placeholder">
                      <span>✨ Premium Asset {num}</span>
                    </div>
                    <div className="demo-card__bottom">
                      <h3 className="transitions__card-title">Creative Component {num}</h3>
                      <p className="demo-card__description">High-end Webflow & HTML component</p>
                    </div>
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
              <span data-gsap-slider-total-slide>07</span>
            </div>
            <button data-gsap-slider-control="next" className="gsap-slider__control">
              <span className="slider-arrow-text">Next →</span>
            </button>
          </div>
        </div>
      </section>

      {/* Vertical Testimonial Section */}
      <section className="sandbox-section">
        <h2 className="sandbox-section-title">Testimonial Map Globe</h2>
        <div data-vertical-slider="true" className="vertical-slider-container">
          <div className="about-map-section">
            <div className="about-map__outline">
              <svg viewBox="0 0 100 100" className="globe-svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-neutral-400)" strokeWidth="1" />
                <path d="M 5,50 A 45,45 0 0,0 95,50" fill="none" stroke="var(--color-neutral-400)" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M 50,5 A 45,45 0 0,0 50,95" fill="none" stroke="var(--color-neutral-400)" strokeWidth="0.5" strokeDasharray="3 3" />
                <circle cx="50" cy="5" r="4" fill="var(--color-electric)" />
              </svg>
            </div>
          </div>
          <div className="vertical-slider__content-wrap">
            <div data-vertical-slider-list="true" className="vertical-slider__list">
              {[
                { name: "John Doe", text: "Osmo supply has completely transformed how we build Webflow projects. Highly recommend!" },
                { name: "Jane Smith", text: "The premium design aesthetics and smooth animations make our sites look like they cost $50k+." },
                { name: "Alex Johnson", text: "Unbelievable library of code snippets and templates. Dennis and Ilja are genius creators." },
                { name: "Emily Davis", text: "The fluid scaling system makes responsive design automatic. A game changer." },
                { name: "Michael Brown", text: "Cleanest GSAP integrations on the web. Easy to customize and super lightweight." }
              ].map((t, idx) => (
                <div key={idx} data-vertical-slider-item="true" className="vertical-slider__item">
                  <div className="testimonial-card">
                    <p className="testimonial-text">"{t.text}"</p>
                    <span className="testimonial-author">- {t.name}</span>
                  </div>
                </div>
              ))}
            </div>
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

### Step 3: Update Vite Rollup Inputs
In `vite.config.js`, add the new HTML entrypoint:
```javascript
input: {
  main: resolve(__dirname, 'index.html'),
  about: resolve(__dirname, 'about.html'),
  services: resolve(__dirname, 'services.html'),
  devlink: resolve(__dirname, 'devlink.html'),
  lusion: resolve(__dirname, 'lusion.html'),
  ticketsSandbox: resolve(__dirname, 'tickets-sandbox/index.html'),
  overwhelming: resolve(__dirname, 'overwhelming.html'),
  resourcesSlider: resolve(__dirname, 'resources-slider.html'), // <-- Add this line
}
```

### Step 4: Run Dev Server
Launch the server:
`npm run dev`
Visit the page in the browser:
`http://localhost:5173/resources-slider.html`
