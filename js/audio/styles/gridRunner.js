import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone, createFilteredTone } from '../audioHelpers.js';

export function createGridRunner(audioContext, masterGain, oscillators) {
  // Tight square bass with 8th-note pump
  const { gain: bassGain } = createFilteredTone(audioContext, 'square', 82, 0.14, 'lowpass', 250, 5, masterGain, oscillators);
  createLFO(audioContext, 4, 0.07, bassGain.gain, oscillators, 'square');

  // Clean arpeggio sequence — staggered gates
  [196, 261.6, 329.6, 392, 523.3, 659.3].forEach((freq, i) => {
    const vol = 0.045 / (i * 0.3 + 1);
    const { gain } = createTone(audioContext, 'sine', freq, vol, masterGain, oscillators);

    const gate = audioContext.createOscillator();
    gate.frequency.value = 4;
    const gateGain = audioContext.createGain();
    gateGain.gain.value = vol * 0.7;

    const delay = audioContext.createDelay();
    delay.delayTime.value = i * 0.04;
    gate.connect(delay);
    delay.connect(gateGain);
    gateGain.connect(gain.gain);
    gate.start();
    oscillators.push(gate);
  });

  // High digital ping
  const { gain: pingGain } = createTone(audioContext, 'sine', 1318.5, 0.015, masterGain, oscillators);
  createLFO(audioContext, 8, 0.012, pingGain.gain, oscillators);

  addSpaceNoise(audioContext, masterGain, oscillators, 0.02);
}
