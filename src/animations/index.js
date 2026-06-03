import { initWhatsappGlow, killWhatsappGlow } from './whatsappGlow';
import { initCardAnimations, killCardAnimations } from './cardAnimations';
import { initBranchAnimations, killBranchAnimations, resetToDefaultBranch } from './branchAnimations';
import { initDynamicText, killDynamicText } from './dynamicText';
import { initLusionAnimations, killLusionAnimations } from './lusionAnimations';
import { initNavAnimations, killNavAnimations } from './navAnimations';
import { initHeroAnimations, killHeroAnimations } from './heroAnimations';

export { resetToDefaultBranch };

// Central registry to start all animations
export function initAnimations(isNavTriggered = false) {
  initWhatsappGlow();
  initCardAnimations();
  initBranchAnimations();
  initDynamicText();
  initLusionAnimations();
  initNavAnimations(false, isNavTriggered);
  initHeroAnimations();
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
}
