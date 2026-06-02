import { initWhatsappGlow, killWhatsappGlow } from './whatsappGlow';
import { initCardAnimations, killCardAnimations } from './cardAnimations';
import { initBranchAnimations, killBranchAnimations, resetToDefaultBranch } from './branchAnimations';
import { initDynamicText, killDynamicText } from './dynamicText';
import { initLusionAnimations, killLusionAnimations } from './lusionAnimations';

export { resetToDefaultBranch };

// Central registry to start all animations
export function initAnimations() {
  initWhatsappGlow();
  initCardAnimations();
  initBranchAnimations();
  initDynamicText();
  initLusionAnimations();
}

// Central registry to clean up all animations on page leave
export function killAnimations() {
  killWhatsappGlow();
  killCardAnimations();
  killBranchAnimations();
  killDynamicText();
  killLusionAnimations();
}
