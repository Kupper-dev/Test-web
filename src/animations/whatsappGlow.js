import { gsap } from 'gsap';

let activeAnimation = null;

export function initWhatsappGlow() {
  // ======= CONFIGURATION =======
  const base_color        = '#000000';  // Normal color
  const active_color      = '#00fc66';  // Brightest active color
  const glow_color        = '#a5ff44';  // Glow color
  const kernel_step       = 0.25;       // Dropoff per letter
  const per_letter_secs   = 0.18;       // Speed per letter
  const loop_delay_secs   = 1.1;        // Delay between cycles
  const glow_blur_px      = 16;         // Glow intensity
  const max_alpha_glow    = 0.55;       // Max glow opacity
  const easing_sweep      = 'sine.inOut'; // Easing curve
  // =============================

  const el = document.querySelector('.button_text_gradient');
  if (!el) return;

  const text = el.textContent.trim() || 'Whatsapp';
  el.innerHTML = '';
  const chars = [];
  
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
    chars.push(span);
  }

  const hex_to_rgb = (hex) => {
    const s = hex.replace('#','');
    const b = s.length === 3
      ? s.split('').map(c => parseInt(c+c,16))
      : [s.slice(0,2), s.slice(2,4), s.slice(4,6)].map(h => parseInt(h,16));
    return { r:b[0], g:b[1], b:b[2] };
  };
  
  const mix_rgb = (a, b, t) => ({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  });
  
  const rgb_str = (o) => `rgb(${o.r}, ${o.g}, ${o.b})`;
  const rgba_str = (o, a) => `rgba(${o.r}, ${o.g}, ${o.b}, ${a})`;

  const base_rgb   = hex_to_rgb(base_color);
  const active_rgb = hex_to_rgb(active_color);
  const glow_rgb   = hex_to_rgb(glow_color);

  const set_color  = chars.map(ch => gsap.quickSetter(ch, 'color'));
  const set_shadow = chars.map(ch => gsap.quickSetter(ch, 'textShadow'));

  const max_distance = Math.round(1 / kernel_step);
  const weight_for_distance = (d) => Math.max(0, 1 - kernel_step * d);

  function shadow_for_intensity(intensity) {
    if (intensity <= 0) return 'none';
    const a1 = Math.min(max_alpha_glow, max_alpha_glow * intensity);
    const a2 = a1 * 0.6;
    const a3 = a1 * 0.35;
    const b1 = glow_blur_px * 0.7;
    const b2 = glow_blur_px * 1.4;
    const b3 = glow_blur_px * 2.4;
    return [
      `0 0 ${b1}px ${rgba_str(glow_rgb, a1)}`,
      `0 0 ${b2}px ${rgba_str(glow_rgb, a2)}`,
      `0 0 ${b3}px ${rgba_str(glow_rgb, a3)}`
    ].join(', ');
  }

  const state = { pos: -max_distance };
  const total_span = (chars.length - 1) + 2 * max_distance;
  const duration = per_letter_secs * total_span;

  function render() {
    for (let i = 0; i < chars.length; i++) {
      const d = Math.abs(i - state.pos);
      const w = weight_for_distance(d);
      const c = mix_rgb(base_rgb, active_rgb, w);
      set_color[i](rgb_str(c));
      set_shadow[i](shadow_for_intensity(w));
    }
  }

  // Create timeline for easy control
  activeAnimation = gsap.to(state, {
    pos: (chars.length - 1) + max_distance,
    duration,
    ease: easing_sweep,
    repeat: -1,
    repeatDelay: loop_delay_secs,
    onUpdate: render,
    onRepeat: render
  });

  render();
}

export function killWhatsappGlow() {
  if (activeAnimation) {
    activeAnimation.kill();
    activeAnimation = null;
  }
}
