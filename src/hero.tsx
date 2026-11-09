import { useEffect, useRef, type CSSProperties } from "react";
import type { Copy } from "./i18n";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* Escreve --px/--py (-1..1) no elemento, a partir do rato sobre o hero.
   Sem estado React: só variáveis CSS, num requestAnimationFrame. */
function usePointerVars(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>(".hero");
    if (!el || !host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 2 - 1;
      y = ((e.clientY - r.top) / r.height) * 2 - 1;
      raf ||= requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };
    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}

function Cota({ label }: { label: string }) {
  return (
    <p className="cota">
      <span>{label}</span>
    </p>
  );
}

/* ---------- Conceito A: wafer atrás das alhetas de vidro ---------- */

function Scene() {
  return (
    <div className="scene">
      <div className="scene__sky" />
      <div className="scene__glow" />
      <div className="wafer">
        <div className="wafer__body" />
        <div className="wafer__shine" />
      </div>
    </div>
  );
}

// Pequeno desvio de cada alheta, para a refração não ficar mecânica.
const FIN_SHIFT = [-1.6, 2.2, -0.6, 1.4, -2.2, 0.8, -1.2, 2.6];

function FinsVisual({ t }: { t: Copy }) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerVars(ref);
  return (
    <div ref={ref} className="visual visual--fins">
      <div className="visual__frame" aria-hidden>
        <Scene />
        <div className="fins">
          {FIN_SHIFT.map((s, i) => (
            <div key={i} className="fin" style={{ "--i": i, "--shift": `${s}%` } as Vars}>
              <Scene />
            </div>
          ))}
        </div>
      </div>
      <Cota label={t.draw.custom} />
    </div>
  );
}

/* ---------- Conceito B: vista explodida ---------- */

function StackVisual({ t }: { t: Copy }) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerVars(ref);
  return (
    <div ref={ref} className="visual visual--stack">
      <div className="visual__frame" aria-hidden>
        <div className="stack-glow" />
        <div className="stack">
          <div className="layer layer--wafer" style={{ "--i": 0 } as Vars}>
            <div className="wafer">
              <div className="wafer__body" />
              <div className="wafer__shine" />
            </div>
            <span className="layer__label">{t.draw.wafer}</span>
          </div>
          <div className="layer layer--die" style={{ "--i": 1 } as Vars}>
            <div className="die" />
          </div>
          <div className="layer layer--chip" style={{ "--i": 2 } as Vars}>
            <div className="chip">
              <div className="chip__lid" />
            </div>
            <span className="layer__label">{t.draw.cpu}</span>
          </div>
          <div className="layer layer--sink" style={{ "--i": 3 } as Vars}>
            <div className="sink">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="sink__fin" style={{ "--f": i } as Vars} />
              ))}
            </div>
            <span className="layer__label">{t.draw.heatsink}</span>
          </div>
          <div className="layer layer--fan" style={{ "--i": 4.2 } as Vars}>
            <div className="fan">
              <div className="fan__blades" />
              <div className="fan__hub" />
            </div>
            <span className="layer__label">{t.draw.fan}</span>
          </div>
        </div>
      </div>
      <Cota label={t.draw.custom} />
    </div>
  );
}

/* ---------- Conceito PC: torre com vidro temperado e frente canelada ----------
   Unidade: 1u = 1% da altura da caixa. Eixos da caixa: x = profundidade (frente em +x),
   y = altura (CSS, para baixo), z = espessura (vidro em +z, placa-mãe em -z). */

type BoxProps = {
  c: string;
  x: number; y: number; z: number;
  w: number; h: number; d: number;
  fz?: React.ReactNode; fx?: React.ReactNode; ft?: React.ReactNode;
  children?: React.ReactNode;
};

/* Um paralelepípedo: só as 3 faces que a câmara vê (lado do vidro, frente, topo). */
function Box({ c, x, y, z, w, h, d, fz, fx, ft, children }: BoxProps) {
  return (
    <div className={`box ${c}`} style={{ "--x": x, "--y": y, "--z": z, "--w": w, "--h": h, "--d": d } as Vars}>
      <i className="fz">{fz}</i>
      <i className="fx">{fx}</i>
      <i className="ft">{ft}</i>
      {children}
    </div>
  );
}

/* Etiqueta "billboard": ancorada a uma peça em 3D, mas sempre de frente para quem vê. */
function PcLabel({ text, x, y, z, lead, side = "left" }: { text: string; x: number; y: number; z: number; lead: number; side?: "left" | "right" }) {
  return (
    <span className={`pc-label pc-label--${side}`} style={{ "--x": x, "--y": y, "--z": z, "--lead": lead } as Vars}>
      <b>{text}</b>
    </span>
  );
}

