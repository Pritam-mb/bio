import React from 'react';
import ReactDOM from 'react-dom/client';
import DriftWall from './DriftWall';
import Shuffle from './Shuffle';
import CircularText from './CircularText';
import LogoLoop from './LogoLoop';
import Lanyard from './Lanyard';
import './DriftWall.css';
import './Lanyard.css';
import './Shuffle.css';
import './CircularText.css';
import './LogoLoop.css';

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
        text="SOFTWARE ENGINEER • ML RESEARCHER • "
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

// 4. Render Lanyard 3D scene into the #lanyard-root section
const lanyardRootEl = document.getElementById('lanyard-root');
if (lanyardRootEl) {
  const lanyardRoot = ReactDOM.createRoot(lanyardRootEl);
  lanyardRoot.render(
    <React.StrictMode>
      <Lanyard position={[0, 0, 30]} gravity={[0, -40, 0]} fov={20} />
    </React.StrictMode>
  );
}

// 5. Remove the old #root div that was causing layout shifting at the bottom
const oldRoot = document.getElementById('root');
if (oldRoot) {
  oldRoot.remove();
}