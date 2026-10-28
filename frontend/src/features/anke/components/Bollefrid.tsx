// Offisielt portrett av Overdommer Bollefrid, malt for anledningen.
// Hun er en bolle. Med dommerparykk. Ikke still spørsmål.

export function Bollefrid({ size = 160 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label="Portrett av Overdommer Bollefrid"
    >
      <defs>
        <radialGradient id="bolle" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#f3c17a" />
          <stop offset="70%" stopColor="#d9983f" />
          <stop offset="100%" stopColor="#a9701f" />
        </radialGradient>
      </defs>

      {/* ramme */}
      <rect x="4" y="4" width="192" height="192" rx="8" fill="#2a1d10" stroke="#c99b45" strokeWidth="6" />
      <rect x="14" y="14" width="172" height="172" rx="4" fill="#3b2a18" />

      {/* kappe */}
      <path d="M40 200 Q100 140 160 200 Z" fill="#1b1b22" />
      <path d="M86 200 Q100 150 114 200 Z" fill="#f5f0e6" />

      {/* parykk, venstre og høyre krøller */}
      <g fill="#efe9dc">
        <circle cx="52" cy="92" r="17" />
        <circle cx="48" cy="114" r="15" />
        <circle cx="52" cy="134" r="13" />
        <circle cx="148" cy="92" r="17" />
        <circle cx="152" cy="114" r="15" />
        <circle cx="148" cy="134" r="13" />
        <path d="M60 70 Q100 44 140 70 Q142 84 138 92 Q100 72 62 92 Q58 84 60 70 Z" />
      </g>

      {/* selve bollen */}
      <ellipse cx="100" cy="106" rx="42" ry="38" fill="url(#bolle)" />
      <path d="M62 96 Q100 80 138 96" stroke="#8a5a14" strokeWidth="3" fill="none" opacity="0.5" />

      {/* rosiner */}
      <circle cx="80" cy="124" r="4" fill="#4a2c12" />
      <circle cx="118" cy="128" r="3.5" fill="#4a2c12" />
      <circle cx="100" cy="88" r="3" fill="#4a2c12" />

      {/* strengt blikk */}
      <g>
        <path d="M78 96 Q86 92 94 96" stroke="#3a2409" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M106 96 Q114 92 122 96" stroke="#3a2409" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="86" cy="105" r="4.5" fill="#2b1a06" />
        <circle cx="114" cy="105" r="4.5" fill="#2b1a06" />
      </g>

      {/* misfornøyd munn */}
      <path d="M86 126 Q100 118 114 126" stroke="#2b1a06" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* klubbe */}
      <g transform="rotate(-20 160 160)">
        <rect x="140" y="158" width="46" height="9" rx="4" fill="#7a4a18" />
        <rect x="176" y="150" width="18" height="25" rx="4" fill="#9c6224" />
      </g>

      <text x="100" y="186" textAnchor="middle" fontSize="11" fill="#c99b45" fontFamily="'Playfair Display', serif">
        Overdommer Bollefrid
      </text>
    </svg>
  );
}
