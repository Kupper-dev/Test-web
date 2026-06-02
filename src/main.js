import Lenis from 'lenis';
import { gsap } from 'gsap';
import barba from '@barba/core';
import { initAnimations, killAnimations, resetToDefaultBranch } from './animations';

// ───────────────────────────────────────────────
// 1. Lenis Smooth Scroll
// ───────────────────────────────────────────────
const lenis = new Lenis({
  lerp: 0.165,
  wheelMultiplier: 1.25,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
window.lenis = lenis;

// ───────────────────────────────────────────────
// 2. Navigation State Management
// ───────────────────────────────────────────────
// Nav lives inside .global (persistent across transitions)
const nav = document.querySelector('.nav');
const menuLabel = document.querySelector('.nav-menu__label');

function closeNavigation() {
  if (!nav) return;
  nav.setAttribute('data-nav-status', 'not-active');
  document.body.setAttribute('data-nav-status', 'not-active');
  if (menuLabel) menuLabel.textContent = 'Menu';
  lenis.start();
  
  // Reset branch navigation to default branch when menu closes
  resetToDefaultBranch();
}

function toggleNavigation() {
  if (!nav) return;
  const currentStatus = nav.getAttribute('data-nav-status');
  const nextStatus = currentStatus === 'active' ? 'not-active' : 'active';

  nav.setAttribute('data-nav-status', nextStatus);
  document.body.setAttribute('data-nav-status', nextStatus);

  if (nextStatus === 'active') {
    if (menuLabel) menuLabel.textContent = 'Close';
    lenis.stop();
  } else {
    if (menuLabel) menuLabel.textContent = 'Menu';
    lenis.start();
  }
}

// Event delegation for nav toggle/close (persists across Barba transitions)
document.addEventListener('click', (e) => {
  const toggleBtn = e.target.closest('[data-nav-toggle="toggle"]');
  const closeBtn = e.target.closest('[data-nav-toggle="close"]');

  if (toggleBtn) {
    e.preventDefault();
    toggleNavigation();
  } else if (closeBtn) {
    e.preventDefault();
    closeNavigation();
  }
});

// ESC key listener to close menu
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeNavigation();
  }
});

// ───────────────────────────────────────────────
// 3. Scroll Detection
// ───────────────────────────────────────────────
let lastScrollY = window.scrollY;
let isScrolling = false;

function resetScrollState() {
  lastScrollY = 0;
  // Reset scroll attributes on all elements that use them
  document.querySelectorAll('[data-scrolling-started]').forEach(el => {
    el.setAttribute('data-scrolling-started', 'false');
  });
  if (nav) {
    nav.setAttribute('data-scrolling-direction', 'up');
  }
}

window.addEventListener('scroll', () => {
  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (Math.abs(lastScrollY - currentScrollY) >= 10) {
        const scrolled = currentScrollY > 50;

        document.querySelectorAll('[data-scrolling-started]').forEach(el => {
          el.setAttribute('data-scrolling-started', scrolled ? 'true' : 'false');
        });

        if (nav) {
          if (currentScrollY > lastScrollY && scrolled) {
            nav.setAttribute('data-scrolling-direction', 'down');
          } else {
            nav.setAttribute('data-scrolling-direction', 'up');
          }
        }

        lastScrollY = currentScrollY;
      }
      isScrolling = false;
    });
  }
}, { passive: true });

// ───────────────────────────────────────────────
// 4. Barba Link State Updates
// ───────────────────────────────────────────────
function updateNavLinks(data) {
  const parser = new DOMParser();
  const nextDoc = parser.parseFromString(data.next.html, 'text/html');

  // Update elements marked with data-barba-update inside the persistent nav
  const incomingLinks = nextDoc.querySelectorAll('nav [data-barba-update]');
  const currentLinks = document.querySelectorAll('nav [data-barba-update]');

  currentLinks.forEach((link, idx) => {
    const incomingLink = incomingLinks[idx];
    if (incomingLink) {
      // Update aria-current attribute
      const currentAttr = incomingLink.getAttribute('aria-current');
      if (currentAttr !== null) {
        link.setAttribute('aria-current', currentAttr);
      } else {
        link.removeAttribute('aria-current');
      }

      // Update class list
      const className = incomingLink.getAttribute('class') || '';
      link.setAttribute('class', className);
    }
  });
}

// ───────────────────────────────────────────────
// 5. Barba.js Initialization
// ───────────────────────────────────────────────
// With body[data-barba="wrapper"], Barba looks for
// <main data-barba="container"> as the swappable content.
// The .global div (containing nav + transition overlay) is
// a sibling to <main> and is never touched by Barba.

// Initialize animations on first load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

if (!window.location.pathname.includes('devlink')) {
  barba.init({
    preventRunning: true,
    // Prevent Barba from intercepting anchor links and non-page links
    prevent: ({ el }) => {
      // Skip anchor-only links
      if (el.getAttribute('href') && el.getAttribute('href').startsWith('#')) {
        return true;
      }
      // Skip links marked to bypass Barba
      if (el.hasAttribute('data-barba-prevent')) {
        return true;
      }
      return false;
    },
    transitions: [{
      name: 'page-wipe',

      leave(data) {
        // Close navigation menu if open
        closeNavigation();

        // Kill active animations to avoid memory leaks
        killAnimations();

        const done = this.async();

        const timeline = gsap.timeline({
          onComplete: done
        });

        // Animate transition screen in (overlay wipe)
        timeline.to('.transition', {
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power1.inOut'
        });

        // Slide outgoing page content up and scale down
        const currentContent = data.current.container.querySelector('.main-content');
        if (currentContent) {
          timeline.to(currentContent, {
            y: '-2em',
            scale: 0.975,
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power1.inOut'
          }, '<');
        }
      },

      beforeEnter(data) {
        // Update persistent nav links (aria-current, active classes)
        updateNavLinks(data);

        // Reset scroll state for the new page
        resetScrollState();
      },

      enter(data) {
        const done = this.async();

        // Scroll to top immediately before revealing new page
        lenis.scrollTo(0, { immediate: true });

        const timeline = gsap.timeline({
          onComplete: () => {
            // Recalculate Lenis dimensions for new page content
            lenis.resize();
            done();
          }
        });

        // Fade out transition screen
        timeline.to('.transition', {
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power1.inOut'
        });

        // Slide incoming page content in from below
        const incomingContent = data.next.container.querySelector('.main-content');
        if (incomingContent) {
          gsap.set(incomingContent, { y: '-2em', scale: 0.975, autoAlpha: 0 });
          timeline.to(incomingContent, {
            y: '0em',
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'expo.out',
            clearProps: 'transform,opacity'
          }, '<+=0.2');
        }
      },

      afterEnter() {
        // Re-initialize scroll position tracking
        lastScrollY = window.scrollY;

        // Initialize animations for the new page content
        initAnimations();
      }
    }]
  });
}
