import { $, clearDomCache } from './dom.js';
import { state } from '../state/SimulationState.js';
import { updateModeIndicator } from './ModeIndicator.js';
import { stopAndReset as stopAudio } from '../audio/AudioManager.js';
import { setColorTheme, toggleLightMode, isLight, getActiveColors } from '../state/ThemeState.js';
import { trackThemeUsed, showAchievementsModal, trackAction } from '../achievements/Achievements.js';
import { toggleRecording } from '../recording/RecordingController.js';
import { destroyStarfield } from '../rendering/StarfieldRenderer.js';
import { destroyBallTooltip } from './BallTooltip.js';
import { clearSelection } from '../state/SelectionState.js';
import { setTimeScale, getTimeScale, resetTimeScale } from '../state/TimeState.js';
import { destroyPinchZoom } from './PinchZoom.js';

// Explosion and blackhole are mutually exclusive
const EXCLUSIVE_MODES = {
  explosionMode: { btn: 'explosionBtn', opposite: 'blackholeMode', oppositeBtn: 'blackholeBtn' },
  blackholeMode: { btn: 'blackholeBtn', opposite: 'explosionMode', oppositeBtn: 'explosionBtn' },
};

function toggleExclusiveMode(modeKey) {
  const { btn, opposite, oppositeBtn } = EXCLUSIVE_MODES[modeKey];
  state[modeKey] = !state[modeKey];
  if (state[modeKey]) state[opposite] = false;
  $(btn).classList.toggle('active', state[modeKey]);
  $(oppositeBtn).classList.remove('active');
  updateModeIndicator();
}

export function togglePause() {
  state.isPaused = !state.isPaused;
  const btn = $('pauseBtn');
  btn.textContent = state.isPaused ? '▶ Play' : '⏸ Pause';
  btn.classList.toggle('active', state.isPaused);

  const overlay = $('pausedOverlay');
  if (overlay) overlay.classList.toggle('visible', state.isPaused);

  if (state.isPaused) {
    state.pauseStartedAt = Date.now();
  } else {
    state.pausedTime += Date.now() - state.pauseStartedAt;
    state.pauseStartedAt = 0;
  }
}

export function toggleRainbow() {
  state.rainbowMode = !state.rainbowMode;
  $('rainbowBtn').classList.toggle('active', state.rainbowMode);
  updateModeIndicator();
}

export function toggleExplosion() {
  toggleExclusiveMode('explosionMode');
}

export function toggleBlackhole() {
  toggleExclusiveMode('blackholeMode');
}

export function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen().then(() => {
      trackAction('fullscreen');
    }).catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

export function recolorAllBalls() {
  const colors = getActiveColors();
  for (const ball of state.balls) {
    ball.color = colors[Math.floor(Math.random() * colors.length)];
  }
}

export function initControls(resetCallback) {
  $('pauseBtn').addEventListener('click', togglePause);
  $('resetBtn').addEventListener('click', resetCallback);
  $('rainbowBtn').addEventListener('click', toggleRainbow);
  $('explosionBtn').addEventListener('click', toggleExplosion);
  $('blackholeBtn').addEventListener('click', toggleBlackhole);
  $('fullscreenBtn').addEventListener('click', toggleFullscreen);

  // Color theme selector
  const themeSelect = $('colorTheme');
  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      setColorTheme(themeSelect.value);
      trackThemeUsed(themeSelect.value);
      recolorAllBalls();
    });
  }

  // Time scale slider
  const timeSlider = $('timeScale');
  const timeVal = $('timeScaleValue');
  if (timeSlider) {
    timeSlider.addEventListener('input', () => {
      setTimeScale(parseFloat(timeSlider.value));
      if (timeVal) timeVal.textContent = getTimeScale() + 'x';
    });
  }

  // Achievements button
  const achieveBtn = $('achievementsBtn');
  if (achieveBtn) {
    achieveBtn.addEventListener('click', showAchievementsModal);
  }

  // Dark/light toggle
  const themeToggleBtn = $('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      toggleLightMode();
      themeToggleBtn.textContent = isLight() ? '☀️ Theme' : '🌙 Theme';
    });
  }

  // Record button
  const recordBtn = $('recordBtn');
  if (recordBtn) {
    recordBtn.addEventListener('click', toggleRecording);
  }

  $('backBtn').addEventListener('click', () => {
    if (state.animationId) cancelAnimationFrame(state.animationId);
    stopAudio($('musicBtn'));
    destroyStarfield();
    destroyBallTooltip();
    destroyPinchZoom();
    clearSelection();
    resetTimeScale();
    $('simulation-container').style.display = 'none';
    state.canvasWrapper.remove();
    $('wizard').style.display = 'flex';
    clearDomCache();
  });
}
