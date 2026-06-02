const fs = require('fs');

let content = fs.readFileSync('src/animations/cardAnimations.js', 'utf8');

// Update Service Card Timeline
content = content.replace(/function createServiceCardTimeline\(\) \{[\s\S]*?return tl;\n\}/, `function createServiceCardTimeline() {
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
}`);

// Update Congrats Card Timeline
content = content.replace(/function createCongratsCardTimeline\(\) \{[\s\S]*?return tl;\n\}/, `function createCongratsCardTimeline() {
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
}`);

// Update Tickets Card Timeline
content = content.replace(/function createTicketsCardTimeline\(\) \{[\s\S]*?return tl;\n\}/, `function createTicketsCardTimeline() {
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
}`);

fs.writeFileSync('src/animations/cardAnimations.js', content, 'utf8');
