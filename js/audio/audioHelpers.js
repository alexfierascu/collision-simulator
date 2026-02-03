/**
 * Creates an LFO (Low Frequency Oscillator) connected to a target parameter.
 * Returns the oscillator node.
 */
export function createLFO(ctx, freq, amount, target, oscillators, type) {
  const lfo = ctx.createOscillator();
  if (type) lfo.type = type;
  lfo.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.value = amount;
  lfo.connect(gain);
  gain.connect(target);
  lfo.start();
  oscillators.push(lfo);
  return lfo;
}

/**
 * Creates an oscillator with a gain node, connects to destination, starts it.
 * Returns { osc, gain }.
 */
export function createTone(ctx, type, freq, volume, dest, oscillators) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(dest);
  osc.start();
  oscillators.push(osc);
  return { osc, gain };
}

/**
 * Creates an oscillator -> filter -> gain -> destination chain.
 * Returns { osc, filter, gain }.
 */
export function createFilteredTone(ctx, type, freq, volume, filterType, filterFreq, filterQ, dest, oscillators) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = filterQ;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  osc.start();
  oscillators.push(osc);
  return { osc, filter, gain };
}
