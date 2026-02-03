export const PRESETS = {
  chill:  { maxBalls: 30,  ballSize: 10, spawnRate: 500, initialSpeed: 3,  maxSpeed: 12, minSpeed: 1, repulsionMultiplier: 5, boundaryBoost: 1.02, boundaryShape: 'circle' },
  normal: { maxBalls: 100, ballSize: 6,  spawnRate: 200, initialSpeed: 5,  maxSpeed: 15, minSpeed: 2, repulsionMultiplier: 5, boundaryBoost: 1.03, boundaryShape: 'circle' },
  chaos:  { maxBalls: 200, ballSize: 5,  spawnRate: 50,  initialSpeed: 10, maxSpeed: 20, minSpeed: 3, repulsionMultiplier: 4, boundaryBoost: 1.05, boundaryShape: 'circle' },
  swarm:  { maxBalls: 300, ballSize: 4,  spawnRate: 100, initialSpeed: 7,  maxSpeed: 15, minSpeed: 2, repulsionMultiplier: 3, boundaryBoost: 1.03, boundaryShape: 'circle' },
};

// Physics constants (were magic numbers)
export const MAX_SPEED_DEFAULT = 15;
export const MIN_SPEED_DEFAULT = 2;
export const EXPLOSION_FORCE = 15;
export const BLACKHOLE_FORCE = 8;
export const REPULSION_MULTIPLIER_DEFAULT = 5;
export const REPULSION_STRENGTH = 1.5;
export const COLLISION_KICK = 0.5;
export const COLLISION_OVERLAP_PAD = 4;
export const COLLISION_EPSILON = 0.01;
export const COLLISION_SEPARATION = 5;
export const BOUNDARY_SPEED_BOOST_DEFAULT = 1.03;
export const BOUNDARY_INWARD_PUSH = 2.5;
export const BOUNDARY_PADDING = 10;

// Visual / timing
export const GRAPH_DURATION = 30000;
export const SPAWN_FADE_DURATION = 300;
export const FORCE_EFFECT_DURATION = 500;
export const FORCE_EFFECT_MAX_RADIUS = 150;
export const STATS_THROTTLE_MS = 50;

export const BOUNDARY_SHAPES = ['circle', 'rectangle', 'hexagon'];
