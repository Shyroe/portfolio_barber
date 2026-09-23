# Gentleman Barber — Landing Page

Desafio técnico frontend voltado ao desenvolvimento de uma landing page production-grade a partir de um **design no pen.dev**, com foco em **fidelidade pixel-perfect, responsividade contínua, acessibilidade, performance e engenharia de frontend**.

O projeto combina um acabamento visual de alto nível com uma arquitetura moderna em **Next.js (App Router)** entregue como **export estático** no Cloudflare Workers: sem servidor de aplicação, sem otimizador de imagem em runtime e **zero requisição a domínio de terceiro no carregamento**.

## Demonstração

- Produção: https://barber.leonardocamargo.dev.br/

## O desafio

A implementação foi conduzida como um problema real de engenharia frontend, com objetivos simultâneos de qualidade visual e técnica:

- implementar as **11 seções** do design na ordem da narrativa (promessa → mecanismo → prova → objeção → oferta);
- reproduzir **dois frames** de design (desktop 1366×9452 e mobile 390×15023) sem "aproximação por olhômetro";
- manter comportamento consistente de **320px a 2560px**, incluindo tablet, a faixa entre `lg` e a largura do frame e ultrawide;
- garantir tipografia, grids, proporções, crops e espaçamentos corretos em cada breakpoint;
- servir **fontes, imagens e ícones localmente**, sem CDN, sem Google Fonts em runtime e sem scripts de terceiros;
- garantir navegação por teclado, semântica adequada e contraste compatível com **WCAG 2.1 AA**;
- reduzir o custo do carregamento inicial sem comprometer o visual nem o comportamento;
- criar testes automatizados capazes de detectar regressão de layout, responsividade, interação e acessibilidade.

## Decisões de engenharia

### Fidelidade ao design — medida, não estimada

- o design de origem é um arquivo **pen.dev** versionado no repositório; o ciclo de trabalho é **medir → implementar → comparar**, com scripts que extraem geometria, tipografia e assets das camadas do arquivo;
- cada seção é comparada com o **render do design** por diferença de imagem (RMSE) nos dois viewports, e o restante é atribuído a rasterização de texto sobre foto, não a erro de layout;
- a soma das 11 seções fecha o frame: **9452,23px contra 9452px** no desktop (+0,23px) e **15023,13px contra 15023px** no mobile (+0,13px).

### Renderização e performance

- **export estático** (`output: "export"`) publicado como assets do Cloudflare Workers: sem compute, sem cold start;
- cada bitmap é um **derivado pré-gerado** por um pipeline de imagens próprio (ImageMagick), com AVIF onde há ganho real e WebP de fallback;
- **preloads casados por breakpoint** para os recursos que participam do LCP — inclusive o `<picture>`, que sai do preload automático do framework e passa a ser explícito;
- **fontes subsetadas** para os caracteres que a página usa, com apenas a fonte de display pré-carregada;
- animação de entrada em CSS com o estado oculto sob `html.js`, para que uma falha de JavaScript não esconda conteúdo;
- **nenhum domínio de terceiro no carregamento**: o embed do YouTube só é criado no clique (fachada de vídeo);
- medido no PageSpeed Insights oficial (5 execuções espaçadas por form factor, no artefato publicado): **desktop 100** de mediana (LCP 0,7s, CLS 0) e **mobile 90** de mediana (notas 89-94, LCP entre 2,9s e 3,2s, CLS 0). O LCP **observado** sem throttling é 332ms; o que o PSI publica é o valor simulado pelo modelo sob CPU 4x, limitado pelo parse do HTML — o teto prático do App Router com este volume de conteúdo.

### Acessibilidade

- `pnpm run audit:a11y` roda Axe sem violações;
- skip link, foco visível em todos os elementos interativos, landmarks e hierarquia de títulos verificados em teste;
- listas em `flex`/`grid` recebem `role="list"` explícito, porque o Safari descarta o papel implícito quando o `list-style` é removido;
- `prefers-reduced-motion` desliga a animação de entrada;
- o conteúdo permanece legível e navegável **sem JavaScript**.

### Qualidade e regressão

- testes de componente com **Vitest** e **React Testing Library**;
- suíte **E2E** com Playwright cobrindo contrato do documento, âncoras, caminhos de conversão, ausência de overflow horizontal em **sete viewports** (320/390/768/1024/1100/1440/2560) e o funcionamento sem JavaScript;
- auditoria de acessibilidade com **Axe** integrada à suíte;
- execução cross-browser opcional em **Firefox e WebKit**;
- validação contínua com TypeScript, Biome, testes e build.

## Stack

- Next.js 16 (App Router) e React 19
- TypeScript
- Tailwind CSS v4 (tokens via `@theme`, sem arquivo de configuração)
- shadcn/ui e Radix UI
- Embla Carousel
- Vitest e React Testing Library
- Playwright Test e Axe
- Biome
- Cloudflare Workers e Wrangler

## Estrutura

```text
src/
├── app/                     # documento, metadata, robots, sitemap
├── components/ui/           # primitivas shadcn
├── config/site.ts           # identidade e CTAs (fonte única)
├── features/landing-page/
│   ├── components/          # ilhas de cliente (vídeo, carrossel, FAQ, reveal)
│   ├── sections/            # uma seção do design por arquivo
│   └── landing-page.tsx     # composição e ordem da página
└── styles/                  # tokens, fontes e comportamentos globais

scripts/build/               # servidor estático e pipeline de derivados de imagem
e2e/                         # contrato, responsividade, conversão e acessibilidade
```

## Executar localmente

Requisitos: Node.js 24+, pnpm 11+ e ImageMagick (apenas para regenerar derivados de imagem).

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

A aplicação fica disponível em `http://127.0.0.1:3000`.

## Validação

```bash
pnpm run typecheck
pnpm run test:run
pnpm run check:biome
pnpm run validate
```

Como o projeto é um export estático, não existe `next start`:

```bash
pnpm run build        # gera out/
pnpm run start        # serve out/ como o Worker serve
pnpm run test:e2e     # builda e roda a suíte no servidor estático
pnpm run audit:a11y
```

O workflow público executa os gates principais em Pull Requests e pushes na branch principal.

## Deploy

```bash
pnpm run cf:dry-run
pnpm run deploy
```

Credenciais e secrets ficam fora do repositório, em um ambiente local autenticado.

## Sobre conteúdo e ativos

O código é de autoria própria e está sob a licença MIT. Marcas, fotografias e materiais do produto pertencem aos seus titulares e aparecem aqui apenas como parte deste desafio técnico independente — os detalhes estão em [`NOTICE.md`](NOTICE.md).
