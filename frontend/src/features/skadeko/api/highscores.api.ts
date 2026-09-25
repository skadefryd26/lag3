import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore/lite';
import type { VanskelighetsgradId } from '../data/vanskelighetsgrader';

/**
 * Den delte poengtavla ligger i Firestore i Firebase-prosjektet «skadequeue».
 * Konfigurasjonen under er ikke hemmelig — den sier bare hvilket prosjekt det
 * gjelder. Hvem som får lese og skrive, styres av `firestore.rules`.
 */
const app = initializeApp({
  apiKey: 'AIzaSyBZIWc5bkBPIqeMVGl2VvNAkcnaURHp5cQ',
  authDomain: 'skadequeue.firebaseapp.com',
  projectId: 'skadequeue',
  appId: '1:662661061192:web:c912054f4a770bd430d67d',
});
const db = getFirestore(app);
const SAMLING = 'highscores';

export type Highscore = {
  navn: string;
  poeng: number;
  grad: VanskelighetsgradId;
};

/** Mandag 00:00 i uka `dato` ligger i, lokal tid. */
export function ukestart(dato = new Date()): Date {
  const start = new Date(dato.getFullYear(), dato.getMonth(), dato.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

/** ISO-ukenummer som «2026-U39». Tavla gjelder én uke om gangen. */
export function ukeId(dato = new Date()): string {
  const d = new Date(Date.UTC(dato.getFullYear(), dato.getMonth(), dato.getDate()));
  // Torsdagen i samme uke avgjør hvilket år uka hører til.
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const aar = d.getUTCFullYear();
  const dagIAaret = (d.getTime() - Date.UTC(aar, 0, 1)) / 86_400_000;
  const uke = Math.floor(dagIAaret / 7) + 1;
  return `${aar}-U${String(uke).padStart(2, '0')}`;
}

/** Alle oppføringer for uka, alle grader. Sorteres og kuttes i hooken. */
export async function hentUkensHighscores(): Promise<Highscore[]> {
  const svar = await getDocs(query(collection(db, SAMLING), where('uke', '==', ukeId())));
  return svar.docs.map((d) => {
    const { navn, poeng, grad } = d.data();
    return { navn, poeng, grad } as Highscore;
  });
}

export async function lagreHighscore(h: Highscore): Promise<void> {
  await addDoc(collection(db, SAMLING), {
    navn: h.navn.trim().slice(0, 24),
    poeng: Math.round(h.poeng),
    grad: h.grad,
    uke: ukeId(),
    dato: serverTimestamp(),
  });
}
