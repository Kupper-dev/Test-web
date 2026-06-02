# Lusion Text Animation and Styling Design Spec

Redesign the typography, layout, and scroll-trigger animations of the home-reel intro text section to match Lusion's premium website presentation.

## Proposed Changes

### 1. Typography & Grid Layout Updates

#### [MODIFY] [lusion.html](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/lusion.html)
- Load Google Fonts "Outfit" (weights 300, 400, 500, 600).
- Scope Outfit to `#home-reel` and headers.
- Update CSS for title:
  - Font family: `'Outfit', sans-serif`
  - Font weight: `300` (or `400`)
  - Line-height: `0.9` (compact, overlapping rows)
  - Letter-spacing: `-0.04em`
  - Text transformation: Capitalized
- Inner Container `#home-reel-title-inner`:
  - Change to `display: inline-flex; flex-direction: column; align-items: stretch;` so its width is sized exactly to the longer Line 2.
- Line 1 `#home-reel-title-line-1`:
  - Change to `text-align: right; overflow: hidden;` so it aligns precisely to the right edge of "Life" in Line 2.
- Line 2 `#home-reel-title-line-2`:
  - Change to `text-align: left; overflow: hidden;`.
- Paragraph & CTA Button styling:
  - Add inner container wrapper `#home-reel-content-inner` inside `#home-reel-content`.
  - Update CTA button to match Lusion's premium white pill button:
    - White background, black text, border-radius 100px, padding 12px 28px, shadow.
    - Transform text to uppercase: `OUR APPROACH`.
    - Simple black dot icon in front.
  - Update description text to include the full trailing sentence: `"we build work that captures attention and invites interaction."`

### 2. Scroll Animation Updates

#### [MODIFY] [lusionAnimations.js](file:///Users/usuario/Desktop/Kupper/Dev/test%202%20web%20osmo/src/animations/lusionAnimations.js)
- Run independent `SplitType` objects on each title line to separate words:
  ```javascript
  const line1Split = new SplitType('#home-reel-title-line-1', { types: 'words' });
  const line2Split = new SplitType('#home-reel-title-line-2', { types: 'words' });
  ```
- Wrap each word's content in a `span` with class `word-inner` (display inline-block) to act as the vertical sliding element, and set the outer `.word` element's style to `overflow: hidden; display: inline-block; vertical-align: top;` to act as the clipping container.
- Calculate the horizontal shift offset `D` as `wordBold.offsetLeft` (which returns the layout distance between the left edge of Line 1 and the word "Bold", representing the exact right-alignment shift).
- Build a combined scrubbed timeline (`titleTl`) linked to `#home-reel` scroll:
  - **Line 1 ("Bold Ideas,") Phase 1 (starts at 0.0s)**:
    - Animate words from `x: -D` to keep them left-aligned (aligning "Bold" vertically with "Brought").
    - Word 1 Inner ("Bold"): y: `100%` to `0` (duration `0.6s`, ease `power3.out`, start `0.0s`).
    - Word 2 Inner ("Ideas,"): y: `100%` to `0` (duration `0.6s`, ease `power3.out`, start `0.15s`).
  - **Line 2 ("Brought to Life") Phase 1 (starts at 0.2s)**:
    - Word 1 Inner ("Brought"): y: `-100%` to `0` (duration `0.6s`, ease `power3.out`, start `0.2s`).
    - Word 2 Inner ("to"): y: `-100%` to `0` (duration `0.6s`, ease `power3.out`, start `0.3s`).
    - Word 3 Inner ("Life"): y: `-100%` to `0` (duration `0.6s`, ease `power3.out`, start `0.4s`).
  - **Line 1 ("Bold Ideas,") Phase 2 (starts at 0.75s)**:
    - Animate words horizontally from left-aligned starting position (`x: -D`) to right-aligned resting position (`x: 0`).
    - Word 2 ("Ideas,"): `fromTo` `x: -D` to `0` (duration `0.5s`, ease `expo.out`, start `0.75s`).
    - Word 1 ("Bold"): `fromTo` `x: -D` to `0` (duration `0.5s`, ease `expo.out`, start `0.85s`).
  - **Paragraph (`#home-reel-content`) Entrance**:
    - Animate parent container `#home-reel-content` from `y: 150` and `opacity: 0` to `y: 0` and `opacity: 1` with a snappy `expo.out` ease (duration `0.8s`, starting at `0.0s` in timeline).
    - Split `#home-reel-desc` paragraph into lines and words:
      `descSplit = new SplitType('#home-reel-desc', { types: 'lines, words' });`
    - Loop over lines in description. Set each line to `overflow: hidden; display: block;` and words inside them to `display: inline-block;`.
    - Stagger vertical slide-up of words inside each line: `yPercent: 100` to `0` (duration `0.6s`, ease `power3.out`, stagger `0.03` between words in a line, and `lineIdx * 0.1` starting delay per line).
    - Animate the CTA button `#home-reel-cta` from `y: 30` and `opacity: 0` to `y: 0` and `opacity: 1` with `power3.out` starting after the description lines finish (delay `descSplit.lines.length * 0.1 + 0.1`).
  - **Parallax Speedup (8% Faster)**:
    - Use a separate scroll-scrubbed tween targeting the inner wrapper `#home-reel-content-inner`:
      ```javascript
      gsap.to('#home-reel-content-inner', {
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
    - Track the tween as `parallaxTween` and call `.kill()` during cleanup.

## Verification Plan

### Manual Verification
- Load page in local browser and scroll down.
- Verify that the paragraph slides up with a magnetic snap, and the words inside stagger and slide up within their lines.
- Verify that when scrolling, the paragraph content moves 8% faster (parallax effect) than the rest of the page elements.
