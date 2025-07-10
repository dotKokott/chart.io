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
- [ ] GitHub Actions: build & push to `gh-pages`
- [ ] CDN-friendly cache headers via `.nojekyll` if needed

## 6. PNG Endpoint (post-MVP)
- [ ] Spike: render chart to PNG using `@jsdom` + Chart.js, or headless Chromium/Puppeteer
- [ ] `/png/...` route (could be Edge Function / Cloudflare Worker)
- [ ] Caching (keyed by URL hash)

## 7. Documentation
- [ ] Update `README.md` with usage, embed snippet, parameters table
- [ ] Add contribution guide 