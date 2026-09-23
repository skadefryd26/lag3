/** Små syntetiske lyder via WebAudio — ingen lydfiler å laste ned. */
let ctx: AudioContext | null = null;

function lydkontekst(): AudioContext | null {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(frekvens: number, varighet: number, type: OscillatorType = 'sine', volum = 0.15, glid?: number) {
  const c = lydkontekst();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frekvens, c.currentTime);
  if (glid) osc.frequency.exponentialRampToValueAtTime(glid, c.currentTime + varighet);
  gain.gain.setValueAtTime(volum, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + varighet);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + varighet);
}

function støy(varighet: number, volum = 0.2, filterFrekvens = 1800) {
  const c = lydkontekst();
  if (!c) return;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * varighet), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const kilde = c.createBufferSource();
  kilde.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFrekvens;
  const gain = c.createGain();
  gain.gain.value = volum;
  kilde.connect(filter).connect(gain).connect(c.destination);
  kilde.start();
}

export const lyd = {
  pop: () => tone(600 + Math.random() * 300, 0.08, 'triangle', 0.2, 200),
  riktig: () => tone(880, 0.15, 'sine', 0.12, 1320),
  feil: () => tone(220, 0.18, 'square', 0.05, 160),
  stift: () => {
    støy(0.06, 0.35, 3000);
    setTimeout(() => tone(140, 0.08, 'square', 0.08, 90), 30);
  },
  knas: () => {
    støy(0.15, 0.4, 900);
    tone(90 + Math.random() * 60, 0.12, 'sawtooth', 0.08, 40);
  },
  swish: () => støy(0.2, 0.15, 600),
  klem: () => tone(180, 0.25, 'sine', 0.1, 120),
  linje: () => [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, 0.15, 'triangle', 0.12), i * 70)),
  ferdig: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 0.2, 'triangle', 0.12), i * 110)),
};
