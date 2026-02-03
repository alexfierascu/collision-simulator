const STORAGE_KEY = 'collision-spawner-walkthrough-done';

// Phase 1: Wizard page steps
const WIZARD_STEPS = [
  {
    target: null,
    title: 'Welcome to Collision Spawner!',
    body: 'A physics playground where balls spawn from collisions. This quick tour will show you how everything works.',
    position: 'center',
  },
  {
    target: '.presets',
    title: 'Presets',
    body: 'Pick a vibe to start with: <strong>Chill</strong> for a relaxing few balls, <strong>Normal</strong> for balanced play, <strong>Chaos</strong> for mayhem, or <strong>Swarm</strong> for hundreds of tiny balls.',
    position: 'bottom',
  },
  {
    target: '.wizard-form',
    title: 'Configuration',
    body: 'Fine-tune ball count, size, spawn rate, speed, and boundary shape. There are also advanced settings for physics tweaks.',
    position: 'right',
  },
  {
    target: '#startBtn',
    title: 'Launch the Simulation',
    body: 'When you\'re ready, click <strong>Start Simulation</strong>. The tour will continue once the simulation loads.',
    position: 'top',
    waitForStart: true,
  },
];

// Phase 2: Simulation page steps
const SIM_STEPS = [
  {
    target: '.canvas-wrapper',
    title: 'The Simulation',
    body: 'Balls spawn, bounce, and collide inside this arena. <strong>Click empty space</strong> to spawn a new ball, or <strong>click a ball</strong> to select it and see its stats.',
    position: 'bottom',
    spotlightRound: true,
    spotlightPad: 8,
  },
  {
    target: '.stats',
    title: 'Live Stats',
    body: 'Track ball count, total collisions, average & max speed, elapsed time, and collisions per second in real time.',
    position: 'bottom',
  },
  {
    target: '.graph-container',
    title: 'Collision Graph',
    body: 'This chart shows the collision rate over the last 30 seconds so you can spot patterns and bursts.',
    position: 'bottom',
  },
  {
    target: '.controls',
    title: 'Main Controls',
    body: '<strong>Pause</strong> / <strong>Reset</strong> the sim, enable <strong>Rainbow</strong> mode for color cycling, or use <strong>Explosion</strong> & <strong>Black Hole</strong> to push or pull balls on click.',
    position: 'bottom',
  },
  {
    target: '#colorTheme',
    title: 'Color Themes',
    body: 'Switch between 5 ball color palettes: Neon, Retro, Mono, Ocean, and Sunset. Press <kbd>4</kbd> to cycle through them.',
    position: 'bottom',
  },
  {
    target: '#themeToggleBtn',
    title: 'Dark / Light Mode',
    body: 'Toggle between dark and light appearance for the entire UI and canvas. Press <kbd>T</kbd> as a shortcut.',
    position: 'bottom',
  },
  {
    target: '#recordBtn',
    title: 'Video Recording',
    body: 'Record a 5-second video clip of the simulation. It auto-stops and downloads as a WebM file. Press <kbd>V</kbd> to start.',
    position: 'bottom',
  },
  {
    target: '.controls-secondary',
    title: 'More Tools',
    body: '<strong>Screenshot</strong> saves a PNG, <strong>Share</strong> generates a URL with a preview image, and <strong>Fullscreen</strong> goes immersive.',
    position: 'top',
  },
  {
    target: '.audio-panel',
    title: 'Music Player',
    body: 'Pick from 12 procedurally generated music styles (ambient & energetic) and adjust the volume. Press <kbd>M</kbd> to toggle.',
    position: 'bottom',
  },
  {
    target: '.keyboard-hints',
    title: 'Keyboard Shortcuts',
    body: 'All major actions have keyboard shortcuts shown here. <kbd>Space</kbd> to pause, <kbd>Esc</kbd> to deselect, and more.',
    position: 'top',
  },
  {
    target: null,
    title: 'You\'re All Set!',
    body: 'Go ahead and experiment. Click <kbd>? Tour</kbd> in the toolbar anytime to replay this tour. Have fun!',
    position: 'center',
  },
];

