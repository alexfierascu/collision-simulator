import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone } from '../audioHelpers.js';

export function createStarPulse(audioContext, masterGain, oscillators) {
  const base = 82;
  const notes = [1, 1.25, 1.5, 2, 2.5, 3];

  // Bass pulse
  const { gain: bassGain } = createTone(audioContext, 'triangle', base, 0.12, masterGain, oscillators);
  createLFO(audioContext, 0.5, 0.1, bassGain.gain, oscillators);

  // Arpeggio-like sequence with staggered delays
  notes.forEach((mult, i) => {
    const { gain } = createTone(audioContext, 'sine', base * 2 * mult, 0, masterGain, oscillators);

    const lfo = audioContext.createOscillator();
    lfo.frequency.value = 0.5;
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 0.04 / (i + 1);

    const delay = audioContext.createDelay();
    delay.delayTime.value = i * 0.15;

    lfo.connect(delay);
    delay.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();
    oscillators.push(lfo);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.01);
}
