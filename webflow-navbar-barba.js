<script>
/**
 * Webflow GSAP Navbar & Barba.js Integration
 * 
 * Instructions:
 * 1. Add `data-barba="wrapper"` to your <body> tag.
 * 2. Add `data-barba="container"` and `data-barba-namespace="home"` (or other page slug) to your main content wrapper (e.g. your `.main-content` wrapper).
 * 3. Keep your `.nav` capsule outside the `data-barba="container"` so it persists and never reloads.
 * 4. Ensure you have a `.transition` element (e.g., a black full-screen div with fixed positioning, opacity 0, pointer-events none) for the page transition wipe.
 * 5. Put this code in Webflow before the closing </body> tag or host it as a script.
 */

(function() {
  // ======= Configuration & CDN URLs =======
  const LENIS_CDN = "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js";
  const GSAP_CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
  const BARBA_CDN = "https://cdn.jsdelivr.net/npm/@barba/core@2.9.7/dist/barba.umd.js";

  // Helper to dynamically load external scripts if not present
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Load all dependencies then run initialization
  Promise.all([
    window.Lenis ? Promise.resolve() : loadScript(LENIS_CDN),
    window.gsap ? Promise.resolve() : loadScript(GSAP_CDN),
    window.barba ? Promise.resolve() : loadScript(BARBA_CDN)
  ]).then(() => {
    initApp();
  }).catch(err => {
    console.error("Error loading dependencies for Webflow animation script:", err);
  });

  function initApp() {
    const gsap = window.gsap;
    const barba = window.barba;
    const Lenis = window.Lenis;

    // ────────────────────────────────────────────────────────
    // 0. Inject Missing Animation CSS Styles
    // ────────────────────────────────────────────────────────
    const styleEl = document.createElement('style');
    styleEl.id = 'webflow-navbar-integration-styles';
    styleEl.textContent = `
      :root {
        --cubic-default: cubic-bezier(0.625, 0.05, 0, 1);
        --animation-ease: 0.25s ease;
        --animation-default: 0.6s cubic-bezier(0.625, 0.05, 0, 1);
        --animation-default-onehalf: 0.9s cubic-bezier(0.625, 0.05, 0, 1);
        --animation-default-half: 0.3s cubic-bezier(0.625, 0.05, 0, 1);
        --_dev---black: #131212;
        --_dev---white: #F5F5F5;
        --_dev---blue-1: #2051ff;
        --nav-bar-height: 4.625em;
        --nav-bar-max-width-small: 38em;

        /* ================================================= */
        /* ======= NAVBAR COLOR CONFIGURATION PANEL ======== */
        /* ================================================= */
        --nav-bg-scrolled: #FAFBFC;       /* Background color when scrolling down */
        --nav-outline-scrolled: #ffffff;  /* Outline border color when scrolling down */
        --nav-bg-active: hsla(227, 91.49%, 3.13%, 0.88); /* Background when menu is open */
        --nav-outline-active: #131212;    /* Outline border when menu is open */
        /* ================================================= */
      }

      .nav__bg {
        transition: opacity var(--animation-default), visibility var(--animation-default) !important;
      }
      [data-nav-status="active"] .nav__bg {
        opacity: 1 !important;
        visibility: visible !important;
      }

      .nav-bar {
        transition: max-width var(--animation-default-onehalf) 0.2s !important;
      }
      [data-nav-status="active"] .nav-bar {
        transition: max-width var(--animation-default) 0s !important;
        max-width: 100% !important;
      }

      .nav-bar__back {
        transition: all var(--animation-default) !important;
      }
      [data-scrolling-started="true"] .nav-bar__back {
        inset: 0.1875em !important;
      }
      @media screen and (max-width: 767px) {
        .nav-bar__back { inset: 0.5em !important; }
        [data-scrolling-started][data-nav-status="active"] .nav-bar__back {
          inset: -0.25em 0em !important;
        }
      }

      .nav-bar__bg {
        transition: background-color var(--animation-default) !important;
      }
      [data-scrolling-started="true"] .nav-bar__bg {
        background-color: var(--nav-bg-scrolled) !important;
      }
      [data-nav-status="active"] .nav-bar__bg {
        background-color: var(--nav-bg-active) !important;
      }

      .nav-bar__outline {
        transition: background-color var(--animation-default) !important;
      }
      [data-scrolling-started="true"] .nav-bar__outline {
        background-color: var(--nav-outline-scrolled) !important;
      }
      [data-nav-status="active"] .nav-bar__outline {
        background-color: var(--nav-outline-active) !important;
      }

      .nav-menu {
        transition: color var(--animation-default) !important;
      }
      [data-scrolling-started="true"] .nav-menu {
        color: var(--_dev---black) !important;
      }
      [data-nav-status="active"] .nav-menu {
        color: var(--_dev---white) !important;
      }

      .nav-menu__hamburger-bar {
        transition: transform var(--animation-default) !important;
      }
      [data-nav-status="active"] .nav-menu__hamburger-bar:nth-child(1) {
        transform: translateY(0.15em) rotate(-45deg) scaleX(0.75) !important;
      }
      [data-nav-status="active"] .nav-menu__hamburger-bar:nth-child(2) {
        transform: translateY(-0.15em) rotate(45deg) scaleX(0.75) !important;
      }

      .nav-logo__wordmark-svg {
        transition: transform var(--animation-default), opacity var(--animation-default-half) 0.15s !important;
      }
      [data-scrolling-started="true"] .nav-logo__wordmark-svg {
        transform: translateY(0.75em) rotate(0.001deg) !important;
        opacity: 0 !important;
      }
      [data-scrolling-started][data-nav-status="active"] .nav-logo__wordmark-svg {
        transform: translateY(0em) rotate(0.001deg) !important;
        opacity: 1 !important;
      }

      .nav-logo__icon-svg {
        transition: transform var(--animation-default), opacity var(--animation-default-half) 0.15s !important;
      }
      [data-scrolling-started="true"] .nav-logo__icon-svg {
        transform: translateY(0em) rotate(0.001deg) !important;
        opacity: 1 !important;
      }
      [data-scrolling-started][data-nav-status="active"] .nav-logo__icon-svg {
        transform: translateY(-0.75em) rotate(0.001deg) !important;
        opacity: 0 !important;
      }

      .nav-buttons__default {
        transition: transform var(--animation-default), opacity var(--animation-default-half) 0.15s !important;
      }
      [data-scrolling-started="true"] .nav-buttons__default {
        transform: translateY(0.75em) rotate(0.001deg) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      [data-scrolling-started][data-nav-status="active"] .nav-buttons__default {
        transform: translateY(0em) rotate(0.001deg) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }

      .nav-buttons__scrolled {
        transition: transform var(--animation-default), opacity var(--animation-default-half) 0.15s !important;
      }
      [data-scrolling-started="true"] .nav-buttons__scrolled {
        transform: translateY(-50%) rotate(0.001deg) !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }
      [data-scrolling-started][data-nav-status="active"] .nav-buttons__scrolled {
        transform: translateY(calc(-50% - 0.75em)) rotate(0.001deg) !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      .nav-bar__bottom {
        display: grid !important;
        grid-template-rows: 0fr !important;
        overflow: hidden !important;
        transition: grid-template-rows var(--animation-default) 0s !important;
      }
      [data-nav-status="active"] .nav-bar__bottom {
        grid-template-rows: 1fr !important;
        transition: grid-template-rows var(--animation-default-onehalf) 0.3s !important;
      }
      @media screen and (max-width: 767px) {
        .nav-bar__bottom {
          transform: translateY(-0.625em) rotate(0.001deg) !important;
          transition: grid-template-rows var(--animation-default) 0s, transform var(--animation-default) 0s !important;
        }
        [data-nav-status="active"] .nav-bar__bottom {
          transform: translateY(0em) rotate(0.001deg) !important;
          transition: grid-template-rows var(--animation-default-onehalf) 0.3s, transform var(--animation-default) 0.3s !important;
        }
      }

      .nav-bar__bottom-row>* {
        transition: transform var(--animation-default) 0s !important;
        transform: translateY(2em) rotate(0.001deg);
      }
      .nav-bar__bottom-row>*:nth-child(2) {
        transition: transform var(--animation-default) 0.075s !important;
      }
      .nav-bar__bottom-row>*:nth-child(3) {
        transition: transform var(--animation-default) 0.15s !important;
      }
      [data-nav-status="active"] .nav-bar__bottom-row>* {
        transition: transform var(--animation-default-onehalf) 0.3s !important;
        transform: translateY(0em) rotate(0.001deg) !important;
      }
      [data-nav-status="active"] .nav-bar__bottom-row>*:nth-child(2) {
        transition: transform var(--animation-default-onehalf) 0.375s !important;
        transform: translateY(0em) rotate(0.001deg) !important;
      }
      [data-nav-status="active"] .nav-bar__bottom-row>*:nth-child(3) {
        transition: transform var(--animation-default-onehalf) 0.45s !important;
        transform: translateY(0em) rotate(0.001deg) !important;
      }

      .under-nav-bar {
        transition: transform var(--animation-default), opacity var(--animation-default) !important;
      }
      body:has([data-nav-status="active"]) .under-nav-bar,
      body:has([data-scrolling-started="true"]) .under-nav-bar {
        transform: translateY(-2em) scale(0.975) rotate(0.001deg) !important;
        transition: transform var(--animation-default), opacity var(--animation-default) !important;
      }
      body:has([data-scrolling-started="true"]) .marquee-css__list,
      body:has([data-nav-status="active"]) .marquee-css__list {
        animation-play-state: paused !important;
      }

      .marquee-css__list {
        animation: translateX 30s linear infinite !important;
        animation-duration: inherit !important;
      }

      @keyframes translateX {
        to {
          transform: translateX(-100%);
        }
      }
    `;
    document.head.appendChild(styleEl);

    // ────────────────────────────────────────────────────────
    // 1. Lenis Smooth Scroll Setup
    // ────────────────────────────────────────────────────────
    const lenis = new Lenis({
      lerp: 0.165,
      wheelMultiplier: 1.25,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    window.lenis = lenis; // Expose globally

    // ────────────────────────────────────────────────────────
    // 2. Navigation Elements & Actions
    // ────────────────────────────────────────────────────────
    const nav = document.querySelector('.nav') || document.querySelector('nav');
    const menuLabel = document.querySelector('.nav-menu__label');
    const navBarBottom = document.querySelector('.nav-bar__bottom');

    // Make sure nav and body have default status attributes if not set in Webflow
    if (nav) {
      if (!nav.hasAttribute('data-nav-status')) nav.setAttribute('data-nav-status', 'not-active');
      if (!nav.hasAttribute('data-scrolling-started')) nav.setAttribute('data-scrolling-started', 'false');
      if (!nav.hasAttribute('data-scrolling-direction')) nav.setAttribute('data-scrolling-direction', 'up');
    }
    if (!document.body.hasAttribute('data-scrolling-started')) {
      document.body.setAttribute('data-scrolling-started', 'false');
    }

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

    // Event delegation for clicks on toggle/close buttons
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-nav-toggle="toggle"]') || e.target.closest('.nav-menu');
      const closeBtn = e.target.closest('[data-nav-toggle="close"]') || e.target.closest('.nav__bg');

      if (toggleBtn) {
        e.preventDefault();
        toggleNavigation();
      } else if (closeBtn) {
        e.preventDefault();
        closeNavigation();
      }
    });

    // Escape key to close navigation menu
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeNavigation();
      }
    });

    // ────────────────────────────────────────────────────────
    // 3. Scroll & Scroll-Direction Detection (Lenis-Native)
    // ────────────────────────────────────────────────────────
    function resetScrollState() {
      document.body.setAttribute('data-scrolling-started', 'false');
      if (nav) {
        nav.setAttribute('data-scrolling-started', 'false');
        nav.setAttribute('data-scrolling-direction', 'up');
      }
    }

    lenis.on('scroll', ({ scroll, direction }) => {
      const scrolled = scroll > 50;
      document.body.setAttribute('data-scrolling-started', scrolled ? 'true' : 'false');
      if (nav) {
        nav.setAttribute('data-scrolling-started', scrolled ? 'true' : 'false');
        nav.setAttribute('data-scrolling-direction', direction === 1 ? 'down' : 'up');
      }
    });

    // ────────────────────────────────────────────────────────
    // 4. Navbar Slide-In / Entry Animations
    // ────────────────────────────────────────────────────────
    let navTimeline = null;

    function initNavAnimations(isNavTriggered = false) {
      const navBarWrap = document.querySelector('.nav-bar__wrap');
      const marquee = document.querySelector('.under-nav-bar');

      if (!navBarWrap) return;

      resetScrollState();

      if (navTimeline) {
        navTimeline.kill();
      }

      navTimeline = gsap.timeline();

      if (isNavTriggered) {
        gsap.set(navBarWrap, { yPercent: 0, y: 0 });
      } else {
        gsap.set(navBarWrap, { yPercent: -200, y: 0 });
        navTimeline.to(navBarWrap, {
          yPercent: 0,
          y: 0,
          duration: 0.85,
          ease: 'back.out(1.2)',
        }, 0);
      }

      if (marquee) {
        gsap.set(marquee, { opacity: 0, y: -20 });
        navTimeline.to(marquee, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, isNavTriggered ? 0.1 : 0.45);
      }
    }

    function killNavAnimations() {
      if (navTimeline) {
        navTimeline.kill();
        navTimeline = null;
      }
    }

    // ────────────────────────────────────────────────────────
    // 5. Menu Branch (Tabs) Animations
    // ────────────────────────────────────────────────────────
    let currentBranch = 0;
    let defaultBranch = 0;

    function determineDefaultBranch() {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('branch-2')) return 1;
      if (path.includes('branch-3')) return 2;
      return 0; // Default to Inicio (branch 0)
    }

    function initBranchAnimations() {
      const buttons = document.querySelectorAll('[data-branch-btn]');
      const branches = document.querySelectorAll('[data-branch]');
      if (!buttons.length || !branches.length) return;

      defaultBranch = determineDefaultBranch();
      currentBranch = defaultBranch;

      branches.forEach((branch, index) => {
        if (index !== currentBranch) {
          gsap.set(branch, { autoAlpha: 0, xPercent: 100 });
          branch.classList.remove('is--active');
        } else {
          gsap.set(branch, { autoAlpha: 1, xPercent: 0 });
          branch.classList.add('is--active');
        }
      });

      buttons.forEach((btn, index) => {
        btn.classList.toggle('is--active', index === currentBranch);
        
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', () => switchBranch(index, document.querySelectorAll('[data-branch-btn]'), document.querySelectorAll('[data-branch]')));
        newBtn.addEventListener('mouseenter', () => switchBranch(index, document.querySelectorAll('[data-branch-btn]'), document.querySelectorAll('[data-branch]')));
      });
    }

    function resetToDefaultBranch() {
      const buttons = document.querySelectorAll('[data-branch-btn]');
      const branches = document.querySelectorAll('[data-branch]');
      if (!buttons.length || !branches.length) return;
      
      if (currentBranch !== defaultBranch) {
        switchBranch(defaultBranch, buttons, branches);
      }
    }

    function switchBranch(newIndex, buttons, branches) {
      if (newIndex === currentBranch) return;

      const isForward = newIndex > currentBranch;
      currentBranch = newIndex;

      buttons.forEach((btn, idx) => {
        btn.classList.toggle('is--active', idx === newIndex);
      });

      branches.forEach((branch, index) => {
        const cols = branch.querySelectorAll('.nav-bar__bottom-col');
        const items = branch.querySelectorAll('.nav-bar-link-list-item, .nav-bar__big-li');
        const colsArray = Array.from(cols);
        
        gsap.killTweensOf(branch);
        gsap.killTweensOf(cols);
        gsap.killTweensOf(items);

        if (index === newIndex) {
          branch.classList.add('is--active');
          
          gsap.to(branch, {
            xPercent: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out"
          });

          if (gsap.getProperty(branch, "opacity") < 0.01) {
            gsap.set(cols, { x: isForward ? 40 : -40, opacity: 0 });
            gsap.set(items, { x: isForward ? 30 : -30, opacity: 0 });
          }

          if (!isForward) colsArray.reverse();

          gsap.to(colsArray, {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.1
          });

          gsap.to(items, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.2
          });

        } else if (branch.classList.contains('is--active') || gsap.getProperty(branch, "opacity") > 0) {
          branch.classList.remove('is--active');
          const direction = index < newIndex ? -100 : 100;
          
          gsap.to(branch, {
            xPercent: direction,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power3.out"
          });
        }
      });
    }

    function killBranchAnimations() {
      const branches = document.querySelectorAll('[data-branch]');
      branches.forEach(branch => gsap.killTweensOf(branch));
    }

    // ────────────────────────────────────────────────────────
    // 6. WhatsApp Glowing Letters Effect
    // ────────────────────────────────────────────────────────
    let whatsappGlowTween = null;

    function initWhatsappGlow() {
      const base_color      = '#000000';    
      const active_color    = '#00fc66';    
      const glow_color      = '#a5ff44';    
      const kernel_step     = 0.25;         
      const per_letter_secs = 0.18;         
      const loop_delay_secs = 1.1;          
      const glow_blur_px    = 16;           
      const max_alpha_glow  = 0.55;         
      const easing_sweep    = 'sine.inOut';

      const el = document.querySelector('.button_text_gradient');
      if (!el) return;

      const text = el.textContent.trim() || 'Whatsapp';
      el.innerHTML = '';
      const chars = [];

      for (const ch of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.display = 'inline-block';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        el.appendChild(span);
        chars.push(span);
      }

      const hexToRgb = (hex) => {
        const s = hex.replace('#', '');
        const b = s.length === 3
          ? s.split('').map(c => parseInt(c + c, 16))
          : [s.slice(0, 2), s.slice(2, 4), s.slice(4, 6)].map(h => parseInt(h, 16));
        return { r: b[0], g: b[1], b: b[2] };
      };

      const mixRgb = (a, b, t) => ({
        r: Math.round(a.r + (b.r - a.r) * t),
        g: Math.round(a.g + (b.g - a.g) * t),
        b: Math.round(a.b + (b.b - a.b) * t),
      });

      const rgbStr = (o) => `rgb(${o.r}, ${o.g}, ${o.b})`;
      const rgbaStr = (o, a) => `rgba(${o.r}, ${o.g}, ${o.b}, ${a})`;

      const baseRgb = hexToRgb(base_color);
      const activeRgb = hexToRgb(active_color);
      const glowRgb = hexToRgb(glow_color);

      const setColor = chars.map(ch => gsap.quickSetter(ch, 'color'));
      const setShadow = chars.map(ch => gsap.quickSetter(ch, 'textShadow'));

      const maxDistance = Math.round(1 / kernel_step);
      const weightForDistance = (d) => Math.max(0, 1 - kernel_step * d);

      function shadowForIntensity(intensity) {
        if (intensity <= 0) return 'none';
        const a1 = Math.min(max_alpha_glow, max_alpha_glow * intensity);
        const a2 = a1 * 0.6;
        const a3 = a1 * 0.35;
        const b1 = glow_blur_px * 0.7;
        const b2 = glow_blur_px * 1.4;
        const b3 = glow_blur_px * 2.4;
        return [
          `0 0 ${b1}px ${rgbaStr(glowRgb, a1)}`,
          `0 0 ${b2}px ${rgbaStr(glowRgb, a2)}`,
          `0 0 ${b3}px ${rgbaStr(glowRgb, a3)}`
        ].join(', ');
      }

      const state = { pos: -maxDistance };
      const totalSpan = (chars.length - 1) + 2 * maxDistance;
      const duration = per_letter_secs * totalSpan;

      function render() {
        for (let i = 0; i < chars.length; i++) {
          const d = Math.abs(i - state.pos);
          const w = weightForDistance(d);
          const c = mixRgb(baseRgb, activeRgb, w);
          setColor[i](rgbStr(c));
          setShadow[i](shadowForIntensity(w));
        }
      }

      whatsappGlowTween = gsap.to(state, {
        pos: (chars.length - 1) + maxDistance,
        duration,
        ease: easing_sweep,
        repeat: -1,
        repeatDelay: loop_delay_secs,
        onUpdate: render,
        onRepeat: render
      });

      render();
    }

    function killWhatsappGlow() {
      if (whatsappGlowTween) {
        whatsappGlowTween.kill();
        whatsappGlowTween = null;
      }
    }

    // ────────────────────────────────────────────────────────
    // 7. Navigation Link State Synchronization
    // ────────────────────────────────────────────────────────
    function updateNavLinks(data) {
      const parser = new DOMParser();
      const nextDoc = parser.parseFromString(data.next.html, 'text/html');

      const incomingLinks = nextDoc.querySelectorAll('nav [data-barba-update]');
      const currentLinks = document.querySelectorAll('nav [data-barba-update]');

      currentLinks.forEach((link, idx) => {
        const incomingLink = incomingLinks[idx];
        if (incomingLink) {
          const currentAttr = incomingLink.getAttribute('aria-current');
          if (currentAttr !== null) {
            link.setAttribute('aria-current', currentAttr);
          } else {
            link.removeAttribute('aria-current');
          }
          const className = incomingLink.getAttribute('class') || '';
          link.setAttribute('class', className);
        }
      });
    }

    // Initialize all persistent elements on first visit
    initNavAnimations(false);
    initBranchAnimations();
    initWhatsappGlow();

    // ────────────────────────────────────────────────────────
    // 8. Barba.js Page Transitions Setup
    // ────────────────────────────────────────────────────────
    let nextTransitionWasNavTriggered = false;

    barba.init({
      preventRunning: true,
      prevent: ({ el }) => {
        if (el.getAttribute('href') && el.getAttribute('href').startsWith('#')) {
          return true;
        }
        if (el.hasAttribute('data-barba-prevent')) {
          return true;
        }
        return false;
      },
      transitions: [{
        name: 'page-wipe',

        leave(data) {
          const triggerEl = data.trigger;
          nextTransitionWasNavTriggered = !!(
            triggerEl &&
            typeof triggerEl.closest === 'function' &&
            triggerEl.closest('.nav')
          );

          closeNavigation();
          killWhatsappGlow();
          killNavAnimations();
          killBranchAnimations();

          const done = this.async();
          const timeline = gsap.timeline({ onComplete: done });

          timeline.to('.transition', {
            autoAlpha: 1,
            duration: 0.5,
            ease: 'power1.inOut'
          });

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
          updateNavLinks(data);
          resetScrollState();
        },

        enter(data) {
          const done = this.async();
          lenis.scrollTo(0, { immediate: true });

          const timeline = gsap.timeline({
            onComplete: () => {
              lenis.resize();
              done();
            }
          });

          timeline.to('.transition', {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power1.inOut'
          });

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
          lastScrollY = window.scrollY;
          initNavAnimations(nextTransitionWasNavTriggered);
          initBranchAnimations();
          initWhatsappGlow();
          nextTransitionWasNavTriggered = false;
        }
      }]
    });
  }
})();
</script>