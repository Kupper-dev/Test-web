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
