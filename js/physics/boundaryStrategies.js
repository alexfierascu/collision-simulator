import { BOUNDARY_INWARD_PUSH } from '../config/constants.js';
import { CONFIG } from '../config/config.js';
import { distance } from '../utils/math.js';

function applyBounceBoost(ball, nx, ny) {
  ball.vx *= CONFIG.boundaryBoost;
  ball.vy *= CONFIG.boundaryBoost;
  ball.vx -= nx * BOUNDARY_INWARD_PUSH;
  ball.vy -= ny * BOUNDARY_INWARD_PUSH;
}

const circle = {
  bounce(ball, centerX, centerY, boundaryRadius) {
    const dx = ball.x - centerX;
    const dy = ball.y - centerY;
    const dist = distance(dx, dy);
    const maxDist = boundaryRadius - ball.radius;

    if (dist > maxDist) {
      const nx = dx / dist;
      const ny = dy / dist;
      ball.x = centerX + nx * maxDist;
      ball.y = centerY + ny * maxDist;

      const dot = ball.vx * nx + ball.vy * ny;
      ball.vx -= 2 * dot * nx;
      ball.vy -= 2 * dot * ny;
      applyBounceBoost(ball, nx, ny);
    }
  },

  contains(x, y, centerX, centerY, boundaryRadius) {
    return distance(x - centerX, y - centerY) < boundaryRadius;
  },
};

const rectangle = {
  bounce(ball, centerX, centerY, boundaryRadius) {
    const left = centerX - boundaryRadius + ball.radius;
    const right = centerX + boundaryRadius - ball.radius;
    const top = centerY - boundaryRadius + ball.radius;
    const bottom = centerY + boundaryRadius - ball.radius;

    if (ball.x < left) { ball.x = left; ball.vx = Math.abs(ball.vx); applyBounceBoost(ball, -1, 0); }
    if (ball.x > right) { ball.x = right; ball.vx = -Math.abs(ball.vx); applyBounceBoost(ball, 1, 0); }
    if (ball.y < top) { ball.y = top; ball.vy = Math.abs(ball.vy); applyBounceBoost(ball, 0, -1); }
    if (ball.y > bottom) { ball.y = bottom; ball.vy = -Math.abs(ball.vy); applyBounceBoost(ball, 0, 1); }
  },

  contains(x, y, centerX, centerY, boundaryRadius) {
    return x > centerX - boundaryRadius &&
           x < centerX + boundaryRadius &&
           y > centerY - boundaryRadius &&
           y < centerY + boundaryRadius;
  },
};

const HEX_INRADIUS_FACTOR = 0.866025;
const HEX_AXES = [
  { nx: 0, ny: -1 },
  { nx: HEX_INRADIUS_FACTOR, ny: 0.5 },
  { nx: -HEX_INRADIUS_FACTOR, ny: 0.5 },
];

const hexagon = {
  bounce(ball, centerX, centerY, boundaryRadius) {
    const inradius = boundaryRadius * HEX_INRADIUS_FACTOR;
    const px = ball.x - centerX;
    const py = ball.y - centerY;

    for (const { nx, ny } of HEX_AXES) {
      const proj = px * nx + py * ny;
      const limit = inradius - ball.radius;

      if (proj > limit) {
        ball.x -= (proj - limit) * nx;
        ball.y -= (proj - limit) * ny;
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 2 * dot * nx;
        ball.vy -= 2 * dot * ny;
        applyBounceBoost(ball, nx, ny);
      } else if (proj < -limit) {
        ball.x -= (proj + limit) * nx;
        ball.y -= (proj + limit) * ny;
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 2 * dot * nx;
        ball.vy -= 2 * dot * ny;
        applyBounceBoost(ball, -nx, -ny);
      }
    }
  },

  contains(x, y, centerX, centerY, boundaryRadius) {
    const inradius = boundaryRadius * HEX_INRADIUS_FACTOR;
    const px = x - centerX;
    const py = y - centerY;
    const axes = [[-0.5, -HEX_INRADIUS_FACTOR], [1, 0], [0.5, HEX_INRADIUS_FACTOR]];
    return axes.every(([nx, ny]) => Math.abs(px * nx + py * ny) < inradius);
  },
};

export const boundaryStrategies = { circle, rectangle, hexagon };
