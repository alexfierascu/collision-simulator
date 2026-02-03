export function addSpaceNoise(audioContext, masterGain, oscillators, level) {
  const bufferSize = 2 * audioContext.sampleRate;
  const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;

  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1000;
  noiseFilter.Q.value = 0.5;

  const filterLfo = audioContext.createOscillator();
  filterLfo.frequency.value = 0.05;
  const filterGain = audioContext.createGain();
  filterGain.gain.value = 500;
  filterLfo.connect(filterGain);
  filterGain.connect(noiseFilter.frequency);
  filterLfo.start();

  const noiseGain = audioContext.createGain();
  noiseGain.gain.value = level;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);
  noise.start();

  oscillators.push(noise, filterLfo);
}
