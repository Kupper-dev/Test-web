# Lusion Text Animation and Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the typography, layout structure, and GSAP scroll-scrub text/paragraph animation inside the home-reel section of the Lusion sandbox page to match the original Lusion aesthetics and scroll behavior.

**Architecture:** Split the title lines separately using SplitType. Wrap each word in an inner wrapper span dynamically. Calculate dynamic horizontal offset D = wordBold.offsetLeft. Split paragraph into lines/words, vertically slide-up words with staggers, and apply an 8% faster parallax translation to an inner paragraph content wrapper.

**Tech Stack:** HTML5, CSS3, JavaScript, GSAP with ScrollTrigger, SplitType, Google Fonts

---

### Task 1: Typography and CSS Layout Setup

**Files:**
- Modify: `lusion.html`

- [x] **Step 1: Import Google Fonts Outfit** (Completed)
- [x] **Step 2: Update Title & CTA Styles in CSS** (Completed)
- [x] **Step 3: Update Description Text content** (Completed)
- [x] **Step 4: Verify Page Compiles (`npm run build`)** (Completed)
- [x] **Step 5: Commit changes** (Completed)

---

### Task 2: Implement Paragraph Structural Changes and Scroll Animations

**Files:**
- Modify: `lusion.html`
- Modify: `src/animations/lusionAnimations.js`

- [ ] **Step 1: Add `#home-reel-content-inner` in `lusion.html`**
  Open `lusion.html` and wrap the content of `#home-reel-content` (namely `#home-reel-desc` and `#home-reel-cta`) in a new `div` with id `#home-reel-content-inner`.
  
  Replace:
  ```html
          <!-- Description and CTA Element -->
          <div id="home-reel-content">
            <h2 id="home-reel-desc">
              We combine design, motion, 3D, and development to create digital experiences that feel visually striking and technically seamless. From campaign launches to immersive brand worlds, we build work that captures attention and invites interaction.
            </h2>
            <a id="home-reel-cta" href="/about" target="_blank">
              <span id="home-reel-cta-dot"></span>
              <span id="home-reel-cta-text">Our Approach</span>
            </a>
          </div>
  ```
  with:
  ```html
          <!-- Description and CTA Element -->
          <div id="home-reel-content">
            <div id="home-reel-content-inner">
              <h2 id="home-reel-desc">
                We combine design, motion, 3D, and development to create digital experiences that feel visually striking and technically seamless. From campaign launches to immersive brand worlds, we build work that captures attention and invites interaction.
              </h2>
              <a id="home-reel-cta" href="/about" target="_blank">
                <span id="home-reel-cta-dot"></span>
                <span id="home-reel-cta-text">Our Approach</span>
              </a>
            </div>
          </div>
  ```

- [ ] **Step 2: Declare Split & Parallax variables in `lusionAnimations.js`**
  Open `src/animations/lusionAnimations.js` and declare `descSplit` and `parallaxTween` at the top.
  
  Replace the block containing `line1Split` and `line2Split` with:
  ```javascript
  // Split text instances
  let line1Split = null;
  let line2Split = null;
  let descSplit = null;
  ```
  And add a new variable near other scroll listeners:
  ```javascript
  let parallaxTween = null;
  ```

