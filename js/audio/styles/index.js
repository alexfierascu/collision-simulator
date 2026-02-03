import { createDeepSpace } from './deepSpace.js';
import { createCosmicDrift } from './cosmicDrift.js';
import { createNebulaWaves } from './nebulaWaves.js';
import { createBlackHoleEcho } from './blackHoleEcho.js';
import { createStarPulse } from './starPulse.js';
import { createSolarFlare } from './solarFlare.js';
import { createQuantumRush } from './quantumRush.js';
import { createSupernovaBreak } from './supernovaBreak.js';
import { createGridRunner } from './gridRunner.js';
import { createNeonCircuit } from './neonCircuit.js';
import { createDataStream } from './dataStream.js';
import { createIonStorm } from './ionStorm.js';

export const styleRegistry = {
  deepSpace: createDeepSpace,
  cosmicDrift: createCosmicDrift,
  nebulaWaves: createNebulaWaves,
  blackHoleEcho: createBlackHoleEcho,
  starPulse: createStarPulse,
  solarFlare: createSolarFlare,
  quantumRush: createQuantumRush,
  supernovaBreak: createSupernovaBreak,
  gridRunner: createGridRunner,
  neonCircuit: createNeonCircuit,
  dataStream: createDataStream,
  ionStorm: createIonStorm,
};
