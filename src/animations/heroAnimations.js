import { gsap } from 'gsap';
import SplitType from 'split-type';

let heroTimeline = null;
let heroDescSplit = null;

export function initHeroAnimations() {
  const heading = document.querySelector('.column_vertical .h1');
  const descEl = document.getElementById('hero-desc');
  const ctaEl = document.getElementById('hero-cta');

  // Kill existing timeline first
  if (heroTimeline) {
    heroTimeline.kill();
  }

  heroTimeline = gsap.timeline();

  // 1. Heading Animation (.h1)
  if (heading) {
    // Hide initially and slide/fade in
    gsap.set(heading, { y: 40, opacity: 0 });
    heroTimeline.to(heading, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out'
    }, 0.2); // Start shortly after page loads
  }

  // 2. Description Paragraph Animation (#hero-desc)
  if (descEl) {
    // Split the text into lines & words
    heroDescSplit = new SplitType(descEl, {
      types: 'lines, words',
      lineClass: 'hero-desc-line',
      wordClass: 'hero-desc-word'
    });

    // Style elements for the overflow mask effect
    heroDescSplit.lines.forEach((line, lineIdx) => {
      line.style.overflow = 'hidden';
      line.style.display = 'block';
      line.style.position = 'relative';

      const words = line.querySelectorAll('.hero-desc-word');
      words.forEach(word => {
        word.style.display = 'inline-block';
        word.style.position = 'relative';
      });

      // Animate word splits sliding up
      heroTimeline.fromTo(words,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'power2.out',
          duration: 0.75,
          stagger: 0.04
        },
        0.5 + (lineIdx * 0.12) // Overlap slightly with heading
      );
    });
  }

  // 3. CTA Button Animation (#hero-cta)
  if (ctaEl) {
    const splitOffset = heroDescSplit ? heroDescSplit.lines.length * 0.12 + 0.5 : 0.8;
    
    gsap.set(ctaEl, { y: 30, opacity: 0 });
    heroTimeline.to(ctaEl, {
      y: 0,
      opacity: 1,
      ease: 'power3.out',
      duration: 0.8
    }, splitOffset + 0.1);
  }
}

export function killHeroAnimations() {
  if (heroTimeline) {
    heroTimeline.kill();
    heroTimeline = null;
  }
  if (heroDescSplit) {
    heroDescSplit.revert();
    heroDescSplit = null;
  }
}
