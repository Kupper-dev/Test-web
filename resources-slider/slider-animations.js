// Osmo Sliders Animations (GSAP Vanilla Scripts)

export function initOsmoSlider() {
  // Keeping helper in case needed later, but not currently used on page
  if (typeof window === "undefined" || !window.gsap || !window.Draggable) return;
  const gsap = window.gsap;
  const Draggable = window.Draggable;

  document.querySelectorAll("[data-gsap-slider-init]").forEach(container => {
    if (container._sliderDraggable) container._sliderDraggable.kill();
    if (container._sliderTimeline) container._sliderTimeline.kill();

    const collection = container.querySelector("[data-gsap-slider-collection]");
    const list = container.querySelector("[data-gsap-slider-list]");
    const items = Array.from(container.querySelectorAll("[data-gsap-slider-item]"));
    const controls = Array.from(container.querySelectorAll("[data-gsap-slider-control]"));
    const totalSlideLabel = container.querySelector("[data-gsap-slider-total-slide]");
    const activeSlideLabels = Array.from(container.querySelectorAll("[data-gsap-slider-active-slide]"));

    if (!items.length || !list) return;

    if (totalSlideLabel) {
      const len = items.length;
      totalSlideLabel.textContent = len < 10 ? "0" + len : String(len);
    }

    const useRotate = container.hasAttribute("data-gsap-slider-rotate");
    const gap = parseFloat(getComputedStyle(container).getPropertyValue("--slider-gap")) || 0;
    const cardWidth = items[0].getBoundingClientRect().width;
    const stepWidth = cardWidth + gap;

    let activeIndex = 0;
    gsap.set(list, { width: items.length * stepWidth });

    const updateActiveState = (index) => {
      activeIndex = (index + items.length) % items.length;
      const activeText = (activeIndex + 1) < 10 ? "0" + (activeIndex + 1) : String(activeIndex + 1);
      activeSlideLabels.forEach(lbl => {
        lbl.textContent = activeText;
      });

      items.forEach((item, i) => {
        const isCurrent = i === activeIndex;
        item.setAttribute("data-gsap-slider-item-status", isCurrent ? "active" : "not-active");
      });

      controls.forEach(ctrl => {
        const action = ctrl.getAttribute("data-gsap-slider-control");
        if (action === "prev" && activeIndex === 0) {
          ctrl.setAttribute("data-gsap-slider-control-status", "not-active");
        } else if (action === "next" && activeIndex === items.length - 1) {
          ctrl.setAttribute("data-gsap-slider-control-status", "not-active");
        } else {
          ctrl.setAttribute("data-gsap-slider-control-status", "active");
        }
      });
    };

    updateActiveState(activeIndex);

    const setListPosition = (xPos) => {
      gsap.set(list, { x: xPos });
      if (useRotate) {
        items.forEach((item, i) => {
          const itemOffset = (i * stepWidth) + xPos;
          const rotateAngle = (itemOffset / stepWidth) * -8;
          gsap.set(item, { rotate: rotateAngle, transformOrigin: "50% 300%" });
        });
      }
    };

    setListPosition(0);

    const dragInstance = Draggable.create(list, {
      type: "x",
      edgeResistance: 0.85,
      bounds: { minX: -(items.length - 1) * stepWidth, maxX: 0 },
      inertia: true,
      onDrag: function() {
        setListPosition(this.x);
      },
      onThrowUpdate: function() {
        setListPosition(this.x);
      },
      onDragEnd: function() {
        const nearestIndex = Math.round(-this.x / stepWidth);
        const targetX = -nearestIndex * stepWidth;
        
        gsap.to(list, {
          x: targetX,
          duration: 0.4,
          ease: "power2.out",
          onUpdate: () => {
            setListPosition(gsap.getProperty(list, "x"));
          },
          onComplete: () => {
            updateActiveState(nearestIndex);
          }
        });
      }
    })[0];

    container._sliderDraggable = dragInstance;

    controls.forEach(ctrl => {
      const clickHandler = () => {
        const action = ctrl.getAttribute("data-gsap-slider-control");
        let targetIndex = activeIndex;
        if (action === "prev" && activeIndex > 0) {
          targetIndex--;
        } else if (action === "next" && activeIndex < items.length - 1) {
          targetIndex++;
        }

        if (targetIndex !== activeIndex) {
          const targetX = -targetIndex * stepWidth;
          gsap.to(list, {
            x: targetX,
            duration: 0.6,
            ease: "expo.out",
            onUpdate: () => {
              setListPosition(gsap.getProperty(list, "x"));
            },
            onComplete: () => {
              updateActiveState(targetIndex);
            }
          });
        }
      };
      ctrl.addEventListener("click", clickHandler);
      if (!container._cleanupListeners) container._cleanupListeners = [];
      container._cleanupListeners.push(() => ctrl.removeEventListener("click", clickHandler));
    });
  });
}

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

    // Animating strictly on Y/Z translations, NO rotationX (spinning)
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

    // Setup initial positions
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
