import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone } from '../audioHelpers.js';

export function createNebulaWaves(audioContext, masterGain, oscillators) {
  const base = 220;

  // Harmonic layers with tremolo + vibrato
  [1, 1.5, 2, 3, 4, 5].forEach((mult, i) => {
    const { osc, gain } = createTone(audioContext, 'sine', base * mult, 0.04 / (i + 1), masterGain, oscillators);
    createLFO(audioContext, 0.2 + i * 0.1, 0.02 / (i + 1), gain.gain, oscillators);
    createLFO(audioContext, 0.1, mult * 2, osc.frequency, oscillators);
  });

  // Bass pulse
  const { gain: bassGain } = createTone(audioContext, 'sine', 55, 0.1, masterGain, oscillators);
  createLFO(audioContext, 0.25, 0.08, bassGain.gain, oscillators);

  addSpaceNoise(audioContext, masterGain, oscillators, 0.025);
}
