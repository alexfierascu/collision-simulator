import { $ } from './dom.js';
import { state } from '../state/SimulationState.js';

export function updateModeIndicator() {
  const indicator = $('modeIndicator');
  const modes = [];
  if (state.rainbowMode) modes.push('🌈 Rainbow Mode');
  if (state.explosionMode) modes.push('💥 Explosion Mode (click to push)');
  if (state.blackholeMode) modes.push('🕳️ Black Hole Mode (click to pull)');

  indicator.textContent = modes.join(' | ');
  indicator.className = 'mode-indicator' + (modes.length > 0 ? ' active' : '');
}
