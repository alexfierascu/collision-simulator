import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO } from '../audioHelpers.js';

export function createCosmicDrift(audioContext, masterGain, oscillators) {
  const base = 65;

  [1, 1.25, 1.5, 2, 2.5].forEach((mult, i) => {
    const type = i < 2 ? 'sine' : 'triangle';

    const osc1 = audioContext.createOscillator();
    osc1.type = type;
    osc1.frequency.value = base * mult;
    osc1.detune.value = Math.sin(i) * 15;

    const osc2 = audioContext.createOscillator();
    osc2.type = type;
    osc2.frequency.value = base * mult;
    osc2.detune.value = -Math.sin(i) * 15 + 5;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;

    createLFO(audioContext, 0.03, 400, filter.frequency, oscillators);

    const gain = audioContext.createGain();
    gain.gain.value = 0.08 / (i + 1);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc1.start();
    osc2.start();
    oscillators.push(osc1, osc2);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.02);
}
