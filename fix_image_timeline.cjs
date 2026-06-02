const fs = require('fs');

let content = fs.readFileSync('src/animations/cardAnimations.js', 'utf8');

const newLoop = `  // Build the 12s loop
  // 0 - 6s (Front face flips to back)
  masterTl.to('.rotor-3d', { rotationY: 180, duration: 6, ease: 'expo.inOut' }, 0);
          
  // 6 - 12s (Back face flips to front)
  masterTl.to('.rotor-3d', { rotationY: 360, duration: 6, ease: 'expo.inOut' }, 6);

  // We use keyframes to strictly lock the image state over the 12s loop.
  // The image slides down from t=2.2 to t=3.0, AFTER the floating cards have exited.
  masterTl.to('.front-face .main-image', {
    keyframes: {
      "0%": { yPercent: 0, scale: 1.05 },
      "18.33%": { yPercent: 0, scale: 1.05 }, // t=2.2
      "25%": { yPercent: 100, scale: 1, ease: 'power2.in' }, // t=3.0
      "75%": { yPercent: 100, scale: 1 }, // t=9.0
      "83.33%": { yPercent: 0, scale: 1.05, ease: 'power2.out' }, // t=10.0
      "100%": { yPercent: 0, scale: 1.05 }
    },
    duration: 12
  }, 0);

  masterTl.to('.back-face .main-image', {
    keyframes: {
      "0%": { yPercent: 100, scale: 1 },
      "25%": { yPercent: 100, scale: 1 }, // t=3.0
      "33.33%": { yPercent: 0, scale: 1.05, ease: 'power2.out' }, // t=4.0
      "68.33%": { yPercent: 0, scale: 1.05 }, // t=8.2
      "75%": { yPercent: 100, scale: 1, ease: 'power2.in' }, // t=9.0
      "100%": { yPercent: 100, scale: 1 }
    },
    duration: 12
  }, 0);

  masterTl.to('.front-face .face-center-bounds', {
    keyframes: {
      "0%": { autoAlpha: 1 },
      "24.9%": { autoAlpha: 1 },
      "25%": { autoAlpha: 0 },
      "74.9%": { autoAlpha: 0 },
      "75%": { autoAlpha: 1 },
      "100%": { autoAlpha: 1 }
    },
    duration: 12
  }, 0);

  masterTl.to('.back-face .face-center-bounds', {
    keyframes: {
      "0%": { autoAlpha: 0 },
      "24.9%": { autoAlpha: 0 },
      "25%": { autoAlpha: 1 },
      "74.9%": { autoAlpha: 1 },
      "75%": { autoAlpha: 0 },
      "100%": { autoAlpha: 0 }
    },
    duration: 12
  }, 0);

  // Trigger cards sequentially to pop in exactly as they cross 270deg (sideways) and face front
  if (tl3) masterTl.call(() => tl3.timeScale(1).restart(), null, 8.9); // Diagnostic (Top Left)
  if (tl1) masterTl.call(() => tl1.timeScale(1).restart(), null, 9.0); // 75 Systems (Bottom Left)
  if (tl4) masterTl.call(() => tl4.timeScale(1).restart(), null, 9.1); // Congrats (Top Right)
  if (tl2) masterTl.call(() => tl2.timeScale(1).restart(), null, 9.2); // Service (Center Right)
  if (tl5) masterTl.call(() => tl5.timeScale(1).restart(), null, 9.3); // Tickets (Bottom Right)

  // Exit sequence: Start earlier and move faster so they are completely gone BEFORE the image slides down
  if (tl5) masterTl.call(() => tl5.timeScale(2).reverse(), null, 0.8); // Tickets
  if (tl2) masterTl.call(() => tl2.timeScale(2).reverse(), null, 0.9); // Service
  if (tl4) masterTl.call(() => tl4.timeScale(2).reverse(), null, 1.0); // Congrats
  if (tl1) masterTl.call(() => tl1.timeScale(2).reverse(), null, 1.1); // 75 Systems
  if (tl3) masterTl.call(() => tl3.timeScale(2).reverse(), null, 1.2); // Diagnostic`;

content = content.replace(/\/\/ Build the 12s loop[\s\S]*?\/\/ Diagnostic/m, newLoop);

fs.writeFileSync('src/animations/cardAnimations.js', content, 'utf8');
