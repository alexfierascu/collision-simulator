import { drawBall } from './BallRenderer.js';
import { FORCE_EFFECT_DURATION, FORCE_EFFECT_MAX_RADIUS } from '../config/constants.js';

export function clearCanvas(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

export function drawAllBalls(ctx, balls) {
  for (const ball of balls) {
    drawBall(ctx, ball);
  }
}

export function drawForceEffects(ctx, effects) {
  const now = Date.now();
  for (let i = effects.length - 1; i >= 0; i--) {
    const fx = effects[i];
    const elapsed = now - fx.startTime;
    const progress = elapsed / FORCE_EFFECT_DURATION;

    if (progress >= 1) {
      effects.splice(i, 1);
      continue;
    }

    const alpha = 1 - progress;
    const isExplosion = fx.type === 'explosion';
    const radius = isExplosion
      ? progress * FORCE_EFFECT_MAX_RADIUS * 2
      : (1 - progress) * FORCE_EFFECT_MAX_RADIUS * 2;

    // Ring
    ctx.beginPath();
    ctx.arc(fx.x, fx.y, Math.max(radius, 1), 0, Math.PI * 2);
    ctx.strokeStyle = isExplosion
      ? `rgba(255, 0, 170, ${alpha * 0.6})`
      : `rgba(0, 255, 242, ${alpha * 0.6})`;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner glow
    if (radius > 2) {
      const grad = ctx.createRadialGradient(fx.x, fx.y, 0, fx.x, fx.y, radius);
      grad.addColorStop(0, isExplosion
        ? `rgba(255, 0, 170, ${alpha * 0.12})`
        : `rgba(0, 255, 242, ${alpha * 0.12})`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(fx.x, fx.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }
}
