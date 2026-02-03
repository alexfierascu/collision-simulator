import { getHighlightColor } from '../state/ThemeState.js';

export function drawBall(ctx, ball) {
  const opacity = ball.getSpawnOpacity();

  ctx.save();
  if (opacity < 1) ctx.globalAlpha = opacity;

  // Glow
  const gradient = ctx.createRadialGradient(
    ball.x, ball.y, 0,
    ball.x, ball.y, ball.radius * 2
  );
  gradient.addColorStop(0, ball.color.glow);
  gradient.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius * 2, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Body
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color.main;
  ctx.fill();

  // Highlight
  ctx.beginPath();
  ctx.arc(
    ball.x - ball.radius * 0.3,
    ball.y - ball.radius * 0.3,
    ball.radius * 0.25,
    0, Math.PI * 2
  );
  ctx.fillStyle = getHighlightColor();
  ctx.fill();

  ctx.restore();
}
