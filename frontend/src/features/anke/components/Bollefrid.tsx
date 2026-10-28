// Offisielt portrett av ankedommeren, malt for anledningen.
// Hun er en bolle. Med dommerparykk. Og hun blir verre for hver anke.

const MAKS_SINNE = 4;

export function Bollefrid({
  size = 160,
  sinne = 0,
  navn = "Overdommer Bollefrid",
}: {
  size?: number;
  sinne?: number;
  navn?: string;
}) {
  const s = Math.min(MAKS_SINNE, Math.max(0, sinne));

  // Parykken sklir mer og mer av.
  const parykkSkjev = s * 4;
  const parykkNed = s * 3;

  // Ansiktet blir rødere.
  const rodme = ["#d9983f", "#d08836", "#c4702c", "#b85524", "#a83c1c"][s];
  const kant = ["#a9701f", "#9c6218", "#8d4d14", "#7d3a10", "#6d260c"][s];

  // Øyebrynene blir brattere.
  const brynLoft = 4 + s * 3;
  // Munnen blir surere.
  const munnBue = 118 - s * 3;

  const kaffekopper = s;

  return (
    <div
      className={s >= MAKS_SINNE ? "bollefrid-rister" : undefined}
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        role="img"
        aria-label={`Portrett av ${navn}, sinnenivå ${s} av ${MAKS_SINNE}`}
      >
        <defs>
          <radialGradient id={`bolle-${s}`} cx="40%" cy="30%">
            <stop offset="0%" stopColor="#f3c17a" />
            <stop offset="70%" stopColor={rodme} />
            <stop offset="100%" stopColor={kant} />
          </radialGradient>
        </defs>

        {/* ramme */}
        <rect x="4" y="4" width="192" height="192" rx="8" fill="#2a1d10" stroke="#c99b45" strokeWidth="6" />
        <rect x="14" y="14" width="172" height="172" rx="4" fill="#3b2a18" />

        {/* røyk fra parykken, helt til slutt */}
        {s >= MAKS_SINNE && (
          <g fill="#8e8e8e" opacity="0.55">
            <circle className="roykpust" cx="74" cy="56" r="9" style={{ animationDelay: "0s" }} />
            <circle className="roykpust" cx="100" cy="46" r="11" style={{ animationDelay: "0.5s" }} />
            <circle className="roykpust" cx="126" cy="56" r="9" style={{ animationDelay: "1s" }} />
          </g>
        )}

        {/* kappe */}
        <path d="M40 200 Q100 140 160 200 Z" fill="#1b1b22" />
        <path d="M86 200 Q100 150 114 200 Z" fill="#f5f0e6" />

        {/* parykken, som sklir */}
        <g
          fill="#efe9dc"
          transform={`rotate(${parykkSkjev} 100 100) translate(0 ${parykkNed})`}
        >
          <circle cx="52" cy="92" r="17" />
          <circle cx="48" cy="114" r="15" />
          <circle cx="52" cy="134" r="13" />
          <circle cx="148" cy="92" r="17" />
          <circle cx="152" cy="114" r="15" />
          <circle cx="148" cy="134" r="13" />
          <path d="M60 70 Q100 44 140 70 Q142 84 138 92 Q100 72 62 92 Q58 84 60 70 Z" />
        </g>

        {/* selve bollen */}
        <ellipse cx="100" cy="106" rx="42" ry="38" fill={`url(#bolle-${s})`} />
        <path d="M62 96 Q100 80 138 96" stroke="#8a5a14" strokeWidth="3" fill="none" opacity="0.5" />

        {/* rosiner */}
        <circle cx="80" cy="124" r="4" fill="#4a2c12" />
        <circle cx="118" cy="128" r="3.5" fill="#4a2c12" />
        <circle cx="100" cy="88" r="3" fill="#4a2c12" />

        {/* blikket, stadig strengere */}
        <g>
          <path
            d={`M78 ${96 + brynLoft} Q86 ${96 - brynLoft} 94 96`}
            stroke="#3a2409"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M106 96 Q114 ${96 - brynLoft} 122 ${96 + brynLoft}`}
            stroke="#3a2409"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="86" cy="105" r="4.5" fill={s >= MAKS_SINNE ? "#e03131" : "#2b1a06"} />
          <circle cx="114" cy="105" r="4.5" fill={s >= MAKS_SINNE ? "#e03131" : "#2b1a06"} />
        </g>

        {/* munnen, stadig surere */}
        <path
          d={`M86 126 Q100 ${munnBue} 114 126`}
          stroke="#2b1a06"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* svette fra og med tredje anke */}
        {s >= 3 && (
          <g fill="#9ad5f0" opacity="0.8">
            <ellipse cx="62" cy="88" rx="3" ry="5" />
            <ellipse cx="139" cy="92" rx="3" ry="5" />
          </g>
        )}

        {/* kaffekoppene hoper seg opp */}
        <g>
          {Array.from({ length: kaffekopper }).map((_, i) => (
            <g key={i} transform={`translate(${26 + i * 15} ${168 - (i % 2) * 7})`}>
              <rect x="0" y="0" width="11" height="9" rx="2" fill="#f5f0e6" />
              <rect x="1.5" y="1.5" width="8" height="3" rx="1" fill="#4a2c12" />
              <path d="M11 2 q4 2.5 0 5" stroke="#f5f0e6" strokeWidth="1.6" fill="none" />
            </g>
          ))}
        </g>

        {/* klubbe */}
        <g transform={`rotate(${-20 - s * 6} 160 160)`}>
          <rect x="140" y="158" width="46" height="9" rx="4" fill="#7a4a18" />
          <rect x="176" y="150" width="18" height="25" rx="4" fill="#9c6224" />
        </g>

        <rect x="18" y="176" width="164" height="16" rx="4" fill="#2a1d10" opacity="0.92" />
        <text x="100" y="188" textAnchor="middle" fontSize="10" fill="#e8c686" fontFamily="'Playfair Display', serif">
          {navn}
        </text>
      </svg>
    </div>
  );
}
