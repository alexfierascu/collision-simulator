import { CONFIG } from '../config/config.js';
import { STATS_THROTTLE_MS } from '../config/constants.js';
import { state, resetState } from '../state/SimulationState.js';
import { Ball } from '../entities/Ball.js';
import { checkBallCollision, resolveBallCollision } from '../physics/collisions.js';
import { applyRepulsionPair } from '../physics/forces.js';
import { spawnBall } from '../physics/spawner.js';
import { SpatialGrid } from '../physics/SpatialGrid.js';
import { clearCanvas, drawAllBalls, drawForceEffects } from '../rendering/SimulationRenderer.js';
import { drawSelectionRing } from '../rendering/SelectionRenderer.js';
import { updateGraph } from '../rendering/GraphRenderer.js';
import { updateBallTooltip } from '../ui/BallTooltip.js';
import { compositeFrame, updateRecordingCountdown } from '../recording/RecordingController.js';
import { recordingState } from '../recording/RecordingState.js';
import { updateFps } from '../ui/FpsCounter.js';
import { checkAchievements } from '../achievements/Achievements.js';
import { $ } from '../ui/dom.js';
import { formatTime } from '../utils/time.js';

let grid = null;
let prevStats = {};

function ensureGrid() {
  const cellSize = Math.max(CONFIG.ballRadius * CONFIG.repulsionMultiplier, CONFIG.ballRadius * 4);
  if (!grid || grid.cellSize !== cellSize) {
    grid = new SpatialGrid(CONFIG.canvasSize, CONFIG.canvasSize, cellSize);
  }
}

function updateStats(now, force) {
  if (!force && now - state.lastStatsUpdate < STATS_THROTTLE_MS) return;
  state.lastStatsUpdate = now;

  const count = state.balls.length;
  const cc = state.collisionCount;
  const ms = state.maxSpeedReached.toFixed(1);

  if (prevStats.count !== count)  { $('ballCount').textContent = count; prevStats.count = count; }
  if (prevStats.cc !== cc)        { $('collisionCount').textContent = cc; prevStats.cc = cc; }
  if (prevStats.ms !== ms)        { $('maxSpeed').textContent = ms; prevStats.ms = ms; }

  if (count > 0) {
    const totalSpeed = state.balls.reduce((sum, b) => sum + b.getSpeed(), 0);
    const avg = (totalSpeed / count).toFixed(1);
    if (prevStats.avg !== avg)    { $('avgSpeed').textContent = avg; prevStats.avg = avg; }
  } else if (prevStats.avg !== '0') {
    $('avgSpeed').textContent = '0'; prevStats.avg = '0';
  }

  if (!state.isPaused && state.startTime > 0) {
    const elapsed = now - state.startTime - state.pausedTime;
    const t = formatTime(elapsed);
    if (prevStats.t !== t)        { $('timeElapsed').textContent = t; prevStats.t = t; }
  }

  state.collisionTimestamps = state.collisionTimestamps.filter(t => now - t < 1000);
  const cps = state.collisionTimestamps.length;
  if (prevStats.cps !== cps)      { $('collPerSec').textContent = cps; prevStats.cps = cps; }
}

export function init() {
  resetState();
  prevStats = {};

  const b1 = new Ball(state.centerX - 100, state.centerY, CONFIG.initialSpeed, CONFIG.initialSpeed * 0.6);
  const b2 = new Ball(state.centerX + 100, state.centerY, -CONFIG.initialSpeed, -CONFIG.initialSpeed * 0.6);
  state.balls.push(b1, b2);

  updateStats(Date.now(), true);
}

export function animate() {
  if (state.isPaused) {
    state.animationId = requestAnimationFrame(animate);
    return;
  }

  clearCanvas(state.ctx, state.canvas.width, state.canvas.height);
  const now = Date.now();

  ensureGrid();

  // --- Repulsion pass (spatial grid) ---
  grid.clear();
  for (const ball of state.balls) grid.insert(ball);
  grid.forEachPair(applyRepulsionPair);

  // --- Update balls ---
  for (const ball of state.balls) {
    const speed = ball.update(state.centerX, state.centerY, state.boundaryRadius, state.rainbowMode);
    if (speed > state.maxSpeedReached) state.maxSpeedReached = speed;
  }

  // --- Collision pass (spatial grid) ---
  grid.clear();
  for (const ball of state.balls) grid.insert(ball);

  const currentPairs = new Set();
  grid.forEachPair((a, b) => {
    if (!checkBallCollision(a, b)) return;

    const pairKey = a.id < b.id ? a.id + '-' + b.id : b.id + '-' + a.id;
    currentPairs.add(pairKey);
    resolveBallCollision(a, b, state.rainbowMode);

    if (!state.activePairs.has(pairKey) && now - state.lastSpawnTime > CONFIG.spawnCooldown && state.balls.length < CONFIG.maxBalls) {
      state.lastSpawnTime = now;
      state.collisionCount++;
      state.collisionTimestamps.push(now);
      spawnBall((a.x + b.x) / 2, (a.y + b.y) / 2);
    }
  });

  state.activePairs = currentPairs;
  updateStats(now, false);
  updateGraph();

  drawAllBalls(state.ctx, state.balls);
  drawSelectionRing(state.ctx);
  drawForceEffects(state.ctx, state.forceEffects);

  updateBallTooltip();

  // Recording compositing
  if (recordingState.isRecording) {
    compositeFrame();
    updateRecordingCountdown();
  }

  updateFps();
  checkAchievements();

  state.animationId = requestAnimationFrame(animate);
}