let overlay = null;
let spotlight = null;
let card = null;
let currentStep = -1;
let isActive = false;
let phase = 'wizard'; // 'wizard' or 'sim'
let waitingForSim = false;

function getSteps() {
  return phase === 'wizard' ? WIZARD_STEPS : SIM_STEPS;
}

function getTotalSteps() {
  return WIZARD_STEPS.length + SIM_STEPS.length;
}

function getGlobalIndex() {
  return phase === 'wizard' ? currentStep : WIZARD_STEPS.length + currentStep;
}

function createElement(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function buildDOM() {
  if (overlay) return;

  overlay = createElement('div', 'wt-overlay');
  spotlight = createElement('div', 'wt-spotlight');
  card = createElement('div', 'wt-card');

  overlay.appendChild(spotlight);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay && !waitingForSim) next();
  });
}

function destroyDOM() {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  overlay = null;
  spotlight = null;
  card = null;
}

function getTargetRect(step) {
  if (!step.target) return null;
  const el = document.querySelector(step.target);
  if (!el) return null;
  return el.getBoundingClientRect();
}

function positionSpotlight(rect, step) {
  if (!rect) {
    spotlight.style.opacity = '0';
    spotlight.style.pointerEvents = 'none';
    return;
  }

  const pad = step.spotlightPad || 6;
  spotlight.style.opacity = '1';
  spotlight.style.top = (rect.top - pad) + 'px';
  spotlight.style.left = (rect.left - pad) + 'px';
  spotlight.style.width = (rect.width + pad * 2) + 'px';
  spotlight.style.height = (rect.height + pad * 2) + 'px';
  spotlight.classList.toggle('round', !!step.spotlightRound);
}

function positionCard(rect, step) {
  card.style.top = '';
  card.style.left = '';
  card.style.right = '';
  card.style.bottom = '';

  if (step.position === 'center' || !rect) {
    card.style.top = '50%';
    card.style.left = '50%';
    card.style.transform = 'translate(-50%, -50%)';
    return;
  }

  card.style.transform = '';
  const cardRect = card.getBoundingClientRect();
  const gap = 14;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left;

  if (step.position === 'bottom') {
    top = rect.bottom + gap;
    left = rect.left + rect.width / 2 - cardRect.width / 2;
  } else if (step.position === 'top') {
    top = rect.top - gap - cardRect.height;
    left = rect.left + rect.width / 2 - cardRect.width / 2;
  } else {
    // right
    top = rect.top + rect.height / 2 - cardRect.height / 2;
    left = rect.right + gap;
  }

  // Flip vertically if off-screen
  if (top + cardRect.height > vh - 16) {
    top = rect.top - gap - cardRect.height;
  }
  if (top < 16) {
    top = rect.bottom + gap;
  }

  // Flip horizontally if off-screen (for 'right' position)
  if (left + cardRect.width > vw - 16) {
    left = rect.left - gap - cardRect.width;
  }

  // Clamp
  left = Math.max(16, Math.min(left, vw - cardRect.width - 16));
  top = Math.max(16, Math.min(top, vh - cardRect.height - 16));

  card.style.top = top + 'px';
  card.style.left = left + 'px';
}

