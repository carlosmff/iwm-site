// Verifica o contraste WCAG dos pares texto/fundo principais, para cada preset e cada modo.
// O browser resolve os tokens (color-mix, oklch from …) exatamente como no site; nada é duplicado aqui.
// Uso: npm run check:contrast
import { createServer } from "vite";
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

// Os presets são lidos do próprio ficheiro de tema: um preset novo entra aqui sozinho.
const theme = await readFile("src/theme.css", "utf8");
const PALETTES = ["default", ...new Set([...theme.matchAll(/\[data-palette="([^"]+)"\]/g)].map((m) => m[1]).filter((p) => p !== "padrao"))];
const MODES = ["light", "dark"];

// [primeiro plano, fundo, mínimo AA, descrição, dentro de .band (secção escura)?]
const PAIRS = [
  ["--text", "--bg", 4.5, "texto"],
  ["--text-muted", "--bg", 4.5, "texto secundário"],
  ["--text-muted", "--bg-sunken", 4.5, "texto secundário / fundo afundado"],
  ["--text-muted", "--bg-raised", 4.5, "texto secundário / painel"],
  ["--accent-ink", "--bg", 4.5, "accent-ink (links/destaques)"],
  ["--cta-text", "--cta-bg", 4.5, "botão principal"],
  ["--focus-ring", "--bg", 3, "anel de foco"],
  ["--text", "--bg", 4.5, "texto (secção escura)", true],
  ["--text-muted", "--bg", 4.5, "texto secundário (secção escura)", true],
  ["--accent-ink", "--bg", 4.5, "accent-ink (secção escura)", true],
  ["--focus-ring", "--bg", 3, "anel de foco (secção escura)", true],
];

const server = await createServer({ logLevel: "silent", server: { port: 4318 } });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(server.resolvedUrls.local[0]);
await page.waitForSelector(".hero");

let failures = 0;
for (const palette of PALETTES) {
  for (const mode of MODES) {
    const rows = await page.evaluate(({ palette, mode, pairs }) => {
      const root = document.documentElement;
      if (palette === "default") delete root.dataset.palette;
      else root.dataset.palette = palette;
      root.classList.toggle("dark", mode === "dark");

      const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const toRgb = (css) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
      };
      const resolve = (scope, token) => {
        const probe = document.createElement("i");
        probe.style.color = `var(${token})`;
        scope.append(probe);
        const c = getComputedStyle(probe).color;
        probe.remove();
        return toRgb(c);
      };
      const lum = (rgb) =>
        rgb
          .map((v) => v / 255)
          .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
      const ratio = (a, b) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
        return (hi + 0.05) / (lo + 0.05);
      };

      const band = document.createElement("div");
      band.className = "band";
      document.body.append(band);
      const out = pairs.map(([fg, bg, min, label, inBand]) => {
        const scope = inBand ? band : document.body;
        const r = ratio(resolve(scope, fg), resolve(scope, bg));
        return { label, ratio: r, min, ok: r >= min };
      });
      band.remove();
      return out;
    }, { palette, mode, pairs: PAIRS });

    const bad = rows.filter((r) => !r.ok);
    failures += bad.length;
    console.log(`\n${bad.length ? "✗" : "✓"} ${palette} · ${mode}`);
    for (const r of rows) {
      console.log(`   ${r.ok ? " " : "!"} ${r.ratio.toFixed(2).padStart(5)} : 1  (mín. ${r.min})  ${r.label}`);
    }
  }
}

await browser.close();
await server.close();
console.log(failures ? `\n${failures} par(es) abaixo de AA.` : "\nTodos os pares passam AA.");
process.exit(failures ? 1 : 0);
