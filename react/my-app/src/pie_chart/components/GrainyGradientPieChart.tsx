import React, { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const GrainyGradientPieChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Extract data from location state
  const data = location.state?.data || [
    { category: "Default A", value: 40, color: "#6f3d75" },
    { category: "Default B", value: 30, color: "#494949" },
    { category: "Default C", value: 20, color: "#b86e47" },
    { category: "Default D", value: 10, color: "#8b6d67" },
  ];

  useLayoutEffect(() => {
    const root = am5.Root.new(chartRef.current!);

    // Apply animated theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Create a pie chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    // Add a pie series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
      })
    );

    series.data.setAll(data);

    // Customize slices with gradient and grainy texture
    series.slices.template.setAll({
      tooltipText: "{category}: {value}%",
      strokeWidth: 2,
      stroke: am5.color("#ffffff"),
      cornerRadius: 5, // Adds rounded corners for aesthetic improvement
    });

    series.slices.template.adapters.add("fill", (fill, target) => {
      const color = target.dataItem?.dataContext?.color as string;
      const gradient = am5.RadialGradient.new(root, {
        stops: [
          { color: am5.color(color).lighten(0.2), offset: 0 },
          { color: am5.color(color), offset: 0.5 },
          { color: am5.color(color).darken(0.2), offset: 1 },
        ],
      });
      return gradient;
    });

    series.slices.template.adapters.add("fillOpacity", () => 0.9);

    series.labels.template.setAll({
      text: "{category}: {value}%",
      fill: am5.color("#333"),
      fontSize: "12px",
      oversizedBehavior: "truncate",
    });

    // Add a legend
    chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        y: am5.percent(95),
        layout: root.horizontalLayout,
      })
    );

    // Dispose root on unmount
    return () => root.dispose();
  }, [data]);

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "10px",
      }}
      ref={chartRef}
    ></div>
  );
};

export default GrainyGradientPieChart;

