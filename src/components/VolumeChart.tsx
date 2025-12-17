import { useEffect, useRef } from "react";
import { getOrdersSummary } from "../service/order.service";
import { createChart } from "lightweight-charts";

const colors: Record<string, string> = {
  cancelled: "#FF3D00",
  total_orders: "#FFB300",
  completed: "#4CAF50",
  processing: "#2196F3",
  delivered: "#51ff77ff",
};

export function VolumeChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = (chartRef.current = createChart(containerRef.current, {
      width: 600,
      height: 300,
      layout: { background: { type: "solid", color: "#040404ff" }, textColor: "#ffffff" },
    }));

    Object.entries(colors).forEach(([key, color]) => {
      seriesRefs.current[key] = chart.addLineSeries({ color, lineWidth: 2 });
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    async function loadData() {
      try {
        const summary = await getOrdersSummary();
        const now = Math.floor(Date.now() / 1000);
        const keysToShow = ["processing", "cancelled", "completed", "total_orders",'delivered'];

        keysToShow.forEach((key) => {
          const value = summary[key as keyof typeof summary] as number || 0;
          seriesRefs.current[key].setData([
            { time: now - 60, value },
            { time: now, value },
          ]);
        });

        const volumeData = keysToShow.map((key, index) => ({
          time: now - 60 * (keysToShow.length - index),
          value: summary[key as keyof typeof summary] as number || 0,
          color: colors[key],
        }));
        volumeSeries.setData(volumeData);

      } catch (err) {
        console.error("Error loading summary:", err);
      }
    }

    loadData();

    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  return <div ref={containerRef} />;
}