function Fan({ y }: { y?: string }) {
  return (
    <span className="pc-fan" style={y ? ({ "--fy": y } as Vars) : undefined}>
      <span className="pc-fan__blades" />
      <span className="pc-fan__hub" />
    </span>
  );
}

const SLATS = 8;

function PcVisual({ t }: { t: Copy }) {
  const ref = useRef<HTMLDivElement>(null);
  usePointerVars(ref);
  return (
    <div ref={ref} className="visual visual--pc">
      <div className="visual__frame" aria-hidden>
        <div className="pc-floor" />
        <div className="pc">
          {/* Parede interior (tabuleiro da placa-mãe), iluminada pelas ventoinhas da frente */}
          <i className="pc-wall" />
          <i className="pc-rear" />

          {/* Placa-mãe */}
          <Box c="pc-board" x={-6} y={-13} z={-21.5} w={74} h={62} d={1} />
          <Box c="pc-io" x={-38} y={-33} z={-17} w={7} h={20} d={8} />

          {/* Cooler de torre (processador) com ventoinha na face da frente */}
          <Box c="pc-cooler" x={-12} y={-24} z={-10} w={17} h={27} d={22} fx={<Fan />} />

          {/* Memória: 4 módulos com barra de luz virada para o vidro */}
          {[0, 1, 2, 3].map((i) => (
            <Box key={i} c="pc-ram" x={5 + i * 3.4} y={-25} z={-16.5} w={1.6} h={22} d={9} />
          ))}

          {/* Placa gráfica */}
          <Box c="pc-gpu" x={-6} y={10} z={-11} w={58} h={9} d={20} />

          {/* Cobertura da fonte, com o SSD à vista */}
          <Box c="pc-shroud" x={0} y={40} z={0} w={90} h={18} d={44} fz={<span className="pc-ssd" />} />

          {/* A caixa: vidro temperado (lado), frente em vidro canelado, topo com botão */}
          <Box
            c="pc-case"
            x={0} y={0} z={0} w={92} h={100} d={46}
            fz={<span className="pc-glass" />}
            fx={
              <span className="pc-front">
                {/* As 3 ventoinhas da frente, vistas através das ripas de vidro */}
                {["17%", "49%", "81%"].map((y) => (
                  <Fan key={y} y={y} />
                ))}
                {Array.from({ length: SLATS }, (_, i) => (
                  <span key={i} className="pc-slat" />
                ))}
              </span>
            }
            ft={<span className="pc-power" />}
          />

          {/* Etiquetas técnicas (coordenadas da caixa: x, y, z) */}
          <PcLabel text={t.draw.ram} x={5} y={-35} z={-12} lead={64} />
          <PcLabel text={t.draw.cpu} x={-14} y={-18} z={1} lead={42} />
          <PcLabel text={t.draw.gpu} x={-26} y={10} z={-1} lead={32} />
          <PcLabel text={t.draw.storage} x={-22} y={40} z={22} lead={22} />
          <PcLabel text={t.draw.fan} x={46} y={-1} z={0} lead={6} side="right" />
        </div>
      </div>
      <Cota label={t.draw.custom} />
    </div>
  );
}

export function Hero({ t, variant }: { t: Copy; variant: "pc" | "a" | "b" }) {
  const areas: [string, string][] = [
    ["#software", t.nav.software],
    ["#computadores", t.nav.computers],
    ["#formacao", t.nav.training],
  ];
  return (
    <section className={`hero hero--${variant}`} aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow hero__in" style={{ "--d": 0 } as Vars}>{t.since}</p>
        <h1 id="hero-title" className="hero__title">
          <span className="hero__in" style={{ "--d": 1 } as Vars}>IT Workshop</span>{" "}
          <span className="hero__in" style={{ "--d": 2 } as Vars}>
            &amp; <em>Maintenance</em>
          </span>
        </h1>
        <p className="hero__lead hero__in" style={{ "--d": 3 } as Vars}>{t.lead}</p>
        <div className="hero__actions hero__in" style={{ "--d": 4 } as Vars}>
          <a className="btn" href="#software">{t.cta.services}</a>
          <a className="link-quiet" href="#juntas">{t.cta.partners}</a>
        </div>
      </div>

      <div className="hero__visual">
        {variant === "b" ? <StackVisual t={t} /> : variant === "a" ? <FinsVisual t={t} /> : <PcVisual t={t} />}
      </div>

      <nav className="hero__areas hero__in" style={{ "--d": 5 } as Vars} aria-label={t.nav.areas}>
        <span className="hero__areas-label" aria-hidden>{t.nav.areas}</span>
        <ul>
          {areas.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
