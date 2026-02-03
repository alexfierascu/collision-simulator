import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone } from '../audioHelpers.js';

export function createNeonCircuit(audioContext, masterGain, oscillators) {
  // Warm detuned pad foundation
  [130.8, 196, 261.6].forEach((freq, i) => {
    const osc1 = audioContext.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;
    osc1.detune.value = -12;

    const osc2 = audioContext.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = freq;
    osc2.detune.value = 12;

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400 + i * 150;
    filter.Q.value = 3;

    createLFO(audioContext, 0.15 + i * 0.05, 250, filter.frequency, oscillators);

    const gain = audioContext.createGain();
    gain.gain.value = 0.06 / (i + 1);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc1.start();
    osc2.start();
    oscillators.push(osc1, osc2);
  });

  // Pulsing mid synth
  [329.6, 440, 523.3, 659.3].forEach((freq, i) => {
    const vol = 0.035 / (i * 0.4 + 1);
    const { gain } = createTone(audioContext, 'triangle', freq, vol, masterGain, oscillators);
    createLFO(audioContext, 2 + i * 0.5, vol * 0.65, gain.gain, oscillators);
  });

  // Sub bass
  const { gain: subGain } = createTone(audioContext, 'sine', 65, 0.12, masterGain, oscillators);
  createLFO(audioContext, 2, 0.05, subGain.gain, oscillators);

  addSpaceNoise(audioContext, masterGain, oscillators, 0.025);
}
