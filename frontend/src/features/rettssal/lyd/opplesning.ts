// Bolle-Bjarne leser opp dommen med nettleserens innebygde talestemme.
// Han er fortsatt arrogant, men nå er han ellevill når det er snakk om boller.

// Kjente mannsstemmer i Windows/Edge/Mac. Edge sine «Online (Natural)»-stemmer er de beste.
const MANN = /finn|jon|jeppe|christoffer|magnus|mads|male|mann|david|mark|guy|daniel/i;
const KVINNE = /pernille|iselin|hulda|helle|christel|sofie|female|kvinne|zira|nora/i;
const NORDISK = /^(nb|no|nn|da|sv)(-|_|$)/i;

/** Velger best mulige mannsstemme: norsk > dansk/svensk > hva som helst. */
function velgStemme(stemmer: SpeechSynthesisVoice[]): { stemme?: SpeechSynthesisVoice; erKvinne: boolean } {
  const poeng = (s: SpeechSynthesisVoice) =>
    (MANN.test(s.name) ? 100 : KVINNE.test(s.name) ? 0 : 40) +
    (/^(nb|no|nn)/i.test(s.lang) ? 30 : NORDISK.test(s.lang) ? 20 : 0) +
    (/natural|online/i.test(s.name) ? 5 : 0);
  const nordiske = stemmer.filter((s) => NORDISK.test(s.lang));
  const kandidater = nordiske.length ? nordiske : stemmer;
  const stemme = [...kandidater].sort((a, b) => poeng(b) - poeng(a))[0];
  return { stemme, erKvinne: !stemme || !MANN.test(stemme.name) };
}

// Stemmelista lastes asynkront i Chrome/Edge – be om den tidlig.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => window.speechSynthesis.getVoices());
}

/**
 * Vent til stemmelista faktisk er fylt. Uten dette havner den aller første
 * opplesningen på en engelsk stemme som leser norsk - og det er den enkeltfeilen
 * som gjør at Bjarne høres ut som en mikrobølgeovn.
 */
function hentStemmer(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const naa = synth.getVoices();
  if (naa.length) return Promise.resolve(naa);
  return new Promise((resolve) => {
    const ferdig = () => resolve(synth.getVoices());
    synth.addEventListener("voiceschanged", ferdig, { once: true });
    window.setTimeout(ferdig, 1200); // noen nettlesere sender aldri hendelsen
  });
}

/** Gjør teksten leselig for en talesyntese. */
function tilTale(tekst: string): string {
  return tekst
    .replace(/\*[^*]*\*/g, " ") // *sukk* er en regianvisning, ikke tale
    .replace(/§\s*/g, "paragraf ")
    .replace(/(\d)\s*-\s*(\d)/g, "$1 $2") // «3-1» ble lest som «tre bindestrek en»
    .replace(/\bjf\.\s*/gi, "jamfør ")
    .replace(/\bbl\.a\.\s*/gi, "blant annet ")
    .replace(/\bosv\./gi, "og så videre")
    .replace(/\s+/g, " ")
    .trim();
}

/** Én setning per ytring gir hver setning sitt eget tonefall og en naturlig pust. */
function tilSetninger(tekst: string): string[] {
  return tekst
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const innledninger = [
  "Ja! JA! Retten er satt! Endelig skjer det noe her!",
  "Åh, for en sak! Jeg kjenner allerede lukten av kanel!",
  "Mine damer og herrer! Bolle-Bjarne er i bygget!",
  "Hehe. Å, dette blir godt. Dette blir veldig godt.",
];

const avslutninger = [
  "Retten er hevet! Og kaffen er klar! Perfekt dag!",
  "Fantastisk! Jeg går og varmer opp kaffen!",
  "Rettferdigheten har seiret! Og den smaker kanel!",
  "Takk for i dag! Husk: lås PC-en, eller kom tilbake med flere boller!",
];

const tilfeldig = (liste: string[]) => liste[Math.floor(Math.random() * liste.length)];

type Lytter = (snakker: boolean) => void;
const lyttere = new Set<Lytter>();

/** Lar en komponent (f.eks. animerte Bjarne) vite når han snakker. */
export function lyttPaaOpplesning(lytter: Lytter) {
  lyttere.add(lytter);
  return () => {
    lyttere.delete(lytter);
  };
}

const varsle = (snakker: boolean) => lyttere.forEach((l) => l(snakker));
let aktiveYtringer: SpeechSynthesisUtterance[] = [];
let sjekkId: ReturnType<typeof setInterval> | undefined;
let avbrutt = false;

export async function lesOppDom(boller: number, begrunnelse: string) {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  avbrutt = false;

  // Stemmen må være på plass før første ytring sendes av gårde.
  const { stemme, erKvinne } = velgStemme(await hentStemmer());
  if (avbrutt) return;

  const setninger = tilSetninger(tilTale(begrunnelse));
  const deler: { tekst: string; erBolleDom: boolean }[] = [
    { tekst: tilfeldig(innledninger), erBolleDom: false },
    ...setninger.map((tekst) => ({ tekst, erBolleDom: false })),
    { tekst: `Og dommen lyder... ${boller}! ${boller} BOLLER! Hahaha!`, erBolleDom: true },
    { tekst: tilfeldig(avslutninger), erBolleDom: false },
  ];

  // Nettleserens start/slutt-hendelser er upålitelige (særlig i Edge/Chrome),
  // så Bjarne begynner å snakke med en gang, og vi sjekker selv når talen er ferdig.
  varsle(true);
  aktiveYtringer = [];
  if (sjekkId) clearInterval(sjekkId);
  let harStartet = false;
  const start = Date.now();
  sjekkId = setInterval(() => {
    if (synth.speaking) harStartet = true;
    const ferdig = harStartet ? !synth.speaking : Date.now() - start > 4000;
    if (ferdig) {
      clearInterval(sjekkId);
      sjekkId = undefined;
      varsle(false);
    }
  }, 250);

  // Mannsstemme: litt lys og ivrig. Finnes bare kvinnestemme: dra den så dypt det går.
  const grunnTone = erKvinne ? 0.1 : 1.0;
  for (const { tekst, erBolleDom } of deler) {
    const ytring = new SpeechSynthesisUtterance(tekst);
    ytring.lang = stemme?.lang ?? "nb-NO";
    if (stemme) ytring.voice = stemme;
    ytring.rate = erBolleDom ? 1.15 : 1.05; // ivrig, nesten for ivrig
    ytring.pitch = erBolleDom ? grunnTone + 0.3 : grunnTone; // stemmen går opp når bollene nevnes
    ytring.volume = 1;
    aktiveYtringer.push(ytring); // hindrer at nettleseren kaster dem midt i opplesningen
    synth.speak(ytring);
  }
}

export function stoppOpplesning() {
  avbrutt = true;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (sjekkId) clearInterval(sjekkId);
  sjekkId = undefined;
  varsle(false);
}
