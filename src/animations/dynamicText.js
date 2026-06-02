import gsap from 'gsap';

let masterTimeline;

export function initDynamicText() {
  const container = document.querySelector('span.dynamic-text');
  if (!container) return;

  // Clear existing content ("dynamic-text")
  container.innerHTML = '';
  
  // Set up container as a mask
  container.style.display = 'inline-grid';
  container.style.overflow = 'hidden';
  container.style.verticalAlign = 'bottom';
  // Small padding/margin adjustment might be needed depending on the font
  
  const phrases = [
    "en sitio",
    "en remoto",
    "a domicilio",
    "por whatsapp"
  ];

  // Create the DOM structure
  phrases.forEach((phrase, i) => {
    const phraseWrapper = document.createElement('span');
    phraseWrapper.style.gridArea = '1 / 1';
    phraseWrapper.style.display = 'inline-flex';
    phraseWrapper.style.gap = '0.25em'; // Space between words
    phraseWrapper.classList.add('dynamic-phrase');
    
    // Split phrase into words
    const words = phrase.split(' ');
    words.forEach(wordText => {
      const wordSpan = document.createElement('span');
      // We will animate the word itself, so we need overflow hidden on the wrapper of the word?
      // Actually, if the container has overflow hidden, maybe we can just animate the words from below the container.
      // But if we want them to come from the side AND up, the container mask is enough.
      wordSpan.textContent = wordText;
      wordSpan.classList.add('dynamic-word');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.opacity = '0'; // Hide initially to prevent flashing
      // To ensure the strong styling from the original is preserved
      wordSpan.style.fontWeight = 'bold'; 
      phraseWrapper.appendChild(wordSpan);
    });

    container.appendChild(phraseWrapper);
  });

  const phraseElements = container.querySelectorAll('.dynamic-phrase');

  // GSAP Animation
  masterTimeline = gsap.timeline({ repeat: -1 });

  phraseElements.forEach((phraseEl, index) => {
    const words = phraseEl.querySelectorAll('.dynamic-word');
    const isFirst = index === 0;
    
    const phraseTl = gsap.timeline();

    // Entrance animation
    phraseTl.fromTo(words, 
      { 
        y: '100%', 
        x: '20px', 
        opacity: 0,
        rotateZ: 5 // slight rotation for more dynamic feel?
      },
      {
        y: '0%',
        x: '0px',
        opacity: 1,
        rotateZ: 0,
        duration: 1.2,
        stagger: 0.15, // The magnetic staggered effect (first word, then second)
        ease: "elastic.out(1, 0.7)", // Spring/magnetic easing
      }
    );

    // Hold the text on screen for a moment
    phraseTl.to({}, { duration: 1.5 });

    // Exit animation
    phraseTl.to(words, {
      y: '-100%',
      x: '-20px',
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.inOut",
    });

    masterTimeline.add(phraseTl);
  });
}

export function killDynamicText() {
  if (masterTimeline) {
    masterTimeline.kill();
    masterTimeline = null;
  }
}