- [ ] **Step 3: Update `initLusionAnimations` setup in `lusionAnimations.js`**
  Modify the scroll animation setup under `// 1. Text Splitting & GSAP Scroll Animation`.
  Implement separate Splitting for Line 1 and Line 2, dynamic wrapping helper, paragraph splitting, staggers, and the 8% faster parallax trigger.
  
  Replace the block starting with `const line1El = document.getElementById('home-reel-title-line-1');` and ending before `// 1.5. Pinning and Morphing Timeline` with:
  ```javascript
  const line1El = document.getElementById('home-reel-title-line-1');
  const line2El = document.getElementById('home-reel-title-line-2');
  const descEl = document.getElementById('home-reel-desc');
  const ctaEl = document.getElementById('home-reel-cta');
  
  if (line1El && line2El) {
    line1Split = new SplitType(line1El, { types: 'words' });
    line2Split = new SplitType(line2El, { types: 'words' });
    
    if (line1Split.words && line2Split.words) {
      // Helper function to wrap text of each word in an inner span
      const wrapWordContent = (wordsArray) => {
        return wordsArray.map(word => {
          // Style outer word element
          word.style.display = 'inline-block';
          word.style.overflow = 'hidden';
          word.style.verticalAlign = 'top';
          word.style.position = 'relative';
          
          // Create inner element
          const innerSpan = document.createElement('span');
          innerSpan.className = 'word-inner';
          innerSpan.style.display = 'inline-block';
          innerSpan.style.position = 'relative';
          
          // Move children into inner span
          while (word.firstChild) {
            innerSpan.appendChild(word.firstChild);
          }
          word.appendChild(innerSpan);
          return innerSpan;
        });
      };
      
      const line1Inners = wrapWordContent(line1Split.words);
      const line2Inners = wrapWordContent(line2Split.words);
      
      const wordBold = line1Split.words[0];
      const wordIdeas = line1Split.words[1];
      
      // Calculate layout horizontal difference based on the offset of the first word
      const getOffsetD = () => wordBold ? wordBold.offsetLeft : 0;
      
      // Create scroll-scrub timeline for choreographed transitions
      titleTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerEl,
          start: 'top 85%',
          end: 'top 15%',
          scrub: true,
          invalidateOnRefresh: true
        }
      });
      
      // --- PHASE 1: Vertical Reveal ---
      
      // Line 1 ("Bold Ideas,"): slide inner text upward (y: "100%" -> 0)
      const innerBold = line1Inners[0];
      const innerIdeas = line1Inners[1];
      
      titleTl.fromTo(innerBold, 
        { yPercent: 100 }, 
        { yPercent: 0, ease: 'power3.out', duration: 0.6 }, 
        0
      );
      titleTl.fromTo(innerIdeas, 
        { yPercent: 100 }, 
        { yPercent: 0, ease: 'power3.out', duration: 0.6 }, 
        0.15
      );
      
      // Line 2 ("Brought to Life"): slide inner text downward (y: "-100%" -> 0)
      const innerBrought = line2Inners[0];
      const innerTo = line2Inners[1];
      const innerLife = line2Inners[2];
      
      titleTl.fromTo(innerBrought, 
        { yPercent: -100 }, 
        { yPercent: 0, ease: 'power3.out', duration: 0.6 }, 
        0.2
      );
      titleTl.fromTo(innerTo, 
        { yPercent: -100 }, 
        { yPercent: 0, ease: 'power3.out', duration: 0.6 }, 
        0.3
      );
      titleTl.fromTo(innerLife, 
        { yPercent: -100 }, 
        { yPercent: 0, ease: 'power3.out', duration: 0.6 }, 
        0.4
      );
      
      // --- LINE 1 PHASE 2: Horizontal Slide to Right ---
      // Words slide from -D back to 0: "Ideas," first, then "Bold"
      titleTl.fromTo(wordIdeas, 
        { x: () => -getOffsetD() },
        { x: 0, ease: 'expo.out', duration: 0.5 }, 
        0.75
      );
      titleTl.fromTo(wordBold, 
        { x: () => -getOffsetD() },
        { x: 0, ease: 'expo.out', duration: 0.5 }, 
        0.85
      );
      
      // --- Paragraph/CTA Slide Up & Staggered Word reveal ---
      if (paragraphEl) {
        // Parent container slides up from further bottom (y: 150 -> 0) and fades in magnetically (expo.out)
        titleTl.fromTo(paragraphEl,
          { y: 150, opacity: 0 },
          { y: 0, opacity: 1, ease: 'expo.out', duration: 0.8 },
          0
        );
        
        if (descEl) {
          descSplit = new SplitType(descEl, { types: 'lines, words' });
          
          descSplit.lines.forEach((line, lineIdx) => {
            line.style.overflow = 'hidden';
            line.style.display = 'block';
            line.style.position = 'relative';
            
            const words = line.querySelectorAll('.word');
            words.forEach(word => {
              word.style.display = 'inline-block';
              word.style.position = 'relative';
            });
            
            titleTl.fromTo(words,
              { yPercent: 100 },
              { yPercent: 0, ease: 'power3.out', duration: 0.6, stagger: 0.03 },
              lineIdx * 0.1
            );
          });
          
          if (ctaEl) {
            titleTl.fromTo(ctaEl,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, ease: 'power3.out', duration: 0.6 },
              descSplit.lines.length * 0.1 + 0.1
            );
          }
        }
      }
      
      scrollTriggerInstance = titleTl.scrollTrigger;
      
      // --- Parallax Speedup (8% Faster) ---
      parallaxTween = gsap.to('#home-reel-content-inner', {
        y: () => -containerEl.offsetHeight * 0.08,
        ease: 'none',
        scrollTrigger: {
          trigger: containerEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
  ```

- [ ] **Step 4: Update `killLusionAnimations` cleanup function**
  Revert the SplitType instances in `killLusionAnimations` and kill the parallax scrollTrigger tween.
  
  Replace the block:
  ```javascript
    if (line1Split) {
      line1Split.revert();
      line1Split = null;
    }
    if (line2Split) {
      line2Split.revert();
      line2Split = null;
    }
  ```
  with:
  ```javascript
    if (line1Split) {
      line1Split.revert();
      line1Split = null;
    }
    if (line2Split) {
      line2Split.revert();
      line2Split = null;
    }
    if (descSplit) {
      descSplit.revert();
      descSplit = null;
    }
    if (parallaxTween) {
      if (parallaxTween.scrollTrigger) {
        parallaxTween.scrollTrigger.kill();
      }
      parallaxTween.kill();
      parallaxTween = null;
    }
  ```

- [ ] **Step 5: Verify the code compiles**
  Run: `npm run build`
  Expected: Success exit code 0.

- [ ] **Step 6: Commit changes**
  Run:
  ```bash
  git add lusion.html src/animations/lusionAnimations.js
  git commit -m "feat: implement paragraph staggers, magnetic snap, and 8% faster parallax scrolling"
  ```
