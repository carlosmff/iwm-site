// Screenshots do site (hero e página inteira), em mobile/desktop, claro/escuro e por preset.
// Uso: npm run build && node scripts/screenshots.mjs [filtro]
//      ex.: node scripts/screenshots.mjs hero-a-desktop
import { preview } from "vite";
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";

const filter = process.argv[2] ?? "";
const OUT = "screenshots";
// Os presets são lidos do próprio ficheiro de tema: um preset novo entra aqui sozinho.
const theme = await readFile("src/theme.css", "utf8");
const PRESETS = [...new Set([...theme.matchAll(/\[data-palette="([^"]+)"\]/g)].map((m) => m[1]))].filter((p) => p !== "padrao");
const VIEWPORTS = { mobile: [375, 812], tablet: [768, 1024], desktop: [1280, 800], wide: [1920, 1080] };

const jobs = [];
for (const hero of ["pc", "a", "b"]) {
  for (const theme of ["light", "dark"]) {
    for (const [vp, size] of Object.entries(VIEWPORTS)) {
      jobs.push({ name: `hero-${hero}-${vp}-${theme}`, hero, theme, size, full: false });
    }
    for (const vp of ["mobile", "desktop"]) {
      jobs.push({ name: `page-${hero}-${vp}-${theme}`, hero, theme, size: VIEWPORTS[vp], full: true });
    }
    for (const palette of hero === "pc" ? PRESETS : []) {
      jobs.push({ name: `preset-${palette}-hero-${hero}-${theme}`, hero, theme, palette, size: VIEWPORTS.desktop, full: false });
    }
  }
}

await mkdir(OUT, { recursive: true });
const server = await preview({ preview: { port: 4317 }, logLevel: "silent" });
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch();

for (const job of jobs.filter((j) => j.name.includes(filter))) {
  const page = await browser.newPage({ viewport: { width: job.size[0], height: job.size[1] }, deviceScaleFactor: 2, reducedMotion: "reduce", locale: "pt-PT" });
  const q = new URLSearchParams({ hero: job.hero, theme: job.theme, ...(job.palette && { palette: job.palette }) });
  await page.goto(`${base}?${q}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${job.name}.png`, fullPage: job.full });
  await page.close();
  console.log("✓", job.name);
}

await browser.close();
server.httpServer.close();