function renderCard(step, index) {
  const total = getTotalSteps();
  const globalIdx = getGlobalIndex();
  const isFirst = globalIdx === 0;
  const isLast = globalIdx === total - 1;

  let dotsHTML = '';
  for (let i = 0; i < total; i++) {
    const cls = i === globalIdx ? 'active' : i < globalIdx ? 'done' : '';
    dotsHTML += `<span class="wt-dot ${cls}"></span>`;
  }

  let nextLabel = 'Next';
  if (step.waitForStart) nextLabel = 'Start Sim';
  if (isLast) nextLabel = 'Finish';

  card.innerHTML = `
    <div class="wt-card-step">Step ${globalIdx + 1} of ${total}</div>
    <div class="wt-card-title">${step.title}</div>
    <div class="wt-card-body">${step.body}</div>
    <div class="wt-card-footer">
      <div class="wt-dots">${dotsHTML}</div>
      <div class="wt-card-buttons">
        ${isFirst ? '<button class="wt-btn skip" data-action="skip">Skip</button>' : '<button class="wt-btn" data-action="back">Back</button>'}
        <button class="wt-btn primary" data-action="${isLast ? 'finish' : 'next'}">${nextLabel}</button>
      </div>
    </div>
  `;

  card.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      if (action === 'next') next();
      else if (action === 'back') back();
      else if (action === 'skip' || action === 'finish') finish();
    });
  });
}

function showStep(index) {
  const steps = getSteps();
  if (index < 0 || index >= steps.length) {
    if (phase === 'wizard' && index >= steps.length) {
      // Shouldn't happen normally — handled by waitForStart
      return;
    }
    finish();
    return;
  }

  currentStep = index;
  const step = steps[index];

  card.classList.remove('visible');

  if (step.target) {
    const el = document.querySelector(step.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  setTimeout(() => {
    renderCard(step, index);
    const rect = getTargetRect(step);
    positionSpotlight(rect, step);
    positionCard(rect, step);

    requestAnimationFrame(() => {
      card.classList.add('visible');
    });
  }, 100);
}

function next() {
  if (waitingForSim) return;

  const steps = getSteps();
  const step = steps[currentStep];

  // If this step has waitForStart, click the Start button and pause
  if (step && step.waitForStart) {
    waitingForSim = true;
    card.classList.remove('visible');
    spotlight.style.opacity = '0';
    overlay.classList.remove('active');

    // Click the start button
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.click();
    return;
  }

  if (currentStep + 1 >= steps.length) {
    if (phase === 'wizard') {
      // Move to sim phase (shouldn't reach here normally)
      return;
    }
    finish();
    return;
  }

  showStep(currentStep + 1);
}

function back() {
  if (waitingForSim) return;

  if (currentStep > 0) {
    showStep(currentStep - 1);
  } else if (phase === 'sim') {
    // Go back to last wizard step — but wizard DOM is gone, so just stay
  }
}

function finish() {
  isActive = false;
  waitingForSim = false;
  phase = 'wizard';

  if (card) card.classList.remove('visible');
  if (overlay) overlay.classList.remove('active');
  if (spotlight) spotlight.style.opacity = '0';

  setTimeout(destroyDOM, 350);

  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch (_) {}
}

// Called by main.js after simulation starts, to continue the tour
export function resumeWalkthroughForSim() {
  if (!waitingForSim) return;
  waitingForSim = false;
  phase = 'sim';
  currentStep = -1;

  // Rebuild DOM (old one was removed during transition)
  buildDOM();
  overlay.classList.add('active');

  // Small delay for the simulation to render
  setTimeout(() => showStep(0), 500);
}

export function startWalkthrough(startPhase) {
  if (isActive) return;
  isActive = true;
  currentStep = -1;
  phase = startPhase || 'wizard';
  waitingForSim = false;

  buildDOM();
  overlay.classList.add('active');
  showStep(0);
}

export function isWalkthroughActive() {
  return isActive;
}

export function shouldShowWalkthrough() {
  try {
    return !localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return false;
  }
}

export function initWalkthroughButton() {
  const btn = document.getElementById('walkthroughBtn');
  if (btn) {
    btn.addEventListener('click', () => startWalkthrough('sim'));
  }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!isActive || waitingForSim) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    finish();
  } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
    e.stopPropagation();
    next();
  } else if (e.key === 'ArrowLeft') {
    e.stopPropagation();
    back();
  }
}, true);
