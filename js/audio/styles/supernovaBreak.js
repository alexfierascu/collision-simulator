import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createFilteredTone } from '../audioHelpers.js';

export function createSupernovaBreak(audioContext, masterGain, oscillators, musicPlayingRef) {
  // Powerful layered bass
  [55, 110, 165].forEach((freq, i) => {
    const type = i === 0 ? 'sawtooth' : 'square';
    const { gain } = createFilteredTone(audioContext, type, freq, 0.12 - i * 0.02, 'lowpass', 200 + i * 100, 3, masterGain, oscillators);
    createLFO(audioContext, 3, 0.05, gain.gain, oscillators);
  });

  // Aggressive mid-range chords with fast tremolo
  [220, 277.2, 329.6, 440, 554.4].forEach((freq, i) => {
    const vol = 0.04 / (i * 0.3 + 1);
    const { osc, gain } = createFilteredTone(audioContext, 'sawtooth', freq, vol, 'bandpass', freq * 1.5, 2, masterGain, oscillators);

    createLFO(audioContext, 4 + i * 0.8, vol * 0.6, gain.gain, oscillators);
    createLFO(audioContext, 0.5 + i * 0.2, freq * 0.012, osc.frequency, oscillators);
  });

  // Explosion bursts
  [330, 550, 880].forEach((freq, i) => {
    const { gain } = createFilteredTone(audioContext, 'sawtooth', freq, 0, 'highpass', 300, 1, masterGain, oscillators);

    const interval = setInterval(() => {
      if (musicPlayingRef && !musicPlayingRef()) {
        clearInterval(interval);
        return;
      }
      const now = audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    }, 1500 + i * 700);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.06);
}
