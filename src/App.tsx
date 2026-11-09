import { useEffect, useState } from "react";
import { copy, type Lang } from "./i18n";
import { Hero } from "./hero";
import { Diagram } from "./diagram";

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
    </svg>
  );
}

/* theme-color e favicon desenhados a partir dos tokens do tema (nenhuma cor escrita à mão). */
function syncBrowserChrome() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;
  const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", `rgb(${r} ${g} ${b})`);

  ctx.clearRect(0, 0, 64, 64);
  ctx.fillStyle = token("--mood-dark");
  ctx.beginPath();
  ctx.roundRect(0, 0, 64, 64, 14);
  ctx.fill();
  ctx.fillStyle = token("--accent");
  ctx.beginPath();
  ctx.arc(32, 32, 13, 0, Math.PI * 2);
  ctx.fill();
  document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute("href", canvas.toDataURL());
}

/* Só em `npm run dev`: amostras das paletas definidas em theme.css (lidas do próprio CSS). */
function PaletteDock() {
  const [names, setNames] = useState<string[]>([]);
  const [current, setCurrent] = useState(() => document.documentElement.dataset.palette ?? "padrao");
  useEffect(() => {
    const found = [...document.styleSheets]
      .flatMap((sheet) => { try { return [...sheet.cssRules]; } catch { return []; } })
      .flatMap((rule) => [...((rule as CSSStyleRule).selectorText ?? "").matchAll(/\[data-palette="([^"]+)"\]/g)].map((m) => m[1]));
    setNames([...new Set(found)]);
  }, []);

  function pick(name: string) {
    const root = document.documentElement;
    const url = new URL(location.href);
    if (name === "padrao") { delete root.dataset.palette; url.searchParams.delete("palette"); }
    else { root.dataset.palette = name; url.searchParams.set("palette", name); }
    history.replaceState(null, "", url);
    setCurrent(name);
    syncBrowserChrome();
  }

  return (
    <div className="palette-dock" role="group" aria-label="Paletas (só em desenvolvimento)">
      <span className="palette-dock__name">{current}</span>
      {names.map((name) => (
        <button key={name} type="button" data-palette={name} className="swatch" aria-pressed={current === name} aria-label={name} title={name} onClick={() => pick(name)}>
          <span /><span /><span />
        </button>
      ))}
    </div>
  );
}

/* "Crianças — até aos 10 anos." → ["Crianças", "até aos 10 anos."] */
const splitAge = (s: string) => s.split(/\s+—\s+/);

/* "Tecnologia para todos. Autonomia em todas as idades." → duas frases */
const splitSentences = (s: string) => s.split(/(?<=\.)\s+/);

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("iwm-lang");
      if (saved === "pt" || saved === "en") return saved;
    } catch {}
    return navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
  });
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const t = copy[lang];
  const heroParam = new URLSearchParams(location.search).get("hero");
  const heroVariant = heroParam === "a" || heroParam === "b" ? heroParam : "pc";

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-PT" : "en";
    document.title = t.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.metaDesc);
  }, [lang, t]);

  useEffect(syncBrowserChrome, [dark]);

  function chooseLang(next: Lang) {
    setLang(next);
    try { localStorage.setItem("iwm-lang", next); } catch {}
  }

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    try { localStorage.setItem("iwm-theme", next ? "dark" : "light"); } catch {}
  }

  const [trA, trB] = splitSentences(t.trTitle);

  return (
    <>
      <a className="skip" href="#conteudo">{t.ui.skip}</a>

      <header className="site-header">
        <div className="container site-header__inner">
          <a href="#" className="logo" aria-label="IWM">
            IWM<span className="logo__dot" aria-hidden />
          </a>
          <div className="site-header__tools">
            <div role="group" aria-label={t.ui.language} className="segmented">
              {(["pt", "en"] as Lang[]).map((l) => (
                <button key={l} type="button" onClick={() => chooseLang(l)} aria-pressed={lang === l} lang={l}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? t.ui.toLight : t.ui.toDark}
              title={dark ? t.ui.toLight : t.ui.toDark}
              className="icon-btn"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <Hero t={t} variant={heroVariant} />

        {/* 1 · Software à medida: lista editorial */}
        <section id="software" className="section software" aria-labelledby="software-title">
          <div className="container">
            <header className="software__head">
              <h2 id="software-title" className="h-section">{t.swTitle}</h2>
              <p className="prose prose--lg">{t.swText}</p>
            </header>
            <ul className="sw-list">
              {t.swItems.map((s) => (
                <li key={s} className="sw-row">
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2 · Computadores: banda escura com o diagrama */}
        <section id="computadores" className="section band computers" aria-labelledby="pc-title">
          <div className="container computers__grid">
            <div className="computers__drawing">
              <Diagram t={t} />
            </div>
            <div className="computers__copy">
              <h2 id="pc-title" className="h-section h-section--sm">{t.pcTitle}</h2>
              <p className="prose prose--lg">{t.pcText}</p>
              <ul className="pc-list">
                {t.pcItems.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 3 · Formação */}
        <section id="formacao" className="section training" aria-labelledby="tr-title">
          <div className="container">
            <header className="training__head">
              <h2 id="tr-title" className="h-section">
                {trA} {trB && <em>{trB}</em>}
              </h2>
              <p className="prose prose--lg">{t.trIntro}</p>
            </header>

            <article className="tr-block autonomy" aria-labelledby="auto-title">
              <div className="autonomy__intro">
                <h3 id="auto-title" className="h-sub">{t.autoTitle}</h3>
                <p className="prose">{t.autoText}</p>
                <a className="callout" href="#juntas">{t.autoSub}</a>
              </div>
              <ul className="topic-list">
                {t.autoItems.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </article>

            <article className="tr-block safety" aria-labelledby="safe-title">
              <div className="safety__head">
                <h3 id="safe-title" className="h-sub">{t.safeTitle}</h3>
                <p className="prose">{t.safeText}</p>
              </div>
              <p className="label">{t.safeSub}</p>
              <ol className="ages">
                {t.ages.map((a) => {
                  const [name, range] = splitAge(a);
                  return (
                    <li key={a} className="age">
                      <span className="age__name">{name}</span>
                      <span className="age__range">{range}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="badge">{t.safeNote}</p>
            </article>

            <article className="tr-block ai" aria-labelledby="ai-title">
              <div className="ai__head">
                <h3 id="ai-title" className="h-sub">{t.aiTitle}</h3>
                <p className="badge">{t.aiNote}</p>
              </div>
              <div className="ai__body">
                <p className="ai__lead">{t.aiText1}</p>
                <p className="prose">{t.aiText2}</p>
              </div>
            </article>
          </div>
        </section>

        {/* 4 · CTA para Juntas, associações e IPSS */}
        <section id="juntas" className="section band partners" aria-labelledby="cta-title">
          <div className="partners__light" aria-hidden />
          <div className="container partners__grid">
            <h2 id="cta-title" className="partners__title">{t.ctaTitle}</h2>
            <p className="partners__q">{t.juntasQ}</p>
            <div className="partners__body">
              <p className="prose">{t.ctaText}</p>
              <p className="status">
                <span className="led" aria-hidden />
                {t.juntasEnd}
              </p>
            </div>
          </div>
        </section>

        {/* 5 · Citação */}
        <section className="section quote">
          <div className="container">
            <blockquote className="quote__text">
              <p>{t.quote}</p>
            </blockquote>
          </div>
        </section>

        {/* 6 · Um novo espaço */}
        <section id="em-breve" className="soon" aria-labelledby="soon-title">
          <div className="container">
            <div className="soon__panel">
              <span className="led led--lg" aria-hidden />
              <h2 id="soon-title" className="soon__title">{t.soonTitle}</h2>
              <p className="prose">{t.soonText}</p>
            </div>
          </div>
        </section>
      </main>

      {import.meta.env.DEV && <PaletteDock />}

      <footer className="site-footer band">
        <div className="container site-footer__inner">
          <span>© 2002–{new Date().getFullYear()} IWM, IT Workshop &amp; Maintenance</span>
          <span>Viseu, Portugal. iwm.pt</span>
        </div>
      </footer>
    </>
  );
}
