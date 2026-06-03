import { gsap } from 'gsap';

let navTimeline = null;

export function initNavAnimations(isInitialLoad = false, isNavTriggered = false) {
  const nav = document.querySelector('.nav-bar__wrap');
  const marquee = document.querySelector('.under-nav-bar');

  if (!nav) return;

  // Reset scrolled state classes / attributes to defaults
  const navContainer = document.querySelector('.nav');
  if (navContainer) {
    navContainer.setAttribute('data-scrolling-started', 'false');
    navContainer.setAttribute('data-scrolling-direction', 'up');
  }
  document.querySelectorAll('[data-scrolling-started]').forEach(el => {
    el.setAttribute('data-scrolling-started', 'false');
  });

  if (navTimeline) {
    navTimeline.kill();
  }

  navTimeline = gsap.timeline();

  // If navigated via navbar, do NOT run the slide down entrance on the nav capsule itself.
  // It remains statically positioned at y: 0.
  if (isNavTriggered) {
    gsap.set(nav, { yPercent: 0, y: 0 });
  } else {
    // Set initial state off-screen above the viewport
    gsap.set(nav, { yPercent: -150 });
    
    // Animate sliding down with a premium magnetic easing
    navTimeline.to(nav, {
      yPercent: 0,
      duration: 0.8,
      ease: 'back.out(1.15)', // Custom back/magnetic ease
    }, 0);
  }

  // Always animate the marquee because it is inside the Barba container and gets reloaded.
  if (marquee) {
    gsap.set(marquee, { opacity: 0, y: -20 });
    navTimeline.to(marquee, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, isNavTriggered ? 0.1 : 0.45); // Start slightly later if nav itself is not animating
  }
}

export function killNavAnimations() {
  if (navTimeline) {
    navTimeline.kill();
    navTimeline = null;
  }
}
