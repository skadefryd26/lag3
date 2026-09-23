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

/** De tre målerne skadebehandleren må holde i sjakk. */
export type MaalerId = 'energi' | 'blaere' | 'stress';

/** Verdien på hver måler, 0–100. Se `data/maalere.ts` for hva 0 og 100 betyr. */
export type Maalere = Record<MaalerId, number>;

/**
 * Det et ferdigspilt minispill leverer tilbake.
 * `endring` er prosentpoeng i retning «bra» for den måleren.
 */
export type TiltakResultat = {
  endring: number;
  melding?: string;
};

/** Alt Bjarne får vite om arbeidsdagen din. */
export type Dagsresultat = {
  poeng: number;
  behandlet: number;
  tapt: number;
  tittel: string;
  tapteSaker: string[];
  sekunderSpilt: number;
};
