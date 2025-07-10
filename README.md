# chart.io

Turn a URL into a beautiful embeddable chart.  Client-side only, built with Bun + TypeScript + Vite + Chart.js, easily deployed to GitHub Pages.

---

## Quick embed

```html
<iframe
  src="https://dotkokott.github.io/chart.io/index.html?value=75&color=%23f97316&label=Downloads"
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
| `label`      | auto (`{percent}`) | Custom text; supports `{value}`, `{steps}`, `{percent}` tokens. |
| `showLabel`  | `true`  | Set to `false` to hide the label. |
| `labelColor` | `#000`  | Text color. |
| `height`     | *iframe height* | Force bar height internally (px) if you can’t set the iframe height. |
| `chart`      | *(optional)* | Explicit chart type; omit for progress bars. |

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

## PNG endpoint (for static images)

Need a chart image for Slack, GitHub, Jira etc.? Use the Cloudflare Worker located in `worker/` which turns the same query‐string into a PNG via QuickChart.

### Local development

```bash
# one-time (if you didn’t install globally)
npx wrangler login           # opens browser to authorise Cloudflare account

# run the Worker locally (port 8787)
bun run dev:png
# open http://localhost:8787/png/?value=60&steps=100&label={value}/{steps}
```

### Deploy to Cloudflare (free)

```bash
# first deploy – chooses a workers.dev subdomain automatically
bun run deploy:png

# output → https://chartio-png.<your-id>.workers.dev
```

You can later map a custom route to a domain you control in the Cloudflare dashboard.

### Example embed

```md
![progress](https://chartio-png.<your-id>.workers.dev/png/?value=5&steps=10&label={value}/{steps}%20downloads)
```

How it works:
1. Worker parses the query params using the shared `ChartParams` interface.
2. Builds a Chart.js config identical to the iframe version.
3. Responds with a 302 redirect to QuickChart.io which returns the cached PNG.

Because the Worker is tiny and QuickChart handles the heavy lifting, this stays well within Cloudflare’s free tier (100k requests/day).

---

Made with ❤️ and Bun.
