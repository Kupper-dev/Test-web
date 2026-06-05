import { Engine, World, Bodies, Composite, Body } from 'matter-js';

let engine = null;
let runnerId = null;
let spawnInterval = null;
let activeBubbles = []; // Holds { body, element, width, height }
let boundaries = []; // Floor, left, right boundaries
let mouseBody = null;
let mouseMoveListener = null;
let mouseLeaveListener = null;
let resizeListener = null;

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
function measureBubble(text, variant) {
  const container = document.querySelector('.overwhelming-physics-container');
  if (!container) return { width: 120, height: 40 };

  const temp = document.createElement('div');
  temp.className = `message-bubble ${variant === 'blue-2' ? 'is--blue-2' : 'is--white'}`;
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.whiteSpace = 'nowrap';
  
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = text;
  temp.appendChild(span);
  
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

  // Measure
  const size = measureBubble(text, variant);

  // Position calculation
  let spawnX = 0;
  let spawnY = customY !== null ? customY : -100;

  if (isPrefill) {
    // Fill bottom 40% area randomly
    spawnX = Math.random() * (width - size.width - 80) + size.width / 2 + 40;
  } else {
    // Spawner side choice (top-left vs top-right)
    const isMobile = width < 768;
    if (isMobile) {
      // Mobile: Left side spawning only
      spawnX = Math.random() * 60 + size.width / 2 + 20;
    } else {
      // Desktop: Left or right corner spawning
      const spawnLeft = Math.random() > 0.5;
      if (spawnLeft) {
        spawnX = Math.random() * 80 + size.width / 2 + 40;
      } else {
        spawnX = width - (Math.random() * 80 + size.width / 2 + 40);
      }
    }
  }

  // Create Matter.js body
  const body = Bodies.rectangle(spawnX, spawnY, size.width, size.height, {
    restitution: 0.15,
    friction: 0.15,
    frictionAir: 0.03,
    angle: (Math.random() - 0.5) * 0.3 // Add a slight initial skew
  });

  // Create DOM node
  const element = document.createElement('div');
  element.className = `message-bubble ${variant === 'blue-2' ? 'is--blue-2' : 'is--white'}`;
  
  const span = document.createElement('span');
  span.className = 'message-text';
  span.textContent = text;
  element.appendChild(span);
  
  container.appendChild(element);

  // Add to world & tracking array
  World.add(engine.world, body);
  activeBubbles.push({ body, element, width: size.width, height: size.height });
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
    spawnBubble(false, -80);
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
}

// Tear down engine and free memory
export function killOverwhelmingAnimations() {
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
