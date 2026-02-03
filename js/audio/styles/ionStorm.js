import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createFilteredTone } from '../audioHelpers.js';

export function createIonStorm(audioContext, masterGain, oscillators, musicPlayingRef) {
  // Heavy distorted bass layers
  [55, 82, 110].forEach((freq, i) => {
    const { osc, gain } = createFilteredTone(audioContext, 'sawtooth', freq, 0.11 - i * 0.02, 'lowpass', 200 + i * 60, 6, masterGain, oscillators);
    createLFO(audioContext, 3.5, 0.05, gain.gain, oscillators);
    createLFO(audioContext, 0.3, freq * 0.02, osc.frequency, oscillators);
  });

  // Chaotic mid-range — multiple detuned voices
  [220, 293.7, 370, 440].forEach((freq, i) => {
    [-15, 0, 15].forEach(detune => {
      const osc = audioContext.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = detune;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq * 1.2;
      filter.Q.value = 2;

      const gain = audioContext.createGain();
      gain.gain.value = 0.02 / (i + 1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });
  });

  // Lightning cracks
  [660, 990, 1320].forEach((freq, i) => {
    const { gain } = createFilteredTone(audioContext, 'sawtooth', freq, 0, 'highpass', 500, 1, masterGain, oscillators);

    const interval = setInterval(() => {
      if (musicPlayingRef && !musicPlayingRef()) {
        clearInterval(interval);
        return;
      }
      const now = audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    }, 800 + i * 600 + Math.random() * 400);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.07);
}
