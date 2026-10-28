export function Kanelbolle({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="kanelbolle" style={{ verticalAlign: "middle" }}>
      <defs>
        <radialGradient id="deig" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f3c27a" />
          <stop offset="100%" stopColor="#c27a32" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" fill="url(#deig)" stroke="#8a4b1c" strokeWidth="3" />
      <path
        d="M50 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 0 1 8 -8 a12 12 0 0 1 12 12 a16 16 0 0 1 -16 16 a20 20 0 0 1 -20 -20 a24 24 0 0 1 24 -24 a28 28 0 0 1 28 28"
        fill="none"
        stroke="#7a3d12"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <g fill="#fff8ec">
        <circle cx="30" cy="30" r="2" />
        <circle cx="66" cy="28" r="2" />
        <circle cx="72" cy="62" r="2" />
        <circle cx="36" cy="72" r="2" />
        <circle cx="55" cy="40" r="1.6" />
      </g>
    </svg>
  );
}
