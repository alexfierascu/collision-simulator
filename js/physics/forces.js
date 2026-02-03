import { CONFIG } from '../config/config.js';
import { EXPLOSION_FORCE, BLACKHOLE_FORCE, REPULSION_STRENGTH } from '../config/constants.js';
import { distance as calcDist } from '../utils/math.js';

function applyRadialForce(balls, x, y, forceMag, minDist) {
  for (const ball of balls) {
    const dx = x - ball.x;
    const dy = y - ball.y;
    const dist = calcDist(dx, dy);
    if (dist > minDist) {
      const strength = forceMag / Math.max(dist / 50, 1);
      ball.vx += (dx / dist) * strength;
      ball.vy += (dy / dist) * strength;
    }
  }
}

export function applyExplosion(balls, x, y) {
  // Invert: push away from point (negate dx/dy by swapping sign)
  for (const ball of balls) {
    const dx = ball.x - x;
    const dy = ball.y - y;
    const dist = calcDist(dx, dy);
    if (dist > 0) {
      const strength = EXPLOSION_FORCE / Math.max(dist / 50, 1);
      ball.vx += (dx / dist) * strength;
      ball.vy += (dy / dist) * strength;
    }
  }
}

export function applyBlackhole(balls, x, y) {
  applyRadialForce(balls, x, y, BLACKHOLE_FORCE, 10);
}

/** Pair-wise repulsion for use inside SpatialGrid.forEachPair */
export function applyRepulsionPair(a, b) {
  const repulsionRange = CONFIG.ballRadius * CONFIG.repulsionMultiplier;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = calcDist(dx, dy);

  if (dist < repulsionRange && dist > 0.1) {
    const force = Math.pow((repulsionRange - dist) / repulsionRange, 2) * REPULSION_STRENGTH;
    const nx = dx / dist;
    const ny = dy / dist;
    a.vx -= nx * force;
    a.vy -= ny * force;
    b.vx += nx * force;
    b.vy += ny * force;
  }
}
