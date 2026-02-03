import { CONFIG } from '../config/config.js';
import { Ball } from '../entities/Ball.js';
import { hslToColor } from '../utils/color.js';
import { state } from '../state/SimulationState.js';

export function spawnBall(x, y) {
  if (state.balls.length >= CONFIG.maxBalls) return;

  const angle = Math.random() * Math.PI * 2;
  const speed = CONFIG.initialSpeed + Math.random() * 3;

  const newBall = new Ball(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed);
  if (state.rainbowMode) {
    newBall.color = hslToColor(state.rainbowHue);
    state.rainbowHue = (state.rainbowHue + 20) % 360;
  }
  state.balls.push(newBall);
}
