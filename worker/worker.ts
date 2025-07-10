import { buildConfig } from "./config";

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Only handle /png route
    if (!url.pathname.startsWith("/png")) {
      return new Response("Not found", { status: 404 });
    }

    const params: Record<string, string | undefined> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const { chartConfig, width, height } = buildConfig(params);

    const qcUrl =
      "https://quickchart.io/chart" +
      `?c=${encodeURIComponent(JSON.stringify(chartConfig))}` +
      `&w=${width}&h=${height}&bkg=transparent`;

    // Option A: redirect client to QuickChart (simplest, supports caching on QC side)
    return Response.redirect(qcUrl, 302);
  },
}; 