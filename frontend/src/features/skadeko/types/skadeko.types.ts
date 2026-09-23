export type Kategori = 'enkel' | 'middels' | 'kompleks';

/** En sak slik den er skrevet i datafila, før den havner på skrivebordet. */
export type Sakmal = {
  kategori: Kategori;
  emoji: string;
  kunde: string;
  beskrivelse: string;
  sporsmal: string;
  /** Nøyaktig tre svaralternativer. */
  svar: [string, string, string];
  /** Indeksen til riktig svar i `svar`. */
  riktig: number;
};

/** En sak som ligger på skrivebordet akkurat nå. */
export type Sak = Omit<Sakmal, 'svar' | 'riktig'> & {
  id: number;
  /** Svaralternativene i blandet rekkefølge. */
  svar: string[];
  riktig: number;
  /** Tidspunkt (performance.now) da kunden går lei. */
  frist: number;
  /** Hvor lang tid saken fikk totalt, i millisekunder. */
  varighet: number;
  /** 1 = helt fersk, 0 = kunden er borte. Oppdateres hver frame. */
  igjen: number;
};

/** Hva som skjedde da du svarte på en sak. Vises som en kort melding. */
export type Tilbakemelding = {
  id: number;
  riktig: boolean;
  poeng: number;
  tekst: string;
};

export type Spilltilstand = 'ikke-startet' | 'spiller' | 'ferdig';

/** Alt Bjarne får vite om arbeidsdagen din. */
export type Dagsresultat = {
  poeng: number;
  behandlet: number;
  tapt: number;
  tittel: string;
  tapteSaker: string[];
  sekunderSpilt: number;
};
