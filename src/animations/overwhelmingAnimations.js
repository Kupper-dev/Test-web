import { Engine, World, Bodies, Composite, Body } from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

let engine = null;
let runnerId = null;
let spawnInterval = null;
let activeBubbles = []; // Holds { body, element, width, height }
let boundaries = []; // Floor, left, right boundaries
let mouseBody = null;
let mouseMoveListener = null;
let mouseLeaveListener = null;
let resizeListener = null;
let activeTimeouts = []; // Track timeouts to prevent page leak crashes
let cardSplitParagraphs = [];
let scrollTriggerInstance = null;

// Predefined customizable messages array
const MESSAGES = [
  "Hi! How can I help?",
  "Where is my ticket?",
  "I need a refund, please.",
  "My computer is slow.",
  "Is the server down?",
  "Can I upgrade my monthly plan?",
  "Is there a discount available?",
  "Thanks for the quick response!",
  "Please call me as soon as possible.",
  "How long does it take to repair?",
  "I received an incorrect charge.",
  "My password reset link expired.",
  "Awesome customer support!"
];

// Helper: Measure bubble size off-screen
function measureBubble(text, variant, icon = null) {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container) return { width: 120, height: 40 };

  const temp = document.createElement('div');
  temp.className = `message-bubble-front ${variant === 'blue-2' ? 'is--blue-2' : 'is--white'}`;
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.whiteSpace = 'nowrap';
  // Override CSS inset: 0 and dimensions to measure intrinsic content size correctly
  temp.style.top = 'auto';
  temp.style.left = 'auto';
  temp.style.right = 'auto';
  temp.style.bottom = 'auto';
  temp.style.width = 'auto';
  temp.style.height = 'auto';
  
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = text;
  temp.appendChild(span);

  if (icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.textContent = icon;
    iconSpan.style.marginLeft = '8px';
    temp.appendChild(iconSpan);
  }
  
  container.appendChild(temp);
  const rect = temp.getBoundingClientRect();
  container.removeChild(temp);
  
  return {
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height)
  };
}

