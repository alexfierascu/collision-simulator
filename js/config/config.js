import {
  MAX_SPEED_DEFAULT,
  MIN_SPEED_DEFAULT,
  REPULSION_MULTIPLIER_DEFAULT,
  BOUNDARY_SPEED_BOOST_DEFAULT,
} from './constants.js';

export const CONFIG = {
  maxBalls: 100,
  ballRadius: 6,
  spawnCooldown: 200,
  initialSpeed: 5,
  canvasSize: 500,

  // Advanced physics (exposed in UI)
  maxSpeed: MAX_SPEED_DEFAULT,
  minSpeed: MIN_SPEED_DEFAULT,
  repulsionMultiplier: REPULSION_MULTIPLIER_DEFAULT,
  boundaryBoost: BOUNDARY_SPEED_BOOST_DEFAULT,
  boundaryShape: 'circle',
};

export function calculateCanvasSize(maxBalls, ballRadius) {
  const areaPerBall = Math.pow(ballRadius * 3.5, 2);
  const totalArea = areaPerBall * maxBalls;
  const radius = Math.sqrt(totalArea / Math.PI);
  const diameter = Math.ceil(radius * 2) + 40;
  return Math.max(400, Math.min(800, diameter));
}
