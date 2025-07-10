import Chart from "chart.js/auto";

/* Simple URL param parsing */
function getParams() {
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    out[key] = value;
  }
  return out;
}

function drawProgressBar(value: number, steps: number = 100, color: string = "#4ade80", labelText?: string, showLabel: boolean = true, labelColor: string = "#000") {
  const canvas = document.getElementById("chart") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("<canvas id=\"chart\"> not found");
    return;
  }
  const labelEl = document.getElementById("label") as HTMLDivElement | null;
  if (labelEl) {
    labelEl.style.setProperty("--label-color", labelColor);
    labelEl.textContent = showLabel ? labelText ?? "" : "";
  }

  // Destroy any existing chart instance bound to this canvas
  // @ts-ignore - Chart.getChart is a helper in v4
  const existing = Chart.getChart(canvas);
  if (existing) existing.destroy();

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: [""],
      datasets: [
        {
          data: [value],
          backgroundColor: color,
          borderRadius: 4,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          min: 0,
          max: steps,
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
  });
}

function main() {
  const params = getParams();
  const chartType = params["progressbar"] !== undefined || params["chart"] === "progressbar" ? "progressbar" : "unsupported";

  if (chartType === "progressbar") {
    const value = Number(params["value"] ?? params["v"] ?? 50);
    const steps = Number(params["steps"] ?? params["total"] ?? 100);
    const color = params["color"] ?? "#4ade80";
    const showLabel = params["showLabel"] !== "false";
    const defaultLabel = `${Math.round((value / steps) * 100)}%`;
    const labelText = params["label"] ?? defaultLabel;
    const labelColor = params["labelColor"] ?? "#000";

    // Optional explicit height param (px)
    const container = document.getElementById("container") as HTMLDivElement | null;
    if (container && params["height"]) {
      container.style.height = `${Number(params["height"])}px`;
    }

    drawProgressBar(value, steps, color, labelText, showLabel, labelColor);
  } else {
    document.body.innerHTML = `<p style="font-family:sans-serif;padding:1rem">Unsupported chart type</p>`;
  }
}

main(); 