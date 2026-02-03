import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createTone, createFilteredTone } from '../audioHelpers.js';

export function createSolarFlare(audioContext, masterGain, oscillators) {
  // Punchy bass with fast pulse
  const { gain: bassGain } = createTone(audioContext, 'sawtooth', 82, 0.14, masterGain, oscillators);
  createLFO(audioContext, 2, 0.06, bassGain.gain, oscillators);

  // Fast arpeggio layers — pentatonic
  const notes = [164.8, 220, 293.7, 329.6, 440, 523.3];
  notes.forEach((freq, i) => {
    const type = i % 2 === 0 ? 'triangle' : 'sawtooth';
    const vol = 0.05 / (i * 0.5 + 1);
    const { osc, gain } = createFilteredTone(audioContext, type, freq, vol, 'bandpass', freq * 1.5, 2, masterGain, oscillators);

    // Fast tremolo + pitch wobble
    createLFO(audioContext, 3 + i * 0.7, vol * 0.6, gain.gain, oscillators);
    createLFO(audioContext, 1 + i * 0.3, freq * 0.008, osc.frequency, oscillators);
  });

  // Bright shimmer
  const { gain: shimGain } = createTone(audioContext, 'sine', 880, 0.03, masterGain, oscillators);
  createLFO(audioContext, 4, 0.015, shimGain.gain, oscillators);

  addSpaceNoise(audioContext, masterGain, oscillators, 0.04);
}
