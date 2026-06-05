# Specification: Phase 2 Message Overwhelming Cards

This design specification details the layout, styling, and GSAP scroll-driven animations for the problem cards inside the Message Overwhelming section in `overwhelming.html`.

## 1. Goal Description
To replace the static placeholder text in the center of the physics container with three dynamic cards describing typical director/manager problems. These cards will transition on scroll and feature surrounding messy giant emojis that animate uniquely per card.

## 2. HTML & CSS Design

### A. DOM Structure
The cards container sits in `.overwhelming-center-content` with `z-index: 10` (above the falling physics bubbles, which are at `z-index: 5` inside `.overwhelming-physics-container`).

```html
<div class="overwhelming-cards-container">
  <!-- Card 1 -->
  <div class="overwhelming-card active" data-card="1">
    <!-- Emojis (positioned absolutely at matching corners) -->
    <div class="messy-element top-left">💻</div>
    <div class="messy-element top-right">🛑</div>
    <div class="messy-element bottom-left">⏳</div>
    <div class="messy-element bottom-right">🚫</div>
    
    <!-- Title with mask parent -->
    <div class="item-title">
      <div>¿Un equipo falla y todo se detiene?</div>
    </div>
    
    <!-- Description with line splits -->
    <div class="item-desc">
      <p>No importa qué tan ocupado esté el día — una computadora que no prende lo frena todo. Mientras no hay quien lo resuelva, esa persona no trabaja y tú no puedes hacer nada al respecto.</p>
    </div>
  </div>

  <!-- Card 2 -->
  <div class="overwhelming-card" data-card="2">
    <div class="messy-element top-left">🤷</div>
    <div class="messy-element top-right">❓</div>
    <div class="messy-element bottom-left">🔧</div>
    <div class="messy-element bottom-right">🔄</div>
    
    <div class="item-title">
      <div>¿No sabes si ya quedó la laptop?</div>
    </div>
    
    <div class="item-desc">
      <p>El técnico pasó, dijo que ya estaba listo, y al día siguiente volvió a fallar. Sin un seguimiento claro, nunca sabes si el problema realmente se resolvió o solo se pospuso.</p>
    </div>
  </div>

  <!-- Card 3 -->
  <div class="overwhelming-card" data-card="3">
    <div class="messy-element top-left">📅</div>
    <div class="messy-element top-right">⚠️</div>
    <div class="messy-element bottom-left">⏰</div>
    <div class="messy-element bottom-right">💣</div>
    
    <div class="item-title">
      <div>¿Sabes cuándo tocan los mantenimientos?</div>
    </div>
    
    <div class="item-desc">
      <p>La mayoría de los problemas técnicos no llegan de sorpresa — se acumulan. Equipos sin mantenimiento, sin historial, sin fechas claras. Cuando algo truena, ya era tarde para prevenirlo.</p>
    </div>
  </div>
</div>
```

### B. Layout Styling
- `.overwhelming-cards-container`: `width: 50vw; height: 50vh;` on desktop (centered via flex alignment in `.overwhelming-sticky`).
- `.overwhelming-card`: `position: absolute; inset: 0; background: rgba(255, 255, 255, 0.9); border-radius: 32px; backdrop-filter: blur(20px); border: 1px solid rgba(0,0,0,0.06); padding: 3em; overflow: visible; display: flex; flex-direction: column; justify-content: center;`
- `.item-title`: `overflow: hidden; width: 100%;`
- `.item-title > div`: `transform-origin: 0% 100%; display: inline-block;`
- `.messy-element`: `position: absolute; font-size: 5rem;` with custom positioning per anchor (e.g. `top: -40px; left: -40px;`).

---

## 3. GSAP Animation & Scroll Sequence

### A. Title Mask Sweep
- Initial state: `yPercent: 105, rotate: 15, transformOrigin: "0% 100%"`
- Target state: `yPercent: 0, rotate: 0, duration: 1.4, ease: "power3.out"`

### B. Paragraph Stagger
- Use `SplitType` on `.item-desc p` for lines and words.
- Stagger entry using `yPercent` transitions from `100% -> 0%`.

### C. Themed Emojis Entrance/Exit
- **Card 1 Emojis**: Drop in vertically from top with elastic bounce on load. Exit outward.
- **Card 2 Emojis**: Rotation spin entrance. Drop down exit.
- **Card 3 Emojis**: Scale pop entrance with elastic overshoot. Explode outward exit.

### D. ScrollTrigger Mapping
The animations scrub dynamically on `.overwhelming-track` (height `300vh`):
- **Scroll [0.0 - 0.25]**: Card 1 is active (Title revealed, paragraph words visible, emojis in place).
- **Scroll [0.25 - 0.35]**: Card 1 exits (fades out, scales down, emojis translate away).
- **Scroll [0.35 - 0.45]**: Card 2 enters (fades in, scales up, title sweeps in, words stagger, emojis spin).
- **Scroll [0.45 - 0.65]**: Card 2 is active.
- **Scroll [0.65 - 0.75]**: Card 2 exits (fades out, scales down, emojis drop down).
- **Scroll [0.75 - 0.85]**: Card 3 enters (fades in, scales up, title sweeps in, words stagger, emojis pop).
- **Scroll [0.85 - 1.0]**: Card 3 is active.
