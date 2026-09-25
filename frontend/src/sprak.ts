import { useCallback, useSyncExternalStore } from 'react';

/**
 * Språkvalg for hele spillet (norsk/engelsk). Lagres i nettleseren.
 *
 * Bruk i komponenter:  const { t, sprak } = useSprak();  t('Hei', 'Hello')
 * Utenfor React:       tekst('Hei', 'Hello') / hentSprak()
 */
export type Sprak = 'no' | 'en';

const NOKKEL = 'skadeko-sprak';
const lyttere = new Set<() => void>();

let gjeldende: Sprak = (() => {
  try {
    return localStorage.getItem(NOKKEL) === 'en' ? 'en' : 'no';
  } catch {
    return 'no';
  }
})();

export function hentSprak(): Sprak {
  return gjeldende;
}

export function settSprak(sprak: Sprak) {
  gjeldende = sprak;
  try {
    localStorage.setItem(NOKKEL, sprak);
  } catch {
    /* privat modus — valget varer bare denne økten */
  }
  document.documentElement.lang = sprak === 'en' ? 'en' : 'nb';
  lyttere.forEach((l) => l());
}

/** Velger riktig tekst for gjeldende språk. */
export function tekst<T>(no: T, en: T): T {
  return gjeldende === 'en' ? en : no;
}

function abonner(lytter: () => void) {
  lyttere.add(lytter);
  return () => lyttere.delete(lytter);
}

export function useSprak() {
  const sprak = useSyncExternalStore(abonner, hentSprak);
  const t = useCallback(<T,>(no: T, en: T): T => (sprak === 'en' ? en : no), [sprak]);
  return { sprak, settSprak, t };
}
