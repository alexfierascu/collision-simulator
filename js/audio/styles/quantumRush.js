import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone, createFilteredTone } from '../audioHelpers.js';

export function createQuantumRush(audioContext, masterGain, oscillators) {
  // Driving bass with rhythmic pump
  const { gain: bassGain } = createFilteredTone(audioContext, 'square', 65, 0.15, 'lowpass', 300, 4, masterGain, oscillators);
  createLFO(audioContext, 4, 0.08, bassGain.gain, oscillators);

  // Detuned saw leads with filter sweeps
  [130.8, 196, 261.6, 392].forEach((freq, i) => {
    const vol = 0.06 / (i + 1);

    // Two detuned oscillators through shared filter
    const osc1 = audioContext.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;
    osc1.detune.value = -10;

    const osc2 = audioContext.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = freq;
    osc2.detune.value = 10;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500 + i * 200;
    filter.Q.value = 3;

    createLFO(audioContext, 1 + i * 0.3, 300, filter.frequency, oscillators);

    const gain = audioContext.createGain();
    gain.gain.value = vol;

    createLFO(audioContext, 2 + i * 0.5, vol * 0.5, gain.gain, oscillators);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc1.start();
    osc2.start();
    oscillators.push(osc1, osc2);
  });

  // High-freq chatter
  [523.3, 659.3, 784].forEach((freq, i) => {
    const { gain } = createTone(audioContext, 'sine', freq, 0.025, masterGain, oscillators);
    createLFO(audioContext, 6 + i * 2, 0.02, gain.gain, oscillators);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.05);
}
