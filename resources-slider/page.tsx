"use client";

import React, { useEffect } from "react";
import "./slider-sandbox.css";
import { initOsmoSlider, initVerticalSlider } from "./slider-animations";

export default function ResourcesSliderPage() {
  useEffect(() => {
    // Dynamically load GSAP and Draggable
    const loadGSAP = async () => {
      try {
        // Load scripts from CDN for the vanilla sandbox
        const gsapScript = document.createElement("script");
        gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        gsapScript.async = true;
        document.body.appendChild(gsapScript);

        gsapScript.onload = () => {
          const draggableScript = document.createElement("script");
          draggableScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Draggable.min.js";
          draggableScript.async = true;
          document.body.appendChild(draggableScript);

          draggableScript.onload = () => {
            // Register Draggable plugin
            const w = window as any;
            if (w.gsap && w.Draggable) {
              w.gsap.registerPlugin(w.Draggable);
              initOsmoSlider();
              initVerticalSlider();
            }
          };
        };
      } catch (err) {
        console.error("Failed to load GSAP:", err);
      }
    };

    loadGSAP();
  }, []);

  return (
    <div className="sandbox-container">
      <h1 style={{ display: "none" }}>Osmo Sliders Sandbox</h1>
      
      {/* Horizontal Slider Section */}
      <section className="sandbox-section">
        <h2 className="sandbox-section-title">Latest Updates from Osmo</h2>
        
        {/* Osmo Slider Container */}
        <div data-gsap-slider-init="updates" data-gsap-slider-rotate="true" className="product-slider">
          <div data-gsap-slider-collection="true" className="gsap-slider__collection">
            <div data-gsap-slider-list="true" className="gsap-slider__list">
              
              {/* Card Items (Minimum 7 cards) */}
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div 
                  key={num} 
                  data-gsap-slider-item="true" 
                  className="gsap-slider__item"
                >
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

          {/* Controls */}
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
          
          {/* Globe graphic on left */}
          <div className="about-map-section">
            <div className="about-map__outline">
              <svg viewBox="0 0 100 100" className="globe-svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-neutral-400)" strokeWidth="1" />
                <path d="M 5,50 A 45,45 0 0,0 95,50" fill="none" stroke="var(--color-neutral-400)" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M 50,5 A 45,45 0 0,0 50,95" fill="none" stroke="var(--color-neutral-400)" strokeWidth="0.5" strokeDasharray="3 3" />
                {/* Pointer / dot indicator */}
                <circle cx="50" cy="5" r="4" fill="var(--color-electric)" />
              </svg>
            </div>
          </div>

          {/* Testimonial slider on right */}
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

            {/* Bullets & controls */}
            <div className="vertical-slider__controls">
              <button data-prev="true" className="gsap-slider__control">↑ Prev</button>
              
              <div className="vertical-slider__bullets">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <button 
                    key={idx} 
                    data-vertical-slider-bullet={idx === 0 ? "active" : "not-active"} 
                    className="vertical-slider__bullet"
                  >
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
