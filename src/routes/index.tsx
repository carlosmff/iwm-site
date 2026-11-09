import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IWM — IT Workshop & Maintenance" },
      { name: "description", content: "IWM: um espaço pessoal dedicado à tecnologia — desenvolvimento, manutenção informática e formação." },
      { property: "og:title", content: "IWM — IT Workshop & Maintenance" },
      { property: "og:description", content: "Um espaço pessoal dedicado à tecnologia — desenvolvimento, manutenção informática e formação." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const timeline = [
  { year: "2002", title: "O início", text: "Começa como um projeto pessoal, movido pela vontade de organizar informação e simplificar tarefas do dia a dia." },
  { year: "2000s", title: "Maturidade", text: "As primeiras ideias ganham forma em aplicações mais sólidas, escritas e reescritas com o que se ia aprendendo." },
  { year: "2014", title: "iwm.pt", text: "O domínio iwm.pt passa a ser a casa de todos os projetos, num só endereço." },
  { year: "Hoje", title: "Oficina aberta", text: "Continua a ser um espaço de experimentação: construir, reparar, aprender e partilhar." },
];

const areas = [
  "Desenvolvimento de aplicações",
  "Automação de processos",
  "Dados e reporting",
  "Manutenção informática",
  "Reparação de computadores",
  "Formação profissional",
];

const values = [
  { t: "Mão na massa", d: "Soluções feitas para resolver problemas concretos, sem complicar o que pode ser simples." },
  { t: "Clareza", d: "Tecnologia explicada e aplicada de forma direta, com resultados que se veem." },
  { t: "Aprendizagem contínua", d: "Mais de duas décadas a acompanhar a tecnologia e a partilhar o que se aprende." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl tracking-tight">
          IWM<span className="text-primary">.</span>
        </span>
        <span className="text-sm text-muted-foreground">iwm.pt</span>
      </header>

      <section className="relative overflow-hidden">
        <div className="grid-lines absolute inset-0 opacity-40" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pt-32">
          <p className="mb-6 text-sm uppercase tracking-[0.3em] text-primary">Desde 2002</p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] md:text-7xl">
            IT Workshop <span className="text-primary">&amp;</span> Maintenance
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Uma oficina de tecnologia: um projeto pessoal, sem fins comerciais, onde se constroem
            aplicações, se cuidam sistemas e se partilha conhecimento.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display text-3xl md:text-4xl">Percurso</h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {timeline.map((s) => (
              <li key={s.year} className="bg-card p-8">
                <div className="font-display text-4xl text-primary">{s.year}</div>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">O que se faz aqui</h2>
            <p className="mt-4 text-muted-foreground">
              Do código ao hardware: tudo o que envolve pôr a tecnologia a funcionar bem.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3 text-sm">
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-10 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.t}>
                <div className="mb-4 h-px w-12 bg-primary" />
                <h3 className="font-display text-xl">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
          <blockquote className="font-display mx-auto mt-24 max-w-3xl text-center text-2xl leading-snug md:text-3xl">
            “Uma oficina não se define pelo que produz, mas pelo que ensina a quem lá entra.”
          </blockquote>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <span>© 2002–{new Date().getFullYear()} IWM — IT Workshop &amp; Maintenance</span>
          <span>iwm.pt</span>
        </div>
      </footer>
    </div>
  );
}
