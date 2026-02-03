import { state } from '../state/SimulationState.js';
import { showToast } from '../ui/Toast.js';
import { getCanvasBgColors } from '../state/ThemeState.js';
import { trackAction } from '../achievements/Achievements.js';

export function takeScreenshot() {
  const { canvas } = state;
  const padding = 20;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width + padding * 2;
  tempCanvas.height = canvas.height + padding * 2;
  const tempCtx = tempCanvas.getContext('2d');

  // Background
  tempCtx.fillStyle = getCanvasBgColors().outer;
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // Draw border circle
  tempCtx.strokeStyle = 'rgba(0, 255, 242, 0.5)';
  tempCtx.lineWidth = 4;
  tempCtx.beginPath();
  tempCtx.arc(tempCanvas.width / 2, tempCanvas.height / 2, canvas.width / 2 + 2, 0, Math.PI * 2);
  tempCtx.stroke();

  // Draw the simulation canvas
  tempCtx.drawImage(canvas, padding, padding);

  // Add watermark
  tempCtx.font = '12px Orbitron, sans-serif';
  tempCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  tempCtx.textAlign = 'right';
  tempCtx.fillText('Collision Spawner', tempCanvas.width - padding, tempCanvas.height - 10);

  // Download
  const link = document.createElement('a');
  link.download = `collision-spawner-${Date.now()}.png`;
  link.href = tempCanvas.toDataURL('image/png');
  link.click();

  trackAction('screenshot');
  showToast('Screenshot saved!');
}
