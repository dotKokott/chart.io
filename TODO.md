# chart.io – Roadmap / TODO

## Overview
chart.io is a lightweight, static-site tool that turns a specially crafted URL into an embeddable chart (initially a progress bar).  Everything runs client-side so the app can be deployed to GitHub Pages or any CDN.  Later we’ll add a PNG export route via a serverless function.  The codebase is Bun + TypeScript with Vite bundling and Chart.js for rendering.

Legend:
[ ] pending  [x] done  [>] in progress

## 0. Foundations
- [x] Initialize Bun + TypeScript project (package.json, tsconfig, bun.lock)

## 1. Developer Experience
- [x] Install Chart.js + @types/chart.js
- [x] Add script: `bun run dev` to serve `src/index.html` with hot reload
- [x] Add script: `bun run build` to produce `/dist` assets
- [ ] Configure tsconfig paths / bundler alias if needed

## 2. Core Runtime (iframe)
- [x] Basic HTML shell (`index.html`) that calls `dist/index.js`
- [x] Parse query string (`?progressbar&value=5&steps=10…`)
- [x] Dispatch to chart-specific renderers
- [x] Implement `progressbar` renderer via Chart.js horizontal bar
- [x] Error / empty-state component

## 3. Styling & Theming
- [x] Support `color`, `label`, `showLabel`, `labelColor`, `height` params
- [ ] Responsive sizing (width/height from iframe or params)
- [x] Default slick bar (50% with label) when no params provided
- [ ] CSS reset / minimal theme

## 4. Eval Playground
- [x] `eval.html` that embeds many charts for quick visual QA
- [x] Auto-reload when source changes (live-server / bun reload)

## 5. Build & Deployment
- [x] Static build to `/dist`
- [x] GitHub Actions: build & push to `gh-pages`
- [ ] CDN-friendly cache headers via `.nojekyll` if needed

## 6. PNG Endpoint (post-MVP)
- [x] Implement `/png/...` route via Cloudflare Worker redirect to QuickChart
- [ ] Caching (keyed by URL hash)

### 6B. First-party PNG rendering via Cloudflare Browser Rendering (Puppeteer)
> Goal: Use headless Chromium inside a Cloudflare Browser Rendering Worker so the **exact same Chart.js code** renders to a PNG. No more visual drift.

- [ ] Research Browser Rendering limits & pricing (1000 free renders/day)  
  ↳ docs: https://developers.cloudflare.com/browser-rendering/
- [ ] Create new Worker project (`png-render-worker`) with Puppeteer binding
- [ ] Share `buildConfig()` from `worker/config.ts` to create an HTML page string that imports Chart.js and renders — no DOM library needed
- [ ] Implement Worker logic:
  1. Parse query params → ChartConfig
  2. Launch browser via `puppeteer.launch(env.MYBROWSER)`
  3. `page.setContent()` with minimal HTML+canvas, inject script that calls `new Chart()`
  4. Wait for Chart to finish (`page.waitForFunction('window.renderDone')`)
  5. `page.screenshot({ type: 'png', omitBackground: true })`
  6. Cache in KV (key = full URL) for 24h
  7. Return PNG (`Content-Type: image/png`)
- [ ] Add Wrangler KV namespace (prod + preview) and bindings in `wrangler.toml`
- [ ] Local dev & test (`wrangler dev --remote`)
- [ ] Update GitHub Actions workflow to auto-deploy Browser Rendering Worker (needs CF API token)
- [ ] Remove QuickChart redirect code once parity confirmed
- [ ] Update README with new PNG flow & free-tier limits

## 8. Code Sharing
- [x] Extract shared `ChartParams` interface to `shared/chartParams.ts` so both browser and Worker use the same definition

## 7. Documentation
- [ ] Update `README.md` with usage, embed snippet, parameters table
- [ ] Add contribution guide 