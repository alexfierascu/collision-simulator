import { addSpaceNoise } from '../noiseGenerator.js';
import { createLFO, createFilteredTone } from '../audioHelpers.js';

export function createBlackHoleEcho(audioContext, masterGain, oscillators, musicPlayingRef) {
  const base = 40;

  [1, 1.5, 2].forEach((mult) => {
    const { osc } = createFilteredTone(audioContext, 'sawtooth', base * mult, 0.06, 'lowpass', 150, 5, masterGain, oscillators);
    createLFO(audioContext, 0.02, 3, osc.frequency, oscillators);
  });

  // Ghostly echoes
  [200, 300, 450].forEach((freq, i) => {
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = audioContext.createGain();
    gain.gain.value = 0;

    const interval = setInterval(() => {
      if (musicPlayingRef && !musicPlayingRef()) {
        clearInterval(interval);
        return;
      }
      gain.gain.setValueAtTime(0.03, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2);
    }, 3000 + i * 1500);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    oscillators.push(osc);
  });

  addSpaceNoise(audioContext, masterGain, oscillators, 0.03);
}
