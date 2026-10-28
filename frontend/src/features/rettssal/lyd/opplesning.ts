// Bolle-Bjarne leser opp dommen med nettleserens innebygde talestemme.

function norskStemme(): SpeechSynthesisVoice | undefined {
  const stemmer = window.speechSynthesis.getVoices();
  return (
    stemmer.find((s) => /^(nb|no|nn)(-|_|$)/i.test(s.lang) && /male|mann|finn|jon/i.test(s.name)) ??
    stemmer.find((s) => /^(nb|no|nn)(-|_|$)/i.test(s.lang))
  );
}

const innledninger = [
  "Åh. Nei. Ikke du igjen.",
  "Hmpf. Jeg hadde akkurat satt meg.",
  "Mmm. Ja. Greit. Hvis vi må.",
  "Jaja. Retten er vel satt da.",
];

const avslutninger = [
  "Retten er hevet. Ikke snakk til meg.",
  "Ferdig. Og kaffen min er kald. Selvfølgelig.",
  "Retten er hevet. Jeg går og legger meg i serverrommet.",
  "Det var det. Hvorfor er det alltid jeg?",
];

const tilfeldig = (liste: string[]) => liste[Math.floor(Math.random() * liste.length)];

export function lesOppDom(boller: number, begrunnelse: string) {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();

  const renTekst = begrunnelse.replace(/\*[^*]*\*/g, "").replace(/§/g, "paragraf ").trim();
  // Komma og tankestreker gir lange, oppgitte pauser
  const deler = [
    tilfeldig(innledninger),
    "...",
    renTekst.replace(/\. /g, "... "),
    `Dommen lyder... ${boller}... boller.`,
    "...",
    tilfeldig(avslutninger),
  ];

  const stemme = norskStemme();
  deler.forEach((del, i) => {
    const ytring = new SpeechSynthesisUtterance(del);
    ytring.lang = "nb-NO";
    if (stemme) ytring.voice = stemme;
    ytring.rate = i === 0 || i === deler.length - 1 ? 0.75 : 0.82; // Bjarne gidder ikke skynde seg
    ytring.pitch = 0.45; // dyp, sur og lei
    ytring.volume = i === deler.length - 1 ? 0.8 : 1; // mumler den siste setningen
    synth.speak(ytring);
  });
}

export function stoppOpplesning() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}
