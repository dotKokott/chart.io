import type { ChartParams } from "../shared/chartParams";

export interface BuildResult {
  chartConfig: Record<string, unknown>;
  width: number;
  height: number;
}

export function buildConfig(params: Partial<ChartParams>): BuildResult {
  // Parse numbers with defaults
  const value = Number(params.value ?? params.v ?? 50);
  const steps = Number(params.steps ?? params.total ?? 100);
  const color = params.color ?? "#4ade80";

  // Label processing
  const percent = Math.round((value / steps) * 100);
  const showLabel = params.showLabel !== "false";
  let labelText = params.label ?? "{percent}";
  labelText = labelText
    .replace(/\{value\}|\{v\}/gi, String(value))
    .replace(/\{steps\}|\{total\}/gi, String(steps))
    .replace(/\{percent\}/gi, `${percent}%`);
  const labelColor = params.labelColor ?? "#000";

  // Build QuickChart "progressBar" chart configuration for a cleaner output
  const percentValue = Math.round((value / steps) * 100);
  const chartConfig = {
    type: "progressBar",
    data: {
      datasets: [
        {
          data: [percentValue],
          backgroundColor: color,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          display: showLabel,
          color: labelColor,
          formatter: () => labelText,
        },
      },
    },
  };

  const width = Number(params.width ?? 300);
  const height = Number(params.height ?? 60);

  return { chartConfig, width, height };
} 