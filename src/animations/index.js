import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initWhatsappGlow, killWhatsappGlow } from './whatsappGlow';
import { initCardAnimations, killCardAnimations } from './cardAnimations';
import { initBranchAnimations, killBranchAnimations, resetToDefaultBranch } from './branchAnimations';
import { initDynamicText, killDynamicText } from './dynamicText';
import { initLusionAnimations, killLusionAnimations } from './lusionAnimations';
import { initNavAnimations, killNavAnimations } from './navAnimations';
import { initHeroAnimations, killHeroAnimations } from './heroAnimations';
import { initOverwhelmingAnimations, killOverwhelmingAnimations } from './overwhelmingAnimations';
import { initDataFlowAnimations, killDataFlowAnimations } from './dataFlowAnimations';
import { initItGlassFlowAnimations, killItGlassFlowAnimations } from './itGlassFlowAnimations';

export { resetToDefaultBranch, initDataFlowAnimations, killDataFlowAnimations, initItGlassFlowAnimations, killItGlassFlowAnimations };

// Central registry to start all animations
export function initAnimations(isNavTriggered = false) {
  initWhatsappGlow();
  initCardAnimations();
  initBranchAnimations();
  initDynamicText();
  initLusionAnimations();
  initNavAnimations(false, isNavTriggered);
  initHeroAnimations();
  initDataFlowAnimations();
  initItGlassFlowAnimations();
  
  if (document.querySelector('.overwhelming-track')) {
    initOverwhelmingAnimations();
  }
  
  // Force ScrollTrigger to calculate accurate bounds after layout setup
  ScrollTrigger.refresh();
}

// Central registry to clean up all animations on page leave
export function killAnimations() {
  killWhatsappGlow();
  killCardAnimations();
  killBranchAnimations();
  killDynamicText();
  killLusionAnimations();
  killNavAnimations();
  killHeroAnimations();
  killOverwhelmingAnimations();
  killDataFlowAnimations();
  killItGlassFlowAnimations();
}
