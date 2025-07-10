import puppeteer from "@cloudflare/puppeteer";
import { buildConfig } from "./config";
import type { ChartParams } from "../shared/chartParams";

interface Env {
  MYBROWSER: any;
  PNG_CACHE?: any;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/png")) {
      return new Response("Not found", { status: 404 });
    }

    // cache key is full url (path + query)
    const cacheKey = url.pathname + url.search;
    if (env.PNG_CACHE) {
      const cached = await env.PNG_CACHE.get(cacheKey, { type: "arrayBuffer" });
      if (cached) {
        return new Response(cached, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=86400, immutable",
          },
        });
      }
    }

    // parse params
    const params: Partial<ChartParams> = {};
    url.searchParams.forEach((v, k) => ((params as any)[k] = v));

    const { chartConfig, width, height } = buildConfig(params);

    // create HTML string
    const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><script src='https://cdn.jsdelivr.net/npm/chart.js'></script></head><body><canvas id='c' width='${width}' height='${height}'></canvas><script>const ctx=document.getElementById('c');const config=${JSON.stringify(
      chartConfig
    )};new Chart(ctx,config);window.renderDone=true;</script></body></html>`;

    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.setContent(html, { waitUntil: "load" });
    // wait for renderDone flag
    await page.waitForFunction("window.renderDone === true");
    const pngBuffer = await page.screenshot({ type: "png", omitBackground: true });
    await browser.close();

    if (env.PNG_CACHE) {
      await env.PNG_CACHE.put(cacheKey, pngBuffer, { expirationTtl: 60 * 60 * 24 });
    }

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  },
}; 