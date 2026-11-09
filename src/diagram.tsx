import type { Copy } from "./i18n";

const BLADE = "M0,-12 C10,-30 30,-48 48,-44 C40,-26 22,-12 6,-6 Z";

function Blades({ n = 7 }: { n?: number }) {
  return (
    <g className="spin">
      <circle r="52" className="spin-bounds" />
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={BLADE} transform={`rotate(${(360 / n) * i})`} className="blade" />
      ))}
    </g>
  );
}

/* Esquema do computador aberto. Todas as cores vêm de tokens (ver styles.css, .diagram). */
export function Diagram({ t }: { t: Copy }) {
  return (
    <svg viewBox="0 0 420 380" role="img" aria-label={t.draw.aria} className="diagram">
      <rect x="16" y="16" width="388" height="348" rx="16" className="board" />
      {[
        [36, 36],
        [384, 36],
        [36, 344],
        [384, 344],
      ].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="4.5" className="hole" />
      ))}
      <path d="M176 92 H206 M176 106 H206 M176 120 H206 M176 134 H206 M112 192 V214 M176 268 H212 M300 298 V318" className="trace" />

      <g className="part">
        <rect x="48" y="64" width="128" height="128" rx="10" className="shape" />
        <rect x="66" y="82" width="92" height="92" rx="6" className="metal" />
        <rect x="96" y="112" width="32" height="32" rx="3" className="d-die" />
        <text x="48" y="50" className="dlabel">{t.draw.cpu}</text>
      </g>

      <g className="part">
        {[212, 236, 260, 284].map((x, i) => (
          <g key={x}>
            <rect x={x} y="64" width="16" height="150" rx="2.5" className="shape" />
            {[0, 1, 2, 3].map((c) => (
              <rect key={c} x={x + 4} y={80 + c * 32} width="8" height="22" rx="1" className="chip-cell" />
            ))}
            {i < 2 && <rect x={x + 2} y="67" width="12" height="5" rx="2" className="d-led" />}
          </g>
        ))}
        <text x="212" y="50" className="dlabel">{t.draw.ram}</text>
      </g>

      <g className="part">
        <circle cx="112" cy="276" r="60" className="shape" />
        <g transform="translate(112 276)">
          <Blades />
          <circle r="11" className="metal" />
        </g>
        <text x="112" y="356" textAnchor="middle" className="dlabel">{t.draw.fan}</text>
      </g>

      <g className="part">
        <rect x="212" y="238" width="176" height="60" rx="8" className="shape" />
        {[254, 346].map((cx) => (
          <g key={cx} transform={`translate(${cx} 268)`}>
            <circle r="23" className="well" />
            <g transform="scale(0.44)">
              <Blades n={9} />
            </g>
            <circle r="5" className="metal" />
          </g>
        ))}
        <text x="212" y="230" className="dlabel">{t.draw.gpu}</text>
      </g>

      <g className="part">
        <rect x="212" y="318" width="176" height="22" rx="4" className="shape" />
        {[226, 270, 314].map((x) => (
          <rect key={x} x={x} y="323" width="34" height="12" rx="1.5" className="chip-cell" />
        ))}
        <text x="388" y="356" textAnchor="end" className="dlabel">{t.draw.storage}</text>
      </g>
    </svg>
  );
}
