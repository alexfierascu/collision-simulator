import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone } from '../audioHelpers.js';

export function createDeepSpace(audioContext, masterGain, oscillators) {
  const baseFreq = 32;

  // Sub bass
  createTone(audioContext, 'sine', baseFreq, 0.2, masterGain, oscillators);

  // Harmonics with slow pitch LFO
  [1, 1.5, 2, 2.5, 3].forEach((mult, i) => {
    const { osc } = createTone(audioContext, 'sine', 110 * mult, 0.06 / (i + 1), masterGain, oscillators);
    createLFO(audioContext, 0.05 + i * 0.02, 5, osc.frequency, oscillators);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.015);
}
