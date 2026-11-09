# IWM — IT Workshop & Maintenance

Landing page estática (Vite + React + Tailwind v4), em português e inglês, com tema claro e escuro.

## Ver no computador
    npm install
    npm run dev

## Gerar os ficheiros para publicar
    npm run build

Cria a pasta `dist/`: são ficheiros estáticos, que funcionam em qualquer alojamento estático.

## Textos
Todo o texto (PT e EN) está em `src/i18n.ts`.

## Como mudar as cores
Todas as cores do site vivem num único ficheiro: **`src/theme.css`**. Para mudar a paleta inteira, altera só estas 3 variáveis no topo:

```css
:root {
  --mood-light: #DBF2FC; /* ambiente claro (~60%): fundos, hero, secções claras */
  --mood-dark:  #072D59; /* ambiente escuro (~30%): texto, secções escuras, modo escuro */
  --accent:     #FD6E88; /* o "pop" (~10%): botão principal, luz do hero, foco */
}
```

Tudo o resto é derivado delas com `color-mix()` e `oklch(from …)`: os tons intermédios, o texto secundário, as bordas, o `--accent-ink` (versão escura do acento para texto sobre fundo claro), o modo escuro, o visual do hero, o diagrama e até a `theme-color` do browser.

**Presets prontos a testar.** No mesmo ficheiro há 10 paletas alternativas: `grafite-rosa`, `placa-mae`, `teal-ambar`, `oficina`, `dao`, `ardosia-lima`, `oceano-sol`, `papel-vermelho`, `menta-coral` e `noite-ciano`.
- **Em `npm run dev`** aparece em baixo uma barra com uma amostra por paleta: clica para trocar o site inteiro em tempo real. A barra lê as paletas do `theme.css` (um preset novo aparece sozinho) e não entra no build de produção.
- Sem clicar: abre o site com `?palette=…` no endereço (ex.: `http://localhost:5173/?palette=oceano-sol`).
- Para ativar de vez: em `index.html`, acrescenta o atributo `data-palette` à tag `<html>`, por exemplo `<html lang="pt-PT" data-palette="oficina">`.
- Para criar uma paleta nova: copia uma linha `[data-palette="…"] { … }` em `theme.css`, dá-lhe um nome e muda as 3 cores; depois corre o check de contraste.
- Também há `?theme=dark` / `?theme=light`, e `?hero=a` / `?hero=b` para os conceitos antigos do hero (o PC é o hero por defeito).

**Verificar o contraste.** Depois de mudar cores, corre:

    npm run check:contrast

O script abre o site num browser, resolve os tokens em cada preset e em cada modo (claro/escuro), e calcula os rácios WCAG dos pares principais (texto, texto secundário, botão principal, `--accent-ink`, anel de foco, secções escuras). Avisa e termina com erro se algum par ficar abaixo de AA.

Regras de uso do acento: nunca é texto pequeno sobre fundo claro (usa-se `--accent-ink`), e o texto do botão de acento é a cor escura (`--cta-text`), não branco.

## Screenshots
    npm run screenshots

Gera capturas do hero e da página inteira (mobile, tablet, desktop, wide; claro e escuro; cada preset) em `screenshots/`.

## Formulário de contacto
Foi removido por agora. Será acrescentado quando a oficina abrir.
