// Bolle-Bjarne leser opp dommen med nettleserens innebygde talestemme.
// Han er fortsatt arrogant, men nå er han ellevill når det er snakk om boller.

function norskStemme(): SpeechSynthesisVoice | undefined {
  const stemmer = window.speechSynthesis.getVoices();
  return (
    stemmer.find((s) => /^(nb|no|nn)(-|_|$)/i.test(s.lang) && /male|mann|finn|jon/i.test(s.name)) ??
    stemmer.find((s) => /^(nb|no|nn)(-|_|$)/i.test(s.lang))
  );
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

  const stemme = norskStemme();
  deler.forEach((del, i) => {
    const ytring = new SpeechSynthesisUtterance(del);
    ytring.lang = "nb-NO";
    if (stemme) ytring.voice = stemme;
    const erBolleDom = i === 2;
    ytring.rate = erBolleDom ? 1.15 : 1.05; // ivrig, nesten for ivrig
    ytring.pitch = erBolleDom ? 1.6 : 1.2; // stemmen går opp når bollene nevnes
    ytring.volume = 1;
    if (i === 0) ytring.onstart = () => varsle(true);
    if (i === deler.length - 1) {
      ytring.onend = () => varsle(false);
      ytring.onerror = () => varsle(false);
    }
    synth.speak(ytring);
  });
}

export function stoppOpplesning() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  varsle(false);
}
