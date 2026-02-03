export const state = {
  // Canvas references
  canvas: null,
  ctx: null,
  canvasWrapper: null,
  centerX: 0,
  centerY: 0,
  boundaryRadius: 0,

  // Simulation data
  balls: [],
  collisionCount: 0,
  lastSpawnTime: 0,
  activePairs: new Set(),
  animationId: null,

  // Timing
  isPaused: false,
  startTime: 0,
  pausedTime: 0,
  pauseStartedAt: 0,
  maxSpeedReached: 0,
  collisionTimestamps: [],

  // Modes
  rainbowMode: false,
  explosionMode: false,
  blackholeMode: false,
  rainbowHue: 0,

  // Graph
  graphCtx: null,
  collisionHistory: [],
  graphStartIndex: 0,

  // Force effects (visual feedback)
  forceEffects: [],

  // Stats throttle
  lastStatsUpdate: 0,
};

export function resetState() {
  state.balls = [];
  state.collisionCount = 0;
  state.lastSpawnTime = 0;
  state.activePairs = new Set();
  state.maxSpeedReached = 0;
  state.collisionTimestamps = [];
  state.startTime = Date.now();
  state.pausedTime = 0;
  state.pauseStartedAt = 0;
  state.forceEffects = [];
  state.lastStatsUpdate = 0;
}
