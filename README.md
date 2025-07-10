# chart.io

Turn a URL into a beautiful embeddable chart.  Client-side only, built with Bun + TypeScript + Vite + Chart.js, easily deployed to GitHub Pages.

---

## Quick embed

```html
<iframe
  src="https://your-domain/chart.io/index.html?value=75&color=%23f97316&label=Downloads"
  width="300"
  height="40"
  frameborder="0"
  scrolling="no"
></iframe>
```

Open the URL directly in a browser to preview the chart.

## URL parameters (progress bar)
| Param        | Default | Description |
|--------------|---------|-------------|
| `value`      | `50`    | Current progress (numerator). |
| `steps`/`total` | `100` | Maximum value (denominator). |
| `color`      | `#4ade80` | Bar fill color (hex/CSS). |
| `label`      | auto-calculated `value/steps%` | Text shown in the bar center. |
| `showLabel`  | `true`  | Set to `false` to hide the label. |
| `labelColor` | `#000`  | Text color. |
| `height`     | *iframe height* | Force bar height internally (px) if you can’t set the iframe height. |
| `chart`      | `progressbar` | Chart type; currently only progress bars are implemented. |

Alias `v` for `value` is also accepted.

## Development
```bash
bun install            # install deps
bun run dev            # launches Vite dev server (hot reload)
# open http://localhost:5173/index.html?value=30&color=%23ef4444

bun run build          # production build → dist/
 bun run preview        # serve dist/ for final testing
```

### Eval playground
`eval.html` renders several iframes so you can visually test multiple parameter combinations at once. It reloads automatically while you work.

## Deployment (GitHub Pages)
A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the project and publishes `dist/` to the `gh-pages` branch on every push to `main`.

### One-time repo setup
1. Ensure **GitHub Pages** is configured to serve the `gh-pages` branch (Settings → Pages).  
2. If your repo is named *chart.io* (e.g. `username/chart.io`) the workflow & Vite `base` path are already correct. For a different repo name, update `base` in `vite.config.ts`.

That’s it—merge to `main` and your charts are live!

---

Made with ❤️ and Bun.
