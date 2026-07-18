# Osmo Sliders Sandbox Implementation Plan (Focus on Resources Slider)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a purple box placeholder on the left and clip overflowing cards outside the circle vertical slider.

---

### Task 1: Update React Entrypoint

**Files:**
- Modify: `src/resources-slider-entry.jsx`

- [ ] **Step 1: Add the purple box placeholder**
In `src/resources-slider-entry.jsx`, prepend a `<div className="about-us-placeholder" />` inside the `.vertical-slider-container` before the `.about-map-section`.
```javascript
  return (
    <div className="sandbox-container">
      <h1 style={{ display: "none" }}>Osmo Sliders Sandbox</h1>
      
      {/* Vertical Updates Section */}
      <section className="sandbox-section">
        <div data-vertical-slider="true" className="vertical-slider-container">
          
          {/* Purple Placeholder on the Left */}
          <div className="about-us-placeholder" />
          
          <div className="about-map-section">
            <div className="about-map__outline">
              <div className="vertical-slider__header">
                <span className="slider-header-tag">Latest updates</span>
                ...
```

---

### Task 2: Update Sandbox Stylesheet

**Files:**
- Modify: `resources-slider/slider-sandbox.css`

- [ ] **Step 1: Add overflow and placeholder styles**
Modify `resources-slider/slider-sandbox.css` to add `overflow: hidden` to `.about-map__outline` and styling for the purple box:
```css
/* Circular container settings */
.about-map__outline {
  width: 44em !important;
  height: 44em !important;
  background-color: var(--color-neutral-900);
  border: 1px solid var(--color-neutral-600);
  border-radius: 50%;
  overflow: hidden; /* Clips non-active cards */
  flex-direction: column;
  justify-content: space-between;
  padding: 3em 0;
  box-sizing: border-box;
}

/* Purple about-us box placeholder */
.about-us-placeholder {
  width: 36em;
  height: 44em;
  background-color: #5d3fd3; /* Purple background */
  border-radius: 2.5em;
  flex-shrink: 0;
}
```
