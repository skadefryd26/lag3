import { useCallback, useRef } from 'react';

/**
 * Sørger for at et spill bare rapporterer resultat én gang, uansett hvor mange veier det kan ende.
 * Returnerer en stabil funksjon, så den trygt kan brukes i effekter.
 */
export function useFerdig(onFerdig: (score: number) => void) {
  const ferdig = useRef(false);
  const onFerdigRef = useRef(onFerdig);
  onFerdigRef.current = onFerdig;
  return useCallback((score: number) => {
    if (ferdig.current) return;
    ferdig.current = true;
    onFerdigRef.current(Math.max(0, Math.min(1, score)));
  }, []);
}
