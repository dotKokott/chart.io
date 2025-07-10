import { buildConfig } from "./config";
import type { ChartParams } from "../shared/chartParams";

export default {
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    // Only handle /png route
    if (!url.pathname.startsWith("/png")) {
      return new Response("Not found", { status: 404 });
    }

    const params: Partial<ChartParams> = {};
    url.searchParams.forEach((value, key) => {
      (params as any)[key] = value;
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