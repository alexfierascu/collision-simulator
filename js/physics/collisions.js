import {
  COLLISION_EPSILON,
  COLLISION_SEPARATION,
  COLLISION_OVERLAP_PAD,
  COLLISION_KICK,
} from '../config/constants.js';
import { distance as calcDist } from '../utils/math.js';

export function checkBallCollision(ball1, ball2) {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  return calcDist(dx, dy) < ball1.radius + ball2.radius;
}

export function resolveBallCollision(ball1, ball2, rainbowMode) {
  const dx = ball2.x - ball1.x;
  const dy = ball2.y - ball1.y;
  const distance = calcDist(dx, dy);

  if (distance < COLLISION_EPSILON) {
    const randomAngle = Math.random() * Math.PI * 2;
    ball1.x += Math.cos(randomAngle) * COLLISION_SEPARATION;
    ball1.y += Math.sin(randomAngle) * COLLISION_SEPARATION;
    ball2.x -= Math.cos(randomAngle) * COLLISION_SEPARATION;
    ball2.y -= Math.sin(randomAngle) * COLLISION_SEPARATION;
    return;
  }

  const nx = dx / distance;
  const ny = dy / distance;

  const overlap = (ball1.radius + ball2.radius - distance) / 2 + COLLISION_OVERLAP_PAD;
  ball1.x -= overlap * nx;
  ball1.y -= overlap * ny;
  ball2.x += overlap * nx;
  ball2.y += overlap * ny;

  const dvx = ball1.vx - ball2.vx;
  const dvy = ball1.vy - ball2.vy;
  const dvn = dvx * nx + dvy * ny;

  if (dvn > 0) return;

  ball1.vx -= dvn * nx;
  ball1.vy -= dvn * ny;
  ball2.vx += dvn * nx;
  ball2.vy += dvn * ny;

  ball1.vx += (Math.random() - 0.5) * COLLISION_KICK;
  ball1.vy += (Math.random() - 0.5) * COLLISION_KICK;
  ball2.vx += (Math.random() - 0.5) * COLLISION_KICK;
  ball2.vy += (Math.random() - 0.5) * COLLISION_KICK;

  ball1.collisionCount++;
  ball2.collisionCount++;

  ball1.changeColor(rainbowMode);
  ball2.changeColor(rainbowMode);
}
