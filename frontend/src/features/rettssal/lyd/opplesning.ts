// Bolle-Bjarne leser opp dommen med nettleserens innebygde talestemme.
//
// Tre ting avgjør om det høres ut som et menneske eller en mikrobølgeovn:
//   1. at vi faktisk får tak i en norsk stemme (lista er tom de første sekundene)
//   2. at tonefallet får ligge nær det normale - dyp og treg blir monoton, ikke lat
//   3. at pausene er ekte stillhet mellom setninger, ikke "..." inni teksten

let aktivTimer: number | null = null;
let avbrutt = false;

/** Stemmelista fylles asynkront i Chrome og Edge. Vent på den. */
function hentStemmer(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const naa = synth.getVoices();
  if (naa.length) return Promise.resolve(naa);

  return new Promise((resolve) => {
    const ferdig = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", ferdig, { once: true });
    // Noen nettlesere sender aldri hendelsen. Ikke bli stående og vente.
    window.setTimeout(ferdig, 1200);
  });
}

function velgStemme(stemmer: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const norske = stemmer.filter((s) => /^(nb|nn|no)(-|_|$)/i.test(s.lang));
  // Windows har «Microsoft Finn», macOS har «Nora». Finn foretrekkes - Bjarne er en mann.
  return (
    norske.find((s) => /finn|jon|mann|male/i.test(s.name)) ??
    norske[0] ??
    // Ingen norsk stemme installert: dansk og svensk uttaler norsk langt bedre enn engelsk.
    stemmer.find((s) => /^(da|sv)(-|_|$)/i.test(s.lang))
  );
}

/** Gjør teksten leselig for en talesyntese. */
function tilTale(tekst: string): string {
  return (
    tekst
      // *sukk* er en regianvisning, ikke noe som skal leses
      .replace(/\*[^*]*\*/g, " ")
      .replace(/§\s*/g, "paragraf ")
      // «3-1» leses ellers som «tre bindestrek en»
      .replace(/(\d)\s*-\s*(\d)/g, "$1 $2")
      .replace(/\bjf\.\s*/gi, "jamfør ")
      .replace(/\bbl\.a\.\s*/gi, "blant annet ")
      .replace(/\bosv\./gi, "og så videre")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/** Del opp i setninger, så hver får sitt eget tonefall og en pust etterpå. */
function tilSetninger(tekst: string): string[] {
  return tekst
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const innledninger = [
  "Åh. Nei. Ikke du igjen.",
  "Hmpf. Jeg hadde akkurat satt meg.",
  "Mmm. Ja. Greit. Hvis vi må.",
  "Jaja. Retten er vel satt, da.",
];

const avslutninger = [
  "Retten er hevet. Ikke snakk til meg.",
  "Ferdig. Og kaffen min er kald. Selvfølgelig.",
  "Retten er hevet. Jeg går og legger meg i serverrommet.",
  "Det var det. Hvorfor er det alltid jeg?",
];

const tilfeldig = (liste: string[]) => liste[Math.floor(Math.random() * liste.length)];

type Replikk = { tekst: string; rate: number; pitch: number; volume: number; pauseEtter: number };

/** Si én replikk, og vent til den er ferdig. */
function si(replikk: Replikk, stemme?: SpeechSynthesisVoice): Promise<void> {
  return new Promise((resolve) => {
    if (avbrutt) return resolve();

    const ytring = new SpeechSynthesisUtterance(replikk.tekst);
    ytring.lang = stemme?.lang ?? "nb-NO";
    if (stemme) ytring.voice = stemme;
    ytring.rate = replikk.rate;
    ytring.pitch = replikk.pitch;
    ytring.volume = replikk.volume;

    const videre = () => {
      if (avbrutt) return resolve();
      // Ekte stillhet mellom setningene - det er dette som gir pust og timing.
      aktivTimer = window.setTimeout(resolve, replikk.pauseEtter);
    };

    ytring.onend = videre;
    ytring.onerror = videre;
    window.speechSynthesis.speak(ytring);
  });
}

export async function lesOppDom(boller: number, begrunnelse: string) {
  if (!("speechSynthesis" in window)) return;

  stoppOpplesning();
  avbrutt = false;

  const stemme = velgStemme(await hentStemmer());
  if (avbrutt) return;

  const setninger = tilSetninger(tilTale(begrunnelse));

  const replikker: Replikk[] = [
    // Sukket først: litt lavere og litt tregere enn resten, men ikke monotont.
    { tekst: tilfeldig(innledninger), rate: 0.92, pitch: 0.85, volume: 1, pauseEtter: 550 },
    // Selve begrunnelsen i normalt tempo. Bjarne er lat, ikke søvnig.
    ...setninger.map((tekst, i) => ({
      tekst,
      rate: 1,
      pitch: 0.9,
      volume: 1,
      pauseEtter: i === setninger.length - 1 ? 650 : 320,
    })),
    // Selve domsslutningen: langsom og tydelig, med en pause foran tallet.
    { tekst: "Dommen lyder:", rate: 0.88, pitch: 0.88, volume: 1, pauseEtter: 700 },
    { tekst: `${boller} boller.`, rate: 0.82, pitch: 0.82, volume: 1, pauseEtter: 800 },
    // Siste replikk mumles, som om han allerede har reist seg.
    { tekst: tilfeldig(avslutninger), rate: 0.95, pitch: 0.85, volume: 0.75, pauseEtter: 0 },
  ];

  for (const replikk of replikker) {
    if (avbrutt) return;
    await si(replikk, stemme);
  }
}

export function stoppOpplesning() {
  avbrutt = true;
  if (aktivTimer !== null) {
    window.clearTimeout(aktivTimer);
    aktivTimer = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
