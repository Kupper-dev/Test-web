import { gsap } from 'gsap';

let currentBranch = 0;
let defaultBranch = 0;

function determineDefaultBranch() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('branch-2')) return 1;
  if (path.includes('branch-3')) return 2;
  return 0; // Default to Inicio
}

export function initBranchAnimations() {
  const buttons = document.querySelectorAll('[data-branch-btn]');
  const branches = document.querySelectorAll('[data-branch]');
  if (!buttons.length || !branches.length) return;

  defaultBranch = determineDefaultBranch();
  currentBranch = defaultBranch;

  // Initialize hidden branches
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
    btn.addEventListener('click', () => switchBranch(index, buttons, branches));
    btn.addEventListener('mouseenter', () => switchBranch(index, buttons, branches));
  });
}

export function resetToDefaultBranch() {
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
    
    // Kill existing tweens to allow seamless interruptions
    gsap.killTweensOf(branch);
    gsap.killTweensOf(cols);
    gsap.killTweensOf(items);

    if (index === newIndex) {
      // INCOMING BRANCH
      branch.classList.add('is--active');
      
      gsap.to(branch, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power3.out"
      });

      // Only reset the start positions if it was fully hidden
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
        delay: 0.1 // slight delay to let the macro slide start
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
      // OUTGOING BRANCH(ES)
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

export function killBranchAnimations() {
  const branches = document.querySelectorAll('[data-branch]');
  branches.forEach(branch => gsap.killTweensOf(branch));
}