// Function to spawn a single bubble
function spawnBubble(isPrefill = false, customY = null) {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container || !engine) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Enforce bubble limits to protect memory
  const maxBubbles = width < 768 ? 35 : 75;
  if (!isPrefill && activeBubbles.length >= maxBubbles) {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
    return;
  }

  // Choose content & color variant
  const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  const variant = Math.random() > 0.5 ? 'white' : 'blue-2';

  // Decide icon status (randomly check if we show an emoji)
  const showIcon = Math.random() < 0.35;
  const icon = showIcon ? ["⭐", "✨", "❤️", "✓"][Math.floor(Math.random() * 4)] : null;

  // Measure with icon support
  const size = measureBubble(text, variant, icon);

  // Position calculation
  let spawnX = 0;
  let spawnY = customY !== null ? customY : 80;
  let isLeft = true;

  if (isPrefill) {
    // Fill bottom 40% area randomly
    spawnX = Math.random() * (width - size.width - 80) + size.width / 2 + 40;
  } else {
    // Spawner side choice (top-left vs top-right)
    const isMobile = width < 768;
    if (isMobile) {
      // Mobile: Left side spawning only
      isLeft = true;
      spawnX = Math.random() * 40 + size.width / 2 + 20;
    } else {
      // Desktop: Left or right corner spawning
      isLeft = Math.random() > 0.5;
      if (isLeft) {
        spawnX = Math.random() * 60 + size.width / 2 + 40;
      } else {
        spawnX = width - (Math.random() * 60 + size.width / 2 + 40);
      }
    }
  }

  const isBubbleLeft = spawnX < width / 2;

  // Create Matter.js body (Initially dynamic to save mass/inertia values, then set to static if not prefilling)
  const body = Bodies.rectangle(spawnX, spawnY, size.width, size.height, {
    restitution: 0.15,
    friction: 0.15,
    frictionAir: 0.03,
    angle: isPrefill ? (Math.random() - 0.5) * 0.3 : 0
  });

  if (!isPrefill) {
    Body.setStatic(body, true);
  }

  // Clone template DOM node
  const template = document.querySelector('.overwhelming-template-wrapper .message-bubble-wrapper');
  if (!template) return;
  const element = template.cloneNode(true);
  element.classList.add(isBubbleLeft ? 'is--left' : 'is--right');
  element.style.width = `${size.width}px`;
  element.style.height = `${size.height}px`;

  const front = element.querySelector('.message-bubble-front');
  const shadow = element.querySelector('.message-bubble-shadow');
  const span = element.querySelector('.message-text');
  const iconSpan = element.querySelector('.message-icon');

  if (front && span) {
    front.setAttribute('data-wf-variant', variant);
    front.classList.add(variant === 'blue-2' ? 'is--blue-2' : 'is--white');
    span.textContent = text;
  }

  if (iconSpan) {
    if (icon) {
      iconSpan.textContent = icon;
      iconSpan.style.display = 'inline-block';
    } else {
      iconSpan.style.display = 'none';
    }
  }

  // Position DOM element initially
  element.style.transform = `translate3d(${spawnX - size.width / 2}px, ${spawnY - size.height / 2}px, 0px)`;
  container.appendChild(element);

  // Add to world & tracking array
  World.add(engine.world, body);
  activeBubbles.push({ body, element, width: size.width, height: size.height });

  // Play animations
  if (!isPrefill && front && shadow) {
    const origin = isLeft ? 'top left' : 'top right';
    const startRotation = isLeft ? -35 : 35;
    const shadowRotation = isLeft ? -45 : 45; // Swing same direction, slightly steeper starting angle

    // Set initial states (Squashed thin line, matching rotation directions)
    gsap.set([front, shadow], { transformOrigin: origin });
    gsap.set(front, { scaleX: 0.15, scaleY: 0.05, rotation: startRotation });
    gsap.set(shadow, { scaleX: 0.15, scaleY: 0.05, rotation: shadowRotation });

    if (span) {
      gsap.set(span, { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" });
    }
    if (iconSpan && icon) {
      gsap.set(iconSpan, { scale: 0 });
    }

    // Animate front card (Delayed snappy swing and stretch)
    gsap.to(front, {
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      duration: 0.75,
      delay: 0.06,
      ease: "back.out(1.5)"
    });

    // Animate shadow card (Immediate swing and stretch)
    gsap.to(shadow, {
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      duration: 0.85,
      delay: 0,
      ease: "back.out(2.2)"
    });

    // Wiping reveal for text (typewriter reveal, synced to front delay)
    if (span) {
      gsap.to(span, {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 0.5,
        delay: 0.3,
        ease: "power2.out"
      });
    }

    // Bounce in for status icon/emoji (synced to front delay)
    if (iconSpan && icon) {
      gsap.to(iconSpan, {
        scale: 1,
        duration: 0.3,
        delay: 0.75,
        ease: "back.out(2.0)"
      });
    }

    // Timeout to release body from static to dynamic
    const tId = setTimeout(() => {
      if (engine && body && engine.world.bodies.includes(body)) {
        Body.setStatic(body, false);
      }
    }, 850);
    activeTimeouts.push(tId);
  } else if (front && shadow) {
    // Prefill: Set scale instantly
    gsap.set([front, shadow], { scale: 1, rotation: 0 });
    if (span) {
      gsap.set(span, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" });
    }
    if (iconSpan && icon) {
      gsap.set(iconSpan, { scale: 1 });
    }
  }
}

// Build and update boundary bodies on init/resize
function updateBoundaries() {
  if (!engine) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Remove existing boundaries from world
  if (boundaries.length > 0) {
    World.remove(engine.world, boundaries);
  }

  // Define floor, left, and right wall bodies
  const thickness = 100;
  const floor = Bodies.rectangle(width / 2, height + thickness / 2, width + 400, thickness, { isStatic: true });
  const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height + 400, { isStatic: true });
  const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height + 400, { isStatic: true });

  boundaries = [floor, leftWall, rightWall];
  World.add(engine.world, boundaries);
}

