import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { getOrdersSummary } from "../service/order.service";

export function PiorityChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return;

    const chart = createChart(containerRef.current, {
      width: 600,
      height: 300,
      layout: {
        background: { type: "solid", color: "white" },
        textColor: "black",
      },
    });
    chartRef.current = chart;

    const colors: Record<string, string> = {
      high_priority: "#FF3D00",
      medium_priority: "#FFB300",
      low_priority: "#4CAF50",
      urgent_priority: "#2979FF",
    };

    Object.keys(colors).forEach((key) => {
      seriesRefs.current[key] = chart.addLineSeries({
        color: colors[key],
        lineWidth: 2,
      });
    });

    async function loadData() {
      try {
        const summary = await getOrdersSummary();
        const now = Math.floor(Date.now() / 1000);

        const seriesData: Record<string, { time: number; value: number }[]> = {};
        Object.keys(colors).forEach((key) => {
          seriesData[key] = [
            { time: now - 60, value: summary[key as keyof typeof summary] as number },
            { time: now, value: summary[key as keyof typeof summary] as number },
          ];
        });

        Object.keys(seriesData).forEach((key) => {
          seriesRefs.current[key].setData(seriesData[key]);
        });
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

  return (
    <div>
      <div ref={containerRef} />
    </div>
  );
}
