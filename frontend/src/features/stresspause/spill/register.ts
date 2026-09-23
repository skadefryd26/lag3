import type { MiniSpill } from '../types/stresspause.types';
import { ArkivTetris } from './ArkivTetris';
import { InnboksNull } from './InnboksNull';
import { Kaffehelling } from './Kaffehelling';
import { KnusSkriveren } from './KnusSkriveren';
import { Papirball } from './Papirball';
import { RyddPulten } from './RyddPulten';
import { StifteAsmr } from './StifteAsmr';
import { Stressballen } from './Stressballen';

/** Legg til et nytt mini-spill her, så dukker det opp i menyen. */
export const MINI_SPILL: MiniSpill[] = [
  {
    id: 'kaffehelling',
    navn: 'Kaffepause',
    emoji: '☕',
    beskrivelse: 'Hell kaffen nøyaktig opp til streken. Jo bedre helling, jo mer energi.',
    kontroller: 'Hold inne og slipp',
    slikSpiller: 'Hold inne for å helle, og slipp når kaffen når streken.',
    Komponent: Kaffehelling,
    anledning: 'kaffepause',
  },
  {
    id: 'rydd-pulten',
    navn: 'Rydd pulten',
    emoji: '🧹',
    beskrivelse: 'Kald kaffe, post-its og en skademelding under bananskallet. Sorter rotet.',
    kontroller: 'Dra og slipp',
    slikSpiller: 'Dra hver ting til riktig kurv.',
    Komponent: RyddPulten,
  },
  {
    id: 'stifte-asmr',
    navn: 'Stifte-ASMR',
    emoji: '📎',
    beskrivelse: 'Guitar Hero, men med stiftemaskin. Treff takten, hør den deilige ka-chunken.',
    kontroller: 'Mellomrom',
    slikSpiller: 'Trykk mellomrom når arket treffer streken.',
    Komponent: StifteAsmr,
  },
  {
    id: 'innboks-null',
    navn: 'Innboks null',
    emoji: '📧',
    beskrivelse: 'Sveip e-poster til arkiv eller søppel. Møteinvitasjoner er alltid søppel.',
    kontroller: 'Sveip / piltaster',
    slikSpiller: 'Sveip jobb-e-post til arkiv og tull til søppel.',
    Komponent: InnboksNull,
  },
  {
    id: 'knus-skriveren',
    navn: 'Knus skriveren',
    emoji: '🖨️',
    beskrivelse: 'Den har hatt papirstopp siden 2019. Nå er det din tur.',
    kontroller: 'Klikk som en gal',
    slikSpiller: 'Klikk på skriveren så fort du kan.',
    Komponent: KnusSkriveren,
  },
  {
    id: 'stressballen',
    navn: 'Stressballen',
    emoji: '🔴',
    beskrivelse: 'Klem og slipp i takt. Ballen dømmer deg ikke. Det gjør Bjarne.',
    kontroller: 'Hold inne',
    slikSpiller: 'Hold inne på KLEM, slipp på SLIPP.',
    Komponent: Stressballen,
  },
  {
    id: 'papirball',
    navn: 'Papirball',
    emoji: '🧻',
    beskrivelse: 'Kast papirballer i søppelbøtta. Den står et nytt sted hver gang, men den er stor.',
    kontroller: 'Dra og slipp',
    slikSpiller: 'Dra bakover og slipp for å kaste i bøtta.',
    Komponent: Papirball,
  },
  {
    id: 'arkiv-tetris',
    navn: 'Arkiv-tetris',
    emoji: '🗂️',
    beskrivelse: 'Stable skademapper i arkivet. Fullt arkiv? Bjarne makulerer alt. Du kan ikke tape.',
    kontroller: 'Piltaster',
    slikSpiller: 'Piltaster flytter og roterer, og fulle rader forsvinner.',
    Komponent: ArkivTetris,
  },
];
