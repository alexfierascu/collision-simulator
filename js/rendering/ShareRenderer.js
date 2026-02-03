import { $ } from '../ui/dom.js';
import { CONFIG } from '../config/config.js';
import { state } from '../state/SimulationState.js';
import { formatTime } from '../utils/time.js';
import { getCanvasBgColors } from '../state/ThemeState.js';

export function generateShareImage() {
  const shareCanvas = $('shareCanvas');
  const shareCtx = shareCanvas.getContext('2d');
  const width = shareCanvas.width;
  const height = shareCanvas.height;

  // Background gradient
  const bgColors = getCanvasBgColors();
  const bgGrad = shareCtx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
  bgGrad.addColorStop(0, bgColors.inner);
  bgGrad.addColorStop(1, bgColors.outer);
  shareCtx.fillStyle = bgGrad;
  shareCtx.fillRect(0, 0, width, height);

  // Draw simulation preview (scaled down)
  const simSize = Math.min(width - 40, height - 100);
  const simX = (width - simSize) / 2;
  const simY = 20;

  // Circle border
  shareCtx.strokeStyle = 'rgba(0, 255, 242, 0.5)';
  shareCtx.lineWidth = 2;
  shareCtx.beginPath();
  shareCtx.arc(simX + simSize / 2, simY + simSize / 2, simSize / 2, 0, Math.PI * 2);
  shareCtx.stroke();

  // Draw balls (scaled)
  const scale = simSize / state.canvas.width;
  state.balls.forEach(ball => {
    const x = simX + (ball.x * scale);
    const y = simY + (ball.y * scale);
    const r = ball.radius * scale;

    const gradient = shareCtx.createRadialGradient(x, y, 0, x, y, r * 2);
    gradient.addColorStop(0, ball.color.glow);
    gradient.addColorStop(1, 'transparent');
    shareCtx.beginPath();
    shareCtx.arc(x, y, r * 2, 0, Math.PI * 2);
    shareCtx.fillStyle = gradient;
    shareCtx.fill();

    shareCtx.beginPath();
    shareCtx.arc(x, y, r, 0, Math.PI * 2);
    shareCtx.fillStyle = ball.color.main;
    shareCtx.fill();
  });

  // Stats overlay at bottom
  const elapsed = Date.now() - state.startTime - state.pausedTime;
  shareCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  shareCtx.fillRect(0, height - 60, width, 60);

  shareCtx.font = 'bold 14px Orbitron, sans-serif';
  shareCtx.textAlign = 'center';

  shareCtx.fillStyle = '#00fff2';
  shareCtx.fillText(`${state.balls.length} balls`, width * 0.2, height - 35);
  shareCtx.fillStyle = '#ff00aa';
  shareCtx.fillText(`${state.collisionCount} collisions`, width * 0.5, height - 35);
  shareCtx.fillStyle = '#ffea00';
  shareCtx.fillText(formatTime(elapsed), width * 0.8, height - 35);

  shareCtx.font = 'bold 10px Orbitron, sans-serif';
  shareCtx.fillStyle = '#666';
  shareCtx.fillText('COLLISION SPAWNER', width / 2, height - 12);
}
