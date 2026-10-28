import { useMemo } from "react";

const bolleTyper = ["🥐", "🥯", "🍩", "🧁", "🥖", "☕"];

export function BolleRegn({ antall }: { antall: number }) {
  const boller = useMemo(
    () =>
      Array.from({ length: Math.min(Math.max(antall, 20), 120) }, (_, i) => ({
        id: i,
        ikon: bolleTyper[Math.floor(Math.random() * bolleTyper.length)],
        left: Math.random() * 100,
        delay: 1.6 + Math.random() * 2.5,
        duration: 2.5 + Math.random() * 2.5,
        size: 24 + Math.random() * 32,
        spin: (Math.random() < 0.5 ? -1 : 1) * (180 + Math.random() * 540),
      })),
    [antall],
  );

  return (
    <div className="bolleregn" aria-hidden>
      {boller.map((b) => (
        <span
          key={b.id}
          className="bolle"
          style={{
            left: `${b.left}vw`,
            fontSize: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            ["--spin" as string]: `${b.spin}deg`,
          }}
        >
          {b.ikon}
        </span>
      ))}
    </div>
  );
}
