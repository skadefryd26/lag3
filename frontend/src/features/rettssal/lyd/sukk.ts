// Bolle-Bjarnes sukk, laget med lyd fra nettleseren (Web Audio) - ingen lydfil trengs.

let ctx: AudioContext | null = null;

/** Kalles ved knappetrykk, så nettleseren tillater lyd senere. */
export function vekkLyd() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
}

/** Et langt, oppgitt utpust: susende pust som synker i tone og dør ut. */
export function sukk() {
  if (!ctx) vekkLyd();
  const ac = ctx!;
  const varighet = 2.6; // ekstra langt og lidende
  const start = ac.currentTime + 0.05;

  // Pust = hvit støy
  const buffer = ac.createBuffer(1, ac.sampleRate * varighet, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const pust = ac.createBufferSource();
  pust.buffer = buffer;

  // Formant-filter som gir «haaaah»-klang og synker mot slutten
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 1.4;
  filter.frequency.setValueAtTime(1100, start);
  filter.frequency.exponentialRampToValueAtTime(450, start + varighet);

  // Litt stemme i starten: et lavt, fallende brumm
  const stemme = ac.createOscillator();
  stemme.type = "sawtooth";
  stemme.frequency.setValueAtTime(120, start);
  stemme.frequency.exponentialRampToValueAtTime(65, start + varighet * 0.8);
  const stemmeFilter = ac.createBiquadFilter();
  stemmeFilter.type = "lowpass";
  stemmeFilter.frequency.value = 700;
  const stemmeVolum = ac.createGain();
  stemmeVolum.gain.setValueAtTime(0, start);
  stemmeVolum.gain.linearRampToValueAtTime(0.09, start + 0.2);
  stemmeVolum.gain.exponentialRampToValueAtTime(0.0001, start + varighet * 0.8);

  const volum = ac.createGain();
  volum.gain.setValueAtTime(0.0001, start);
  volum.gain.exponentialRampToValueAtTime(0.7, start + 0.25);
  volum.gain.exponentialRampToValueAtTime(0.0001, start + varighet);

  pust.connect(filter).connect(volum).connect(ac.destination);
  stemme.connect(stemmeFilter).connect(stemmeVolum).connect(ac.destination);
  pust.start(start);
  pust.stop(start + varighet);
  stemme.start(start);
  stemme.stop(start + varighet);
}
