import { getSelectedBallId } from '../state/SelectionState.js';
import { state } from '../state/SimulationState.js';

export function drawSelectionRing(ctx) {
  const id = getSelectedBallId();
  if (!id) return;

  const ball = state.balls.find(b => b.id === id);
  if (!ball) return;

  const now = Date.now();
  const pulse = Math.sin(now * 0.005) * 0.3 + 0.7;
  const ringRadius = ball.radius + 6 + Math.sin(now * 0.004) * 2;

  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.lineDashOffset = -(now * 0.03) % 8;
  ctx.strokeStyle = `rgba(255, 255, 255, ${pulse})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ringRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
