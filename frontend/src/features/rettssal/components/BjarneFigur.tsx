import { useEffect, useState } from "react";
import { lyttPaaOpplesning } from "../lyd/opplesning";

/** Animert Bolle-Bjarne: snakker, blunker og hopper av begeistring mens han leser dommen. */
export function BjarneFigur({ size = 180 }: { size?: number }) {
  const [snakker, setSnakker] = useState(false);
  useEffect(() => lyttPaaOpplesning(setSnakker), []);

  return (
    <div className={`bjarne ${snakker ? "bjarne-snakker" : ""}`} style={{ width: size, height: size }} aria-label="Bolle-Bjarne">
      <svg viewBox="0 0 200 200" width={size} height={size}>
        {/* Dommerparykk */}
        <g fill="#f3efe6" stroke="#cfc6b3" strokeWidth="2">
          <circle cx="52" cy="70" r="18" /><circle cx="148" cy="70" r="18" />
          <circle cx="46" cy="98" r="18" /><circle cx="154" cy="98" r="18" />
          <circle cx="48" cy="126" r="17" /><circle cx="152" cy="126" r="17" />
          <ellipse cx="100" cy="52" rx="50" ry="26" />
        </g>
        {/* Hode */}
        <ellipse cx="100" cy="100" rx="44" ry="50" fill="#f2c9a0" />
        {/* Øyenbryn – hopper opp når han er ivrig */}
        <g className="bjarne-bryn" stroke="#5a3a1e" strokeWidth="5" strokeLinecap="round">
          <line x1="70" y1="80" x2="90" y2="76" />
          <line x1="110" y1="76" x2="130" y2="80" />
        </g>
        {/* Øyne */}
        <g className="bjarne-oyne" fill="#2b1a10">
          <ellipse cx="82" cy="94" rx="6" ry="7" />
          <ellipse cx="118" cy="94" rx="6" ry="7" />
        </g>
        {/* Kinn */}
        <circle cx="70" cy="114" r="7" fill="#f29b8a" opacity="0.6" />
        <circle cx="130" cy="114" r="7" fill="#f29b8a" opacity="0.6" />
        {/* Munn */}
        <ellipse className="bjarne-munn" cx="100" cy="126" rx="14" ry="5" fill="#7a2a1e" />
        {/* Dommerkappe */}
        <path d="M40 200 Q100 150 160 200 Z" fill="#1f1f2e" />
        <path d="M92 160 L100 176 L108 160 Z" fill="#fff" />
      </svg>
      {/* Kaffekopp som svinges */}
      <div className="bjarne-kopp">☕</div>
    </div>
  );
}
