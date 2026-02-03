import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone, createFilteredTone } from '../audioHelpers.js';

export function createDataStream(audioContext, masterGain, oscillators) {
  // Digital bass with fast filter wobble
  const { filter } = createFilteredTone(audioContext, 'square', 55, 0.13, 'lowpass', 180, 6, masterGain, oscillators);
  createLFO(audioContext, 3, 100, filter.frequency, oscillators);

  // Rapid data tones — staccato sine bursts
  [440, 554.4, 659.3, 784, 880, 1046.5].forEach((freq, i) => {
    const vol = 0.03 / (i * 0.3 + 1);
    const { gain } = createTone(audioContext, 'sine', freq, vol, masterGain, oscillators);
    createLFO(audioContext, 5 + i * 1.5, vol * 0.8, gain.gain, oscillators, 'square');
  });

  // Mid-range saw for body
  const { gain: midGain } = createFilteredTone(audioContext, 'sawtooth', 165, 0.05, 'bandpass', 300, 2, masterGain, oscillators);
  createLFO(audioContext, 6, 0.03, midGain.gain, oscillators);

  addSpaceNoise(audioContext, masterGain, oscillators, 0.035);
}
