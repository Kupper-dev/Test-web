import { gsap } from 'gsap';

let masterTl;
let cardTimelines = [];
let mouseMoveHandler = null;

function createSysCardTimeline() {
  const card = document.querySelector('.system-status-card:not(.service-card):not(.diagnostic-card):not(.congrats-card):not(.tickets-card)');
  if (!card) return null;
  
  const title = card.querySelector('.card-title');
  const subtitle = card.querySelector('.card-subtitle');
  const icon = card.querySelector('.card-icon');
  const progressFill = card.querySelector('.progress-fill');
  const progressText = card.querySelector('.ssc-progress-text');
  const cardBody = card.querySelector('.card-body');

  // New pre-animation state for the entire card
  gsap.set(card, { scale: 0, opacity: 0, transformOrigin: 'center center' });

  gsap.set(title, { y: '100%' });
  gsap.set(subtitle, { y: '100%' });
  gsap.set(icon, { scale: 0, autoAlpha: 0 });
  gsap.set(progressFill, { width: '0%' });
  gsap.set(progressText, { innerText: '0/75' });
  gsap.set(cardBody, { height: 0, opacity: 0 });
  
  const counter = { value: 0 };
  const tl = gsap.timeline({ paused: true });
  
  tl.add("start")
    .to(card, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, "start") // Card pop-in
    .to(title, { y: '0%', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.2")
    .to(cardBody, { height: 'auto', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.2")
    .to(cardBody, { opacity: 1, duration: 0.4 }, "start+=0.2")
    .to(subtitle, { y: '0%', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.3")
    .to(icon, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.5)' }, "start+=0.4")
    .to(progressFill, { width: '100%', duration: 1.5, ease: 'power2.inOut' }, "start+=0.6")
    .to(counter, {
      value: 75,
      duration: 1.5,
      ease: 'power2.inOut',
      onUpdate: function() {
        progressText.innerText = Math.round(counter.value) + '/75';
      }
    }, "<");

  return tl;
}

function createServiceCardTimeline() {
  const card = document.querySelector('.service-card');
  if (!card) return null;
  
  const title = card.querySelector('.card-title');
  const activeVal = card.querySelector('.badge-active span') || card.querySelector('.active-val');
  const resolvedVal = card.querySelector('.badge-resolved span') || card.querySelector('.resolved-val');
  const indicator = card.querySelector('.progress-fill');
  const footerText = card.querySelector('.card-subtitle');
  const badgeActive = card.querySelector('.badge-active');
  const badgeResolved = card.querySelector('.badge-resolved');
  const cardBody = card.querySelector('.card-body');

  gsap.set(card, { scale: 0, opacity: 0, transformOrigin: 'center center' });

  gsap.set(title, { y: '100%' });
  gsap.set(footerText, { y: '100%' });
  // Fix bar width to 50%
  if (indicator) gsap.set(indicator, { width: '50%', xPercent: 0, backgroundColor: '#E53E3E' });
  if (badgeActive) gsap.set(badgeActive, { backgroundColor: '#E53E3E' });
  if (badgeResolved) gsap.set(badgeResolved, { backgroundColor: '#E53E3E' });
  if (cardBody) gsap.set(cardBody, { height: 0, opacity: 0 });
  
  const tl = gsap.timeline({ paused: true });
  const counter = { active: 12, resolved: 12 };

  tl.add("start")
    .to(card, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, "start")
    .to(title, { y: '0%', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.2");
    
  if (cardBody) {
    tl.to(cardBody, { height: 'auto', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.2")
      .to(cardBody, { opacity: 1, duration: 0.4 }, "start+=0.2");
  }
  
  tl.to(footerText, { y: '0%', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.4")
    .to(counter, {
      active: 1,
      resolved: 23,
      duration: 1.2,
      ease: 'expo.inOut',
      onUpdate: function() {
        if (activeVal) activeVal.innerText = Math.round(counter.active);
        if (resolvedVal) resolvedVal.innerText = Math.round(counter.resolved);
      }
    }, "+=0.2");
    
  if (indicator) {
    tl.to(indicator, {
      xPercent: 100,
      backgroundColor: '#4CAF50',
      duration: 1.2,
      ease: 'expo.inOut'
    }, "<");
  }
  
  if (badgeActive) {
    tl.to(badgeActive, {
      backgroundColor: '#DD6B20',
      duration: 1.2,
      ease: 'expo.inOut'
    }, "<");
  }
  
  if (badgeResolved) {
    tl.to(badgeResolved, {
      backgroundColor: '#4CAF50',
      duration: 1.2,
      ease: 'expo.inOut'
    }, "<");
  }

  return tl;
}

function createDiagCardTimeline() {
  const wrapper = document.querySelector('.diagnostic-wrapper');
  if (!wrapper) return null;
  
  const title = wrapper.querySelector('.card-title');
  const icon = wrapper.querySelector('.card-icon');
  const skeletons = wrapper.querySelectorAll('.skeleton-line');
  const button = wrapper.querySelector('.diag-btn');
  const approvedTag = wrapper.querySelector('.diag-approved-tag');
  const cardBody = wrapper.querySelector('.card-body');
  
  gsap.set(wrapper, { scale: 0, opacity: 0, transformOrigin: 'center center' });

  gsap.set(title, { y: '100%' });
  gsap.set(icon, { scale: 0, autoAlpha: 0 });
  gsap.set(skeletons, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(button, { autoAlpha: 0, scale: 0 }); 
  gsap.set(approvedTag, { autoAlpha: 0, scale: 0, rotation: -10 }); 
  gsap.set(cardBody, { height: 0, opacity: 0 });
  
  const tl = gsap.timeline({ paused: true });
  
  tl.add("start")
    .to(wrapper, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, "start")
    .to(title, { y: '0%', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.2")
    .to(cardBody, { height: 'auto', duration: 0.8, ease: 'back.out(1.2)' }, "start+=0.2")
    .to(cardBody, { opacity: 1, duration: 0.4 }, "start+=0.2")
    .to(icon, { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.5)' }, "start+=0.4")
    .add("skeletonStart", "start+=0.5")
    .to(skeletons, {
      scaleX: 1,
      duration: 1.0,
      ease: 'expo.out',
      stagger: 0.15
    }, "skeletonStart")
    .to(button, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.5)'
    }, "skeletonStart+=0.5")
    .to(approvedTag, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    }, "skeletonStart+=0.7");
  
  return tl;
}

function createCongratsCardTimeline() {
  const card = document.querySelector('.congrats-card');
  if (!card) return null;
  const wrapper = card.parentElement;
  
  const iconWrap = card.querySelector('.congrats-icon-wrap');
  const text = card.querySelector('.congrats-text');
  const congratsTag = wrapper.querySelector('.congrats-tag');
  
  gsap.set(wrapper, { scale: 0, opacity: 0, transformOrigin: 'center center' });

  if (iconWrap) gsap.set(iconWrap, { scale: 0 });
  if (text) gsap.set(text, { yPercent: 120, autoAlpha: 0 });
  if (congratsTag) gsap.set(congratsTag, { autoAlpha: 0, scale: 0, rotation: -10 });
  
  const tl = gsap.timeline({ paused: true });
  
  tl.add("start")
  .to(wrapper, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, "start");
  
  if (iconWrap) {
    tl.to(iconWrap, { scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, "start+=0.2");
  }
  
  if (text) {
    tl.to(text, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, "start+=0.3");
  }
  
  if (congratsTag) {
    tl.to(congratsTag, {
      autoAlpha: 1,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      ease: 'back.out(2)'
    }, "start+=0.5");
  }
  
  return tl;
}

function createTicketsCardTimeline() {
  const card = document.querySelector('.tickets-card');
  if (!card) return null;
  
  const title = card.querySelector('.card-title');
  const subtitle = card.querySelector('.card-subtitle');
  const avatars = card.querySelectorAll('.tk-avatar');
  
  gsap.set(card, { scale: 0, opacity: 0, transformOrigin: 'center center' });

  if (title) gsap.set(title, { yPercent: 120 }); 
  if (subtitle) gsap.set(subtitle, { yPercent: 120 }); 
  if (avatars.length) gsap.set(avatars, { x: 60, rotation: 60, autoAlpha: 0 });
  
  const tl = gsap.timeline({ paused: true });
  
  tl.add("start")
  .to(card, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' }, "start");
  
  if (title) {
    tl.to(title, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, "start+=0.2");
  }
  if (subtitle) {
    tl.to(subtitle, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, "-=0.3");
  }
  if (avatars.length) {
    tl.to(avatars, {
      x: 0,
      rotation: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: 'back.out(2)',
      stagger: 0.15
    }, "-=0.3");
  }
  
  return tl;
}

export function initCardAnimations() {
  const tl1 = createSysCardTimeline();
  const tl2 = createServiceCardTimeline();
  const tl3 = createDiagCardTimeline();
  const tl4 = createCongratsCardTimeline();
  const tl5 = createTicketsCardTimeline();

  if (tl1) cardTimelines.push(tl1);
  if (tl2) cardTimelines.push(tl2);
  if (tl3) cardTimelines.push(tl3);
  if (tl4) cardTimelines.push(tl4);
  if (tl5) cardTimelines.push(tl5);

  masterTl = gsap.timeline({ repeat: -1 });

  // Init initial states for 3D spin and images
  gsap.set('.scene-3d', { rotationX: 5, rotationY: -8, rotationZ: -2, transformStyle: 'preserve-3d' });
  gsap.set('.rotor-3d', { rotationY: 0 });
  gsap.set('.front-face .main-image', { yPercent: 0, scale: 1.05 });
  gsap.set('.back-face .main-image', { yPercent: 100, scale: 1 });

  // Mouse Parallax for the main scene
  const scene = document.querySelector('.scene-3d');
  if (scene && !mouseMoveHandler) {
    mouseMoveHandler = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      gsap.to(scene, {
        rotationX: 5 - y * 6, // Base 5 +/- 6 deg
        rotationY: -8 + x * 8, // Base -8 +/- 8 deg
        duration: 0.8,
        ease: 'power2.out'
      });
    };
    window.addEventListener('mousemove', mouseMoveHandler);
  }

  // Add visibility toggles to fix 3D bleed-through when faces are facing backwards
  gsap.set('.front-face .face-center-bounds', { autoAlpha: 1 });
  gsap.set('.back-face .face-center-bounds', { autoAlpha: 0 });

  // --- 12s Master Timeline ---
  // 1. The Flips and Perspective Bobbing
  // Front face is active longer (15% more). Back face is shorter.
  // 0s to 2.0s: Front face is perfectly forward (0deg)
  // 2.0s to 5.0s: Flip from front to back (crosses 90deg at 3.5s)
  masterTl.to('.rotor-3d', { rotationY: 180, duration: 3.0, ease: 'power2.inOut' }, 2.0);
  // 5.0s to 7.0s: Back face is perfectly backward (180deg)
  // 7.0s to 10.0s: Flip from back to front (crosses 270deg at 8.5s)
  masterTl.to('.rotor-3d', { rotationY: 360, duration: 3.0, ease: 'power2.inOut' }, 7.0);
  // 10.0s to 12.0s: Front face is perfectly forward (360deg = 0deg)

  // Floating effect (smoothly up and down for the active face to dramatize 3D perspective)
  masterTl.to('.rotor-3d', { y: -25, duration: 2.0, ease: 'sine.inOut' }, 0); 
  masterTl.to('.rotor-3d', { y: 0, duration: 1.5, ease: 'sine.inOut' }, 2.0); 
  masterTl.to('.rotor-3d', { y: -10, duration: 1.5, ease: 'sine.inOut' }, 5.0); 
  masterTl.to('.rotor-3d', { y: 0, duration: 1.5, ease: 'sine.inOut' }, 7.0); 
  masterTl.to('.rotor-3d', { y: 20, duration: 1.5, ease: 'sine.inOut' }, 8.5); 
  masterTl.to('.rotor-3d', { y: 0, duration: 2.0, ease: 'sine.inOut' }, 10.0); 

  // 2. Strict explicit timeline calls for the Front Face Image
  masterTl.set('.front-face .main-image', { yPercent: 0, scale: 1.05 }, 0);
  masterTl.to('.front-face .main-image', { yPercent: 100, scale: 1, duration: 1.0, ease: 'power2.in' }, 2.5);
  masterTl.set('.front-face .main-image', { yPercent: 100, scale: 1 }, 3.5);
  masterTl.to('.front-face .main-image', { yPercent: 0, scale: 1.05, duration: 1.0, ease: 'power2.out' }, 8.5);

  // 3. Strict explicit timeline calls for the Back Face Image
  masterTl.set('.back-face .main-image', { yPercent: 100, scale: 1 }, 0);
  masterTl.to('.back-face .main-image', { yPercent: 0, scale: 1.05, duration: 1.0, ease: 'power2.out' }, 3.5);
  masterTl.set('.back-face .main-image', { yPercent: 0, scale: 1.05 }, 4.5);
  masterTl.to('.back-face .main-image', { yPercent: 100, scale: 1, duration: 1.0, ease: 'power2.in' }, 7.5);
  masterTl.set('.back-face .main-image', { yPercent: 100, scale: 1 }, 8.5);

  // 4. Hard toggles for face visibility exactly at 90 degrees (t=3.5s and t=8.5s)
  masterTl.set('.front-face .face-center-bounds', { autoAlpha: 1 }, 0);
  masterTl.set('.front-face .face-center-bounds', { autoAlpha: 0 }, 3.5);
  masterTl.set('.front-face .face-center-bounds', { autoAlpha: 1 }, 8.5);

  masterTl.set('.back-face .face-center-bounds', { autoAlpha: 0 }, 0);
  masterTl.set('.back-face .face-center-bounds', { autoAlpha: 1 }, 3.5);
  masterTl.set('.back-face .face-center-bounds', { autoAlpha: 0 }, 8.5);

  // 5. Hide floating cards layout entirely while back face is active (Fixes 5% opacity ghosting)
  masterTl.set('.float-cards-layout', { autoAlpha: 1 }, 0);
  masterTl.set('.float-cards-layout', { autoAlpha: 0 }, 3.5);
  masterTl.set('.float-cards-layout', { autoAlpha: 1 }, 8.5);

  // 6. Floating Cards Exit (At start of flip t=2.0)
  if (tl1) masterTl.call(() => tl1.timeScale(1.8).reverse(), null, 2.0); // 75 Systems
  if (tl2) masterTl.call(() => tl2.timeScale(1.8).reverse(), null, 2.0); // Service
  if (tl4) masterTl.call(() => tl4.timeScale(1.8).reverse(), null, 2.1); // Congrats
  if (tl3) masterTl.call(() => tl3.timeScale(1.8).reverse(), null, 2.2); // Diagnostic
  if (tl5) masterTl.call(() => tl5.timeScale(1.8).reverse(), null, 2.2); // Tickets

  // 7. Floating Cards Entrance (Delayed slightly after 8.5s crossover)
  if (tl3) masterTl.call(() => tl3.timeScale(1.2).restart(), null, 8.8); // Diagnostic (Top Left)
  if (tl5) masterTl.call(() => tl5.timeScale(1.2).restart(), null, 8.8); // Tickets (Bottom Right)
  if (tl4) masterTl.call(() => tl4.timeScale(1.2).restart(), null, 9.0); // Congrats (Top Right)
  if (tl1) masterTl.call(() => tl1.timeScale(1.2).restart(), null, 9.2); // 75 Systems (Bottom Left)
  if (tl2) masterTl.call(() => tl2.timeScale(1.2).restart(), null, 9.2); // Service (Center Right)

  // Reset cards silently just to be safe
  masterTl.call(() => {
    cardTimelines.forEach(tl => tl.pause(0));
  }, null, 6.0);
}

export function killCardAnimations() {
  if (masterTl) masterTl.kill();
  cardTimelines.forEach(tl => tl.kill());
  cardTimelines = [];
  
  if (mouseMoveHandler) {
    window.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
}
