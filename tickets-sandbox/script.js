import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  baseGravity: 0.1,         // Base falling speed multiplier
  gravityVarianceMin: 0.1,  // Minimum random vy speed
  gravityVarianceMax: 0.6,  // Maximum random vy speed
  scrollSensitivity: 0.05,  // Sensitivity mapping scrollDiff to card speed multiplier
  rotationVarianceMin: -30, // Spawn rotation min degrees
  rotationVarianceMax: 30,  // Spawn rotation max degrees
  rotationSpeedMin: -0.1,   // Spawn spin speed min
  rotationSpeedMax: 0.1,    // Spawn spin speed max
  zIndexProb: 0.75,         // Probability of card being z-index 1 (rest are z-index 3)
};

class TicketGravitySandbox {
  constructor() {
    this.el = document.querySelector(".s-tickets-home");
    this.content = document.querySelector(".js-content");
    this.ticketElements = Array.from(document.querySelectorAll(".js-ticket"));
    this.tickets = [];
    this.scroll = {
      top: window.scrollY,
      prevTop: window.scrollY,
      diff: 0,
      direction: 1
    };
    this.lastNonZeroDirection = 1;
    this.safeWidth = window.innerWidth;
    this.safeHeight = window.innerHeight;
  }

  init() {
    this.initLenis();
    this.setSizes();
    this.setTickets();
    this.initScrollTrigger();
    
    // Bind resize
    window.addEventListener("resize", () => this.onResize());

    // Start tick loop
    this.tickBind = () => this.tick();
    gsap.ticker.add(this.tickBind);
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    this.lenis.on("scroll", (e) => {
      this.scroll.top = e.scroll;
      this.scroll.diff = this.scroll.top - this.scroll.prevTop;
      this.scroll.prevTop = this.scroll.top;
      if (e.direction !== 0) {
        this.scroll.direction = e.direction;
        this.lastNonZeroDirection = e.direction;
      }
    });

    this.lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  onResize() {
    this.safeWidth = window.innerWidth;
    this.safeHeight = window.innerHeight;
    this.setSizes();
    this.setTickets();
  }

  setSizes() {
    if (!this.content) return;
    const rect = this.content.getBoundingClientRect();
    const diag = Math.hypot(rect.width, rect.height);
    this.el.style.setProperty("--content-height", `${rect.height}px`);
    this.el.style.setProperty("--content-diag", `${diag}px`);
  }

  setTickets() {
    if (this.ticketElements.length < 2) return;
    const secondCard = this.ticketElements[1];
    const rect = secondCard.getBoundingClientRect();
    const radius = Math.hypot(rect.width, rect.height) / 2;

    this.tickets = [];
    this.ticketElements.forEach((el, index) => {
      if (el.offsetWidth === 0) return;
      el.style.setProperty("--radius", `${radius}px`);

      const ticket = {
        el: el,
        i: index,
        x: 0,
        y: null, // trigger random screen placement in initTicket
        radius: radius,
        rotation: 0,
        vr: 0,
        vy: 0.1,
        nvy: 0.1,
        svy: 0.1
      };
      
      this.tickets.push(this.initTicket(ticket));
    });
  }

  initTicket(ticket) {
    const isSpawn = ticket.y === null;
    
    if (isSpawn) {
      ticket.y = Math.random() * this.safeHeight;
    } else {
      ticket.y = ticket.nvy < 0 ? this.safeHeight + 2 * ticket.radius : -2 * ticket.radius;
    }

    ticket.x = this.safeWidth * Math.random();
    ticket.rotation = Math.random() * (CONFIG.rotationVarianceMax - CONFIG.rotationVarianceMin) + CONFIG.rotationVarianceMin;
    ticket.vr = Math.random() * (CONFIG.rotationSpeedMax - CONFIG.rotationSpeedMin) + CONFIG.rotationSpeedMin;
    ticket.vy = CONFIG.baseGravity + Math.random() * (CONFIG.gravityVarianceMax - CONFIG.gravityVarianceMin);
    ticket.nvy = ticket.vy;
    ticket.svy = ticket.vy;

    if (!ticket.el.classList.contains("sb-ticket--title")) {
      ticket.el.style.zIndex = Math.random() < CONFIG.zIndexProb ? "1" : "3";
    }

    return ticket;
  }

  initScrollTrigger() {
    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.el,
        start: "top 100%",
        end: "bottom 0%",
        scrub: 0.75
      }
    });

    this.tl.fromTo(
      this.content,
      { y: "100%" },
      { y: "-100%", ease: "none", duration: 1 },
      0
    );
  }

  tick() {
    let t = -CONFIG.scrollSensitivity * this.scroll.diff;
    
    // Clamp the magnitude of t to at least 1 in the direction of the last scroll direction
    // Down scroll (direction=1) -> float UP (negative t); Up scroll (direction=-1) -> float DOWN (positive t)
    const baseSign = -this.lastNonZeroDirection;
    if (Math.abs(t) < 1) {
      t = baseSign;
    }

    this.tickets.forEach((ticket) => {
      ticket.nvy = ticket.vy * t * 5;
      ticket.svy += 0.5 * (ticket.nvy - ticket.svy);
      ticket.y += ticket.svy;
      ticket.rotation += ticket.vr * t * 2;

      ticket.el.style.transform = `translate3d(${ticket.x}px, ${ticket.y}px, 0) rotate(${ticket.rotation}deg)`;

      const offscreenUp = ticket.nvy < 0 && ticket.y < -2.1 * ticket.radius;
      const offscreenDown = ticket.nvy > 0 && ticket.y > this.safeHeight + 2.1 * ticket.radius;

      if (offscreenUp || offscreenDown) {
        this.initTicket(ticket);
      }
    });

    this.scroll.diff *= 0.9;
    if (Math.abs(this.scroll.diff) < 0.1) {
      this.scroll.diff = 0;
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const sandbox = new TicketGravitySandbox();
  sandbox.init();
});