// Tick loop running at 60fps
function tick() {
  if (!engine) return;

  // Step the physics engine forward
  Engine.update(engine, 1000 / 60);

  // Sync positions from rigid bodies to DOM element transform offsets
  activeBubbles.forEach((bubble) => {
    const { x, y } = bubble.body.position;
    const angle = bubble.body.angle;
    bubble.element.style.transform = `translate3d(${x - bubble.width / 2}px, ${y - bubble.height / 2}px, 0px) rotate(${angle}rad)`;
  });

  runnerId = requestAnimationFrame(tick);
}

// Initialize animations and events
export function initOverwhelmingAnimations() {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container) return;

  // Ensure any prior engine is fully destroyed
  killOverwhelmingAnimations();

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Initialize engine
  engine = Engine.create({
    gravity: { y: 0.9, scale: 0.001 }
  });

  // Setup bounds
  updateBoundaries();

  // Create invisible mouse repeller circular body
  const repellerRadius = width < 768 ? 40 : 80;
  mouseBody = Bodies.circle(-1000, -1000, repellerRadius, {
    isStatic: true,
    friction: 0.1,
    restitution: 0.1
  });
  World.add(engine.world, mouseBody);

  // 1. Prefill Phase (40% Capacity)
  const prefillCount = width < 768 ? 12 : 28;
  for (let i = 0; i < prefillCount; i++) {
    // Generate scattered vertical offsets spanning middle-bottom
    const relativeY = height - 120 - (i * 24) - Math.random() * 120;
    spawnBubble(true, relativeY);
  }

  // Settle prefill physics instantly
  for (let i = 0; i < 150; i++) {
    Engine.update(engine, 1000 / 60);
  }

  // Render resting coordinates
  activeBubbles.forEach((bubble) => {
    const { x, y } = bubble.body.position;
    const angle = bubble.body.angle;
    bubble.element.style.transform = `translate3d(${x - bubble.width / 2}px, ${y - bubble.height / 2}px, 0px) rotate(${angle}rad)`;
  });

  // Start loop ticking
  runnerId = requestAnimationFrame(tick);

  // 2. Continuous time-based Spawner
  spawnInterval = setInterval(() => {
    spawnBubble(false, 80);
  }, 1200);

  // 3. Mouse event listeners
  const stickySec = document.querySelector('.overwhelming-sticky');
  if (stickySec) {
    mouseMoveListener = (e) => {
      if (!mouseBody) return;
      const rect = stickySec.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      Body.setPosition(mouseBody, { x: mouseX, y: mouseY });
    };
    
    mouseLeaveListener = () => {
      if (!mouseBody) return;
      Body.setPosition(mouseBody, { x: -1000, y: -1000 });
    };

    stickySec.addEventListener('mousemove', mouseMoveListener);
    stickySec.addEventListener('mouseleave', mouseLeaveListener);
  }

  // 4. Viewport resize listener
  resizeListener = () => {
    updateBoundaries();
  };
  window.addEventListener('resize', resizeListener);

  // --- Phase 2 Card Scroll-Linked Transitions ---
  const cards = document.querySelectorAll('.overwhelming-card');
  const cardElements = Array.from(cards);
  
  if (cardElements.length > 0) {
    // 1. Initial State Setup
    cardElements.forEach((card, idx) => {
      const title = card.querySelector('.item-title > div');
      const desc = card.querySelector('.item-desc p');
      const emojis = card.querySelectorAll('.messy-element');

      // Setup paragraph splitting
      if (desc) {
        const descSplit = new SplitType(desc, {
          types: 'lines, words',
          lineClass: 'card-desc-line',
          wordClass: 'card-desc-word'
        });
        
        descSplit.lines.forEach((line) => {
          line.style.overflow = 'hidden';
          line.style.display = 'block';
          line.style.position = 'relative';
          
          line.querySelectorAll('.card-desc-word').forEach((word) => {
            word.style.display = 'inline-block';
            word.style.position = 'relative';
          });
        });
        cardSplitParagraphs.push(descSplit);
      }

      // Hide cards 2 & 3 initially
      if (idx > 0) {
        gsap.set(card, { opacity: 0, scale: 0.9, autoAlpha: 0 });
        if (title) {
          gsap.set(title, { yPercent: 105, rotate: 15, transformOrigin: '0% 100%' });
        }
        if (desc) {
          const words = desc.querySelectorAll('.card-desc-word');
          gsap.set(words, { yPercent: 110 });
        }
        if (emojis.length > 0) {
          gsap.set(emojis, { scale: 0, opacity: 0 });
        }
      } else {
        // Card 1 starts active and revealed
        gsap.set(card, { opacity: 1, scale: 1, autoAlpha: 1 });
        if (title) {
          gsap.set(title, { yPercent: 0, rotate: 0, transformOrigin: '0% 100%' });
        }
        if (desc) {
          const words = desc.querySelectorAll('.card-desc-word');
          gsap.set(words, { yPercent: 0 });
        }
        // Animate Card 1 emojis drop and bounce on load
        if (emojis.length > 0) {
          gsap.set(emojis, { scale: 0, opacity: 0 });
          gsap.to(emojis, {
            scale: 1,
            opacity: 1,
            y: 0,
            rotation: 0,
            duration: 1.0,
            ease: 'back.out(1.8)',
            stagger: 0.1,
            delay: 0.2
          });
        }
      }
    });

    // 2. Build ScrollTrigger scrubbing timeline
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: '.overwhelming-track',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Helper function to show/hide a card
        const setCardState = (activeIdx) => {
          cardElements.forEach((card, i) => {
            if (i === activeIdx) {
              card.classList.add('active');
            } else {
              card.classList.remove('active');
            }
          });
        };

        // Scroll Range 1: Card 1 Active (progress: 0.0 -> 0.25)
        if (progress <= 0.25) {
          setCardState(0);
          
          const card1 = cardElements[0];
          const card1Emojis = card1.querySelectorAll('.messy-element');
          const card1Title = card1.querySelector('.item-title > div');
          const card1Words = card1.querySelectorAll('.card-desc-word');

          gsap.to(card1, { opacity: 1, scale: 1, autoAlpha: 1, duration: 0.2 });
          if (card1Title) gsap.to(card1Title, { yPercent: 0, rotate: 0, duration: 0.2 });
          if (card1Words.length > 0) gsap.to(card1Words, { yPercent: 0, duration: 0.2 });
          if (card1Emojis.length > 0) gsap.to(card1Emojis, { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.2 });

          // Keep other cards completely hidden
          cardElements.slice(1).forEach((card) => {
            gsap.to(card, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          });
        }
        
        // Scroll Range 2: Card 1 -> Card 2 Transition (progress: 0.25 -> 0.35 -> 0.45)
        else if (progress > 0.25 && progress <= 0.45) {
          const ratio = (progress - 0.25) / 0.2; // normalized 0 to 1
          
          const card1 = cardElements[0];
          const card2 = cardElements[1];
          const card1Title = card1.querySelector('.item-title > div');
          const card1Words = card1.querySelectorAll('.card-desc-word');
          const card1Emojis = card1.querySelectorAll('.messy-element');
          
          const card2Title = card2.querySelector('.item-title > div');
          const card2Words = card2.querySelectorAll('.card-desc-word');
          const card2Emojis = card2.querySelectorAll('.messy-element');

          if (ratio < 0.5) {
            // Card 1 Exiting
            setCardState(0);
            const subRatio = ratio * 2; // 0 to 1
            gsap.to(card1, { opacity: 1 - subRatio, scale: 1 - subRatio * 0.1, autoAlpha: subRatio > 0.9 ? 0 : 1, duration: 0.1 });
            
            if (card1Title) gsap.to(card1Title, { yPercent: subRatio * 105, rotate: subRatio * 15, duration: 0.1 });
            if (card1Words.length > 0) gsap.to(card1Words, { yPercent: subRatio * 110, duration: 0.1 });
            
            // Card 1 emojis slide away in different directions
            if (card1Emojis.length === 4) {
              gsap.to(card1Emojis[0], { x: -subRatio * 100, y: -subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 }); // Top-Left goes further top-left
              gsap.to(card1Emojis[1], { x: subRatio * 100, y: -subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 });  // Top-Right goes top-right
              gsap.to(card1Emojis[2], { x: -subRatio * 100, y: subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 });  // Bottom-Left goes bottom-left
              gsap.to(card1Emojis[3], { x: subRatio * 100, y: subRatio * 100, opacity: 1 - subRatio, scale: 1 - subRatio, duration: 0.1 });    // Bottom-Right goes bottom-right
            }

            // Ensure card 2 is hidden
            gsap.to(card2, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          } else {
            // Card 2 Entering
            setCardState(1);
            const subRatio = (ratio - 0.5) * 2; // 0 to 1
            gsap.to(card2, { opacity: subRatio, scale: 0.9 + subRatio * 0.1, autoAlpha: 1, duration: 0.1 });
            
            if (card2Title) gsap.to(card2Title, { yPercent: (1 - subRatio) * 105, rotate: (1 - subRatio) * 15, duration: 0.1 });
            if (card2Words.length > 0) gsap.to(card2Words, { yPercent: (1 - subRatio) * 110, duration: 0.1 });
            
            // Card 2 emojis spin in
            if (card2Emojis.length > 0) {
              gsap.to(card2Emojis, {
                scale: subRatio,
                opacity: subRatio,
                rotation: (1 - subRatio) * 360,
                duration: 0.1
              });
            }

            // Ensure card 1 is fully hidden
            gsap.to(card1, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          }
        }

        // Scroll Range 3: Card 2 Active (progress: 0.45 -> 0.65)
        else if (progress > 0.45 && progress <= 0.65) {
          setCardState(1);
          const card2 = cardElements[1];
          const card2Emojis = card2.querySelectorAll('.messy-element');
          const card2Title = card2.querySelector('.item-title > div');
          const card2Words = card2.querySelectorAll('.card-desc-word');

          gsap.to(card2, { opacity: 1, scale: 1, autoAlpha: 1, duration: 0.2 });
          if (card2Title) gsap.to(card2Title, { yPercent: 0, rotate: 0, duration: 0.2 });
          if (card2Words.length > 0) gsap.to(card2Words, { yPercent: 0, duration: 0.2 });
          if (card2Emojis.length > 0) gsap.to(card2Emojis, { scale: 1, opacity: 1, rotation: 0, duration: 0.2 });

          // Keep card 1 & 3 hidden
          gsap.to(cardElements[0], { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          gsap.to(cardElements[2], { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
        }

        // Scroll Range 4: Card 2 -> Card 3 Transition (progress: 0.65 -> 0.75 -> 0.85)
        else if (progress > 0.65 && progress <= 0.85) {
          const ratio = (progress - 0.65) / 0.2; // normalized 0 to 1
          
          const card2 = cardElements[1];
          const card3 = cardElements[2];
          const card2Title = card2.querySelector('.item-title > div');
          const card2Words = card2.querySelectorAll('.card-desc-word');
          const card2Emojis = card2.querySelectorAll('.messy-element');
          
          const card3Title = card3.querySelector('.item-title > div');
          const card3Words = card3.querySelectorAll('.card-desc-word');
          const card3Emojis = card3.querySelectorAll('.messy-element');

          if (ratio < 0.5) {
            // Card 2 Exiting
            setCardState(1);
            const subRatio = ratio * 2; // 0 to 1
            gsap.to(card2, { opacity: 1 - subRatio, scale: 1 - subRatio * 0.1, autoAlpha: subRatio > 0.9 ? 0 : 1, duration: 0.1 });
            
            if (card2Title) gsap.to(card2Title, { yPercent: subRatio * 105, rotate: subRatio * 15, duration: 0.1 });
            if (card2Words.length > 0) gsap.to(card2Words, { yPercent: subRatio * 110, duration: 0.1 });
            
            // Card 2 emojis drop down vertically
            if (card2Emojis.length > 0) {
              gsap.to(card2Emojis, {
                y: subRatio * 200,
                opacity: 1 - subRatio,
                duration: 0.1
              });
            }

            // Ensure card 3 is hidden
            gsap.to(card3, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          } else {
            // Card 3 Entering
            setCardState(2);
            const subRatio = (ratio - 0.5) * 2; // 0 to 1
            gsap.to(card3, { opacity: subRatio, scale: 0.9 + subRatio * 0.1, autoAlpha: 1, duration: 0.1 });
            
            if (card3Title) gsap.to(card3Title, { yPercent: (1 - subRatio) * 105, rotate: (1 - subRatio) * 15, duration: 0.1 });
            if (card3Words.length > 0) gsap.to(card3Words, { yPercent: (1 - subRatio) * 110, duration: 0.1 });
            
            // Card 3 emojis pop in from 0 with elastic look (high amplitude scaling)
            if (card3Emojis.length > 0) {
              gsap.to(card3Emojis, {
                scale: subRatio,
                opacity: subRatio,
                x: 0,
                y: 0,
                duration: 0.1
              });
            }

            // Ensure card 2 is fully hidden
            gsap.to(card2, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          }
        }

        // Scroll Range 5: Card 3 Active (progress: 0.85 -> 1.0)
        else if (progress > 0.85) {
          setCardState(2);
          const card3 = cardElements[2];
          const card3Emojis = card3.querySelectorAll('.messy-element');
          const card3Title = card3.querySelector('.item-title > div');
          const card3Words = card3.querySelectorAll('.card-desc-word');

          gsap.to(card3, { opacity: 1, scale: 1, autoAlpha: 1, duration: 0.2 });
          if (card3Title) gsap.to(card3Title, { yPercent: 0, rotate: 0, duration: 0.2 });
          if (card3Words.length > 0) gsap.to(card3Words, { yPercent: 0, duration: 0.2 });
          if (card3Emojis.length > 0) gsap.to(card3Emojis, { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.2 });

          // Keep other cards hidden
          cardElements.slice(0, 2).forEach((card) => {
            gsap.to(card, { opacity: 0, scale: 0.9, autoAlpha: 0, duration: 0.1 });
          });
        }
      }
    });
  }
}

// Tear down engine and free memory
export function killOverwhelmingAnimations() {
  // Destroy ScrollTrigger instance
  if (scrollTriggerInstance) {
    scrollTriggerInstance.kill();
    scrollTriggerInstance = null;
  }

  // Revert SplitType line/word wraps
  cardSplitParagraphs.forEach((split) => {
    if (split) {
      split.revert();
    }
  });
  cardSplitParagraphs = [];

  // Clear runner animation frame
  if (runnerId) {
    cancelAnimationFrame(runnerId);
    runnerId = null;
  }

  // Clear timers
  if (spawnInterval) {
    clearInterval(spawnInterval);
    spawnInterval = null;
  }

  // Clear any pending physics activation timeouts
  activeTimeouts.forEach(clearTimeout);
  activeTimeouts = [];

  // Remove elements from DOM
  activeBubbles.forEach((bubble) => {
    if (bubble.element && bubble.element.parentNode) {
      bubble.element.parentNode.removeChild(bubble.element);
    }
  });
  activeBubbles = [];

  // Clear event listeners
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener);
    resizeListener = null;
  }

  const stickySec = document.querySelector('.overwhelming-sticky');
  if (stickySec) {
    if (mouseMoveListener) {
      stickySec.removeEventListener('mousemove', mouseMoveListener);
      mouseMoveListener = null;
    }
    if (mouseLeaveListener) {
      stickySec.removeEventListener('mouseleave', mouseLeaveListener);
      mouseLeaveListener = null;
    }
  }

  // Clean Matter.js world
  if (engine) {
    World.clear(engine.world);
    Engine.clear(engine);
    engine = null;
  }

  mouseBody = null;
  boundaries = [];
}
