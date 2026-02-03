import { $ } from '../ui/dom.js';
import { state } from '../state/SimulationState.js';
import { togglePause, toggleRainbow, toggleExplosion, toggleBlackhole, toggleFullscreen, recolorAllBalls } from '../ui/ControlsController.js';
import { toggleMusic } from '../audio/AudioManager.js';
import { takeScreenshot } from '../rendering/ScreenshotRenderer.js';
import { hideShareModal } from '../ui/ShareModal.js';
import { init, animate } from './SimulationLoop.js';
import { cycleColorTheme, toggleLightMode, isLight } from '../state/ThemeState.js';
import { clearSelection } from '../state/SelectionState.js';
import { toggleRecording } from '../recording/RecordingController.js';
import { startWalkthrough } from '../ui/Walkthrough.js';
import { toggleFpsCounter } from '../ui/FpsCounter.js';
import { nudgeTimeScale } from '../state/TimeState.js';
import { showAchievementsModal, hideAchievementsModal } from '../achievements/Achievements.js';

export function initKeyboardHandler() {
  document.addEventListener('keydown', (e) => {
    if ($('simulation-container').style.display === 'none') return;

    switch (e.key.toLowerCase()) {
      case ' ':
        e.preventDefault();
        togglePause();
        break;
      case 'r':
        if (state.animationId) cancelAnimationFrame(state.animationId);
        state.collisionHistory = [];
        state.graphStartIndex = 0;
        state.forceEffects = [];
        init();
        animate();
        break;
      case '1':
        toggleRainbow();
        break;
      case '2':
        toggleExplosion();
        break;
      case '3':
        toggleBlackhole();
        break;
      case '4': {
        const newTheme = cycleColorTheme();
        const sel = $('colorTheme');
        if (sel) sel.value = newTheme;
        recolorAllBalls();
        break;
      }
      case 't': {
        toggleLightMode();
        const btn = $('themeToggleBtn');
        if (btn) btn.textContent = isLight() ? '☀️ Theme' : '🌙 Theme';
        break;
      }
      case 'v':
        toggleRecording();
        break;
      case 'f':
        toggleFullscreen();
        break;
      case 'm':
        toggleMusic($('musicBtn'), $('musicStyle'));
        break;
      case 's':
        takeScreenshot();
        break;
      case 'escape':
        hideShareModal();
        hideAchievementsModal();
        clearSelection();
        break;
      case 'p':
        toggleFpsCounter();
        break;
      case '[': {
        const ts = nudgeTimeScale(-0.25);
        const slider = $('timeScale');
        const val = $('timeScaleValue');
        if (slider) slider.value = ts;
        if (val) val.textContent = ts + 'x';
        break;
      }
      case ']': {
        const ts = nudgeTimeScale(0.25);
        const slider = $('timeScale');
        const val = $('timeScaleValue');
        if (slider) slider.value = ts;
        if (val) val.textContent = ts + 'x';
        break;
      }
      case 'g':
        showAchievementsModal();
        break;
      case '?':
        startWalkthrough();
        break;
    }
  });
}
