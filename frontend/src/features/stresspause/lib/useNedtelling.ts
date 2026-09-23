import { useEffect, useRef, useState } from 'react';

/** Teller ned fra `sekunder` og kaller `onNull` én gang når tida er ute. */
export function useNedtelling(sekunder: number, onNull: () => void, aktiv = true) {
  const [igjen, setIgjen] = useState(sekunder);
  const onNullRef = useRef(onNull);
  onNullRef.current = onNull;

  useEffect(() => {
    if (!aktiv) return;
    const slutt = performance.now() + igjen * 1000;
    const id = setInterval(() => {
      const rest = Math.max(0, (slutt - performance.now()) / 1000);
      setIgjen(rest);
      if (rest <= 0) {
        clearInterval(id);
        onNullRef.current();
      }
    }, 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktiv]);

  return igjen;
}
