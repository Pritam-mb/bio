import React from 'react';
import ReactDOM from 'react-dom/client';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import DriftWall from './DriftWall';
import Shuffle from './Shuffle';
import CircularText from './CircularText';
import LogoLoop from './LogoLoop';
import './DriftWall.css';
import './Shuffle.css';
import './CircularText.css';
import './LogoLoop.css';

// Buttery smooth inertial scrolling (Lenis 1.3+).
// Universal support across mice, trackpads, and pointers, with reduced-motion respected.
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
    infinite: false,
    autoRaf: false,
  });
  window.__lenis = lenis;

  // Integrate with GSAP ticker & ScrollTrigger
  let wired = false;
  const wireGsap = () => {
    if (wired || !window.gsap) return false;
    wired = true;
    if (window.ScrollTrigger) {
      lenis.on('scroll', window.ScrollTrigger.update);
    }
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
    return true;
  };

  if (!wireGsap()) {
    const loop = (time) => {
      lenis.raf(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    window.addEventListener('load', () => {
      wireGsap();
      lenis.resize();
    });
  }

  window.addEventListener('resize', () => {
    lenis.resize();
  });
}

// Interactive spotlight tracking on cards (--mx, --my)
document.addEventListener('pointermove', (e) => {
  const card = e.target && e.target.closest ? e.target.closest('.project-card, .pub-card, .ach-card, .about-card, .term') : null;
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${(e.clientX - rect.left).toFixed(1)}px`);
  card.style.setProperty('--my', `${(e.clientY - rect.top).toFixed(1)}px`);
});

// 1. Create DriftWall Root dynamically and prepend to body to fix layout shifting
const driftWallContainer = document.createElement('div');
driftWallContainer.id = 'driftwall-root';
driftWallContainer.style.position = 'fixed';
driftWallContainer.style.inset = '0';
driftWallContainer.style.zIndex = '-2';
driftWallContainer.style.pointerEvents = 'none';
driftWallContainer.style.opacity = '0.5';
driftWallContainer.style.overflow = 'hidden';
document.body.insertBefore(driftWallContainer, document.body.firstChild);

const driftRoot = ReactDOM.createRoot(driftWallContainer);

// Phones can't afford the full-size wall: fewer columns + smaller tiles means
// far fewer offscreen images to fetch and far less per-frame transform work.
const compactDrift = window.matchMedia('(max-width: 768px)').matches;

// Moody, galactic images for the drifting background wall
const items = [
  { image: 'https://picsum.photos/id/1062/600/400', title: 'Nebula', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1084/600/400', title: 'Void', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1079/600/400', title: 'Midnight', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1043/600/400', title: 'Drift', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1050/600/400', title: 'Cosmos', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1069/600/400', title: 'Horizon', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1053/600/400', title: 'Gravity', href: 'https://github.com/pritam-mb' },
  { image: 'https://picsum.photos/id/1080/600/400', title: 'Eclipse', href: 'https://github.com/pritam-mb' },
];

driftRoot.render(
  <React.StrictMode>
    <DriftWall
      items={items}
      columns={compactDrift ? 3 : 5}
      tileWidth={compactDrift ? 150 : 200}
      tileHeight={compactDrift ? 100 : 132}
      gap={compactDrift ? 12 : 18}
      tilt={16}
      turn={-14}
      perspective={1200}
      depth={120}
      speed={compactDrift ? 26 : 36}
      direction="up"
      variance={0.45}
      parallax={0.6}
      lift={64}
      fade={0.55}
      dim={0.5}
      grayscale={true}
      overlayColor="#040405"
    />
  </React.StrictMode>
);

// 2. Render Shuffle into existing #heroName without altering index.html
const heroNameEl = document.getElementById('heroName');
if (heroNameEl) {
  // Clear the existing text content
  heroNameEl.innerHTML = '';
  const heroNameRoot = ReactDOM.createRoot(heroNameEl);
  heroNameRoot.render(
    <React.StrictMode>
      <Shuffle
        text="Pritam Patra"
        triggerOnScroll={false}
        animationDuration={0.6}
        as="span"
      />
    </React.StrictMode>
  );
}

// 2b. Render CircularText ring around the hero avatar
const heroAvatarRingEl = document.getElementById('heroAvatarRing');
if (heroAvatarRingEl) {
  const heroAvatarRingRoot = ReactDOM.createRoot(heroAvatarRingEl);
  heroAvatarRingRoot.render(
    <React.StrictMode>
      <CircularText
        text="AI FULL STACK DEVELOPER • SOFTWARE ENGINEER • "
        spinDuration={22}
        onHover="slowDown"
      />
    </React.StrictMode>
  );
}

// 3. Render the LogoLoop tech-stack marquee at the bottom (after contact)
const logoLoopRootEl = document.getElementById('logoLoopRoot');
if (logoLoopRootEl) {
  const logoLoopRoot = ReactDOM.createRoot(logoLoopRootEl);

  const stackLogos = [
    { src: '/images/react.png', alt: 'React' },
    { src: '/images/node.png', alt: 'Node.js' },
    { src: '/images/mongo.png', alt: 'MongoDB' },
    { src: '/images/redis.png', alt: 'Redis' },
    { src: '/images/prisma.png', alt: 'Prisma' },
    { src: '/images/three.png', alt: 'Three.js' },
    { src: '/images/websocket.png', alt: 'WebSockets' },
    { src: '/images/steller.png', alt: 'Stellar' },
    { src: '/images/react.png', alt: 'React Native' },
    { src: '/images/node.png', alt: 'Express' },
  ];

  logoLoopRoot.render(
    <React.StrictMode>
      <LogoLoop
        logos={stackLogos}
        speed={100}
        direction="left"
        logoHeight={36}
        gap={32}
        fadeOut={true}
        scaleOnHover={true}
        ariaLabel="Tech stack logos"
      />
    </React.StrictMode>
  );
}

// 4. Remove the old #root div that was causing layout shifting at the bottom
const oldRoot = document.getElementById('root');
if (oldRoot) {
  oldRoot.remove();
}