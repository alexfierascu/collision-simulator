import { CONFIG, calculateCanvasSize } from './config/config.js';
import { BOUNDARY_PADDING } from './config/constants.js';
import { state } from './state/SimulationState.js';
import { $, clearDomCache } from './ui/dom.js';
import { initWizard, loadFromUrl } from './ui/WizardController.js';
import { initControls } from './ui/ControlsController.js';
import { initAudioControls } from './ui/AudioControls.js';
import { initShareModal } from './ui/ShareModal.js';
import { initSaveLoad } from './ui/SaveLoadController.js';
import { initGraph } from './rendering/GraphRenderer.js';
import { takeScreenshot } from './rendering/ScreenshotRenderer.js';
import { init, animate } from './simulation/SimulationLoop.js';
import { initKeyboardHandler } from './simulation/KeyboardHandler.js';
import { applyExplosion, applyBlackhole } from './physics/forces.js';
import { spawnBall } from './physics/spawner.js';
import { boundaryStrategies } from './physics/boundaryStrategies.js';
import { initStarfield } from './rendering/StarfieldRenderer.js';
import { selectBall, clearSelection } from './state/SelectionState.js';
import { initBallTooltip } from './ui/BallTooltip.js';
import { distance } from './utils/math.js';
import { startWalkthrough, shouldShowWalkthrough, initWalkthroughButton, resumeWalkthroughForSim } from './ui/Walkthrough.js';
import { initPinchZoom, wasPinchRecent } from './ui/PinchZoom.js';
import { initFpsCounter } from './ui/FpsCounter.js';
import { initErrorHandler } from './utils/errorHandler.js';

initErrorHandler();

function findBallAtPoint(x, y) {
  // Search in reverse so topmost (last-drawn) balls get priority
  for (let i = state.balls.length - 1; i >= 0; i--) {
    const ball = state.balls[i];
    const dx = x - ball.x;
    const dy = y - ball.y;
    if (distance(dx, dy) <= ball.radius + 4) {
      return ball;
    }
  }
  return null;
}

function canvasPointerHandler(e) {
  let clientX, clientY;

  if (e.touches) {
    if (e.touches.length > 1 || wasPinchRecent()) return;
    e.preventDefault();
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const rect = state.canvas.getBoundingClientRect();
  const scaleX = state.canvas.width / rect.width;
  const scaleY = state.canvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  // Check if click is within the playable boundary
  const strategy = boundaryStrategies[CONFIG.boundaryShape];
  if (!strategy || !strategy.contains(x, y, state.centerX, state.centerY, state.boundaryRadius)) return;

  if (state.explosionMode) {
    applyExplosion(state.balls, x, y);
    state.forceEffects.push({ x, y, type: 'explosion', startTime: Date.now() });
  } else if (state.blackholeMode) {
    applyBlackhole(state.balls, x, y);
    state.forceEffects.push({ x, y, type: 'blackhole', startTime: Date.now() });
  } else {
    // Try to select a ball first
    const hitBall = findBallAtPoint(x, y);
    if (hitBall) {
      selectBall(hitBall.id);
    } else {
      clearSelection();
      spawnBall(x, y);
    }
  }
}

function setupSimulation() {
  clearDomCache();

  // Read basic config
  CONFIG.maxBalls      = parseInt($('maxBalls').value) || 100;
  CONFIG.ballRadius    = parseInt($('ballSize').value) || 6;
  CONFIG.spawnCooldown = parseInt($('spawnRate').value) || 200;
  CONFIG.initialSpeed  = parseInt($('initialSpeed').value) || 5;

  // Read advanced config
  CONFIG.maxSpeed             = parseFloat($('maxSpeedInput').value) || 15;
  CONFIG.minSpeed             = parseFloat($('minSpeedInput').value) || 2;
  CONFIG.repulsionMultiplier  = parseFloat($('repulsionInput').value) || 5;
  CONFIG.boundaryBoost        = parseFloat($('boundaryBoostInput').value) || 1.03;
  CONFIG.boundaryShape        = $('boundaryShape').value || 'circle';

  CONFIG.canvasSize = calculateCanvasSize(CONFIG.maxBalls, CONFIG.ballRadius);

  $('wizard').style.display = 'none';
  $('simulation-container').style.display = 'flex';

  // Reset modes
  state.isPaused = false;
  state.rainbowMode = false;
  state.explosionMode = false;
  state.blackholeMode = false;

  // Build canvas
  state.canvasWrapper = document.createElement('div');
  state.canvasWrapper.className = 'canvas-wrapper shape-' + CONFIG.boundaryShape;

  state.canvas = document.createElement('canvas');
  state.canvas.id = 'simulation';
  state.canvas.width = CONFIG.canvasSize;
  state.canvas.height = CONFIG.canvasSize;
  state.canvas.setAttribute('role', 'img');
  state.canvas.setAttribute('aria-label', 'Ball collision simulation canvas — click to spawn balls or trigger effects');
  state.canvasWrapper.appendChild(state.canvas);

  const pausedOverlay = document.createElement('div');
  pausedOverlay.className = 'paused-overlay';
  pausedOverlay.id = 'pausedOverlay';
  pausedOverlay.textContent = 'PAUSED';
  state.canvasWrapper.appendChild(pausedOverlay);

  const title = $('simulation-container').querySelector('h1');
  title.after(state.canvasWrapper);

  state.ctx = state.canvas.getContext('2d');
  state.centerX = state.canvas.width / 2;
  state.centerY = state.canvas.height / 2;
  state.boundaryRadius = state.canvas.width / 2 - BOUNDARY_PADDING;

  // Pointer handlers (mouse + touch)
  state.canvas.addEventListener('click', canvasPointerHandler);
  state.canvas.addEventListener('touchstart', canvasPointerHandler, { passive: false });

  // Reset callback
  const resetCallback = () => {
    if (state.animationId) cancelAnimationFrame(state.animationId);
    state.collisionHistory = [];
    state.graphStartIndex = 0;
    state.forceEffects = [];
    clearSelection();
    init();
    animate();
  };

  initControls(resetCallback);
  initAudioControls();
  initShareModal();
  $('screenshotBtn').addEventListener('click', takeScreenshot);

  initGraph();
  initKeyboardHandler();

  // Init new features
  initStarfield(state.canvasWrapper, CONFIG.canvasSize);
  initBallTooltip();
  initPinchZoom(state.canvasWrapper);
  initFpsCounter();

  init();
  animate();

  // Continue walkthrough into simulation phase if it was waiting
  initWalkthroughButton();
  resumeWalkthroughForSim();
}

// Bootstrap
initWizard(setupSimulation);
initSaveLoad();
loadFromUrl();

// Auto-launch walkthrough on first visit (wizard page)
if (shouldShowWalkthrough()) {
  setTimeout(() => startWalkthrough('wizard'), 400);
}

// Register service worker for offline PWA support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
