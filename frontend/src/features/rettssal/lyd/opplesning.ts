// Bolle-Bjarne leser opp dommen med nettleserens innebygde talestemme.
// Han er fortsatt arrogant, men nå er han ellevill når det er snakk om boller.

// Kjente mannsstemmer i Windows/Edge/Mac. Edge sine «Online (Natural)»-stemmer er de beste.
const MANN = /finn|jon|jeppe|christoffer|magnus|mads|male|mann|david|mark|guy|daniel/i;
const KVINNE = /pernille|iselin|hulda|helle|christel|sofie|female|kvinne|zira|nora/i;
const NORDISK = /^(nb|no|nn|da|sv)(-|_|$)/i;

/** Velger best mulige mannsstemme: norsk > dansk/svensk > hva som helst. */
function velgStemme(): { stemme?: SpeechSynthesisVoice; erKvinne: boolean } {
  const stemmer = window.speechSynthesis.getVoices();
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

export function lesOppDom(boller: number, begrunnelse: string) {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const renTekst = begrunnelse.replace(/\*[^*]*\*/g, "").replace(/§/g, "paragraf ").trim();
  const deler = [
    tilfeldig(innledninger),
    renTekst,
    `Og dommen lyder... ${boller}! ${boller} BOLLER! Hahaha!`,
    tilfeldig(avslutninger),
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

  const { stemme, erKvinne } = velgStemme();
  // Mannsstemme: litt lys og ivrig. Finnes bare kvinnestemme: dra den så dypt det går.
  const grunnTone = erKvinne ? 0.1 : 1.0;
  deler.forEach((del, i) => {
    const ytring = new SpeechSynthesisUtterance(del);
    ytring.lang = stemme?.lang ?? "nb-NO";
    if (stemme) ytring.voice = stemme;
    const erBolleDom = i === 2;
    ytring.rate = erBolleDom ? 1.15 : 1.05; // ivrig, nesten for ivrig
    ytring.pitch = erBolleDom ? grunnTone + 0.3 : grunnTone; // stemmen går opp når bollene nevnes
    ytring.volume = 1;
    aktiveYtringer.push(ytring); // hindrer at nettleseren kaster dem midt i opplesningen
    synth.speak(ytring);
  });
}

export function stoppOpplesning() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  if (sjekkId) clearInterval(sjekkId);
  sjekkId = undefined;
  varsle(false);
}
