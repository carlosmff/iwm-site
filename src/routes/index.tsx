import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IWM — Integrated Workforce Management" },
      { name: "description", content: "IWM: desde 2002, soluções para gestão de obras, manutenção e equipas de redes elétricas." },
      { property: "og:title", content: "IWM — Integrated Workforce Management" },
      { property: "og:description", content: "Desde 2002, soluções para gestão de obras, manutenção e equipas de redes elétricas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const timeline = [
  { year: "2002", title: "A origem", text: "Nasce da necessidade de controlar e gerir dados de obras e manutenção de redes elétricas, equipas de manutenção e avarias. As primeiras aplicações são desenvolvidas em Microsoft Access." },
  { year: "2000s", title: "Evolução para C#", text: "As aplicações amadurecem e são reescritas em C#, ganhando robustez, desempenho e capacidade para servir mais utilizadores." },
  { year: "2014", title: "iwm.pt", text: "É adquirido o domínio iwm.pt para dar impulso às aplicações em ambiente web, acessíveis em qualquer lugar." },
  { year: "Hoje", title: "Plataforma integrada", text: "O IWM abrange várias áreas de negócio, unindo operação, gestão e análise de dados num só ecossistema." },
];

const areas = [
  "Gestão de obras e manutenção",
  "Gestão de equipas",
  "Gestão de avarias",
  "Reclamações",
  "Gestão comercial",
  "Rede de Iluminação Pública",
  "Topografia e Projetos MT/AT",
  "Reports e análise de dados em Power BI",
];

const values = [
  { t: "Experiência de terreno", d: "Ferramentas pensadas para quem precisa de ter o controlo absoluto da gestão integrada das equipas." },
  { t: "Dados fiáveis", d: "Informação centralizada, rastreável e pronta para decisão." },
  { t: "Evolução contínua", d: "Mais de duas décadas a acompanhar a tecnologia e as necessidades reais." },
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
            Integrated Workforce Management
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Um projeto pessoal que se tornou plataforma: mais de vinte anos a construir soluções
            para gerir obras, equipas e redes elétricas — com rigor técnico e proximidade humana.
          </p>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display text-3xl md:text-4xl">A história</h2>
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
            <h2 className="font-display text-3xl md:text-4xl">Áreas de atuação</h2>
            <p className="mt-4 text-muted-foreground">
              O que começou na manutenção de redes elétricas expandiu-se para um ecossistema
              que cobre todo o ciclo operacional e de gestão.
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
            “O IWM nasceu para resolver problemas reais no terreno. Continua a crescer com o mesmo
            propósito: pôr a informação ao serviço de quem trabalha.”
          </blockquote>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <span>© 2002–{new Date().getFullYear()} IWM — Integrated Workforce Management</span>
          <span>iwm.pt</span>
        </div>
      </footer>
    </div>
  );
}
