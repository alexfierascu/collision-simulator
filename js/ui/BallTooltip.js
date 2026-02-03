import { getSelectedBallId } from '../state/SelectionState.js';
import { state } from '../state/SimulationState.js';

let tooltipEl = null;

export function initBallTooltip() {
  if (tooltipEl) return;
  tooltipEl = document.createElement('div');
  tooltipEl.className = 'ball-tooltip';
  tooltipEl.style.display = 'none';
  document.body.appendChild(tooltipEl);
}

export function updateBallTooltip() {
  if (!tooltipEl) return;

  const id = getSelectedBallId();
  if (!id) {
    tooltipEl.style.display = 'none';
    return;
  }

  const ball = state.balls.find(b => b.id === id);
  if (!ball) {
    tooltipEl.style.display = 'none';
    return;
  }

  const speed = ball.getSpeed().toFixed(1);
  const age = ((Date.now() - ball.createdAt) / 1000).toFixed(1);
  const collisions = ball.collisionCount;

  tooltipEl.innerHTML =
    `<div class="ball-tooltip-row"><span>Speed</span><strong>${speed}</strong></div>` +
    `<div class="ball-tooltip-row"><span>Collisions</span><strong>${collisions}</strong></div>` +
    `<div class="ball-tooltip-row"><span>Age</span><strong>${age}s</strong></div>`;

  // Position tooltip near the ball
  const rect = state.canvas.getBoundingClientRect();
  const scaleX = rect.width / state.canvas.width;
  const scaleY = rect.height / state.canvas.height;

  const screenX = rect.left + ball.x * scaleX;
  const screenY = rect.top + ball.y * scaleY;

  tooltipEl.style.display = 'block';
  tooltipEl.style.left = (screenX + 20) + 'px';
  tooltipEl.style.top = (screenY - 30) + 'px';

  // Keep tooltip on screen
  const tooltipRect = tooltipEl.getBoundingClientRect();
  if (tooltipRect.right > window.innerWidth) {
    tooltipEl.style.left = (screenX - tooltipRect.width - 20) + 'px';
  }
  if (tooltipRect.bottom > window.innerHeight) {
    tooltipEl.style.top = (screenY - tooltipRect.height - 10) + 'px';
  }
}

export function destroyBallTooltip() {
  if (tooltipEl && tooltipEl.parentNode) {
    tooltipEl.parentNode.removeChild(tooltipEl);
  }
  tooltipEl = null;
}
