import React, { useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { Card, Button } from "antd";

const NestedDonutChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // Accessing passed state
  const navigate = useNavigate();

  const data = location.state?.data;

  useLayoutEffect(() => {
    if (!data) {
      // Redirect back to home if no data is found
      navigate("/");
      return;
    }

    const root = am5.Root.new(chartRef.current!);

    root.setThemes([am5themes_Animated.new(root)]);

    const series = root.container.children.push(
      am5hierarchy.Sunburst.new(root, {
        singleBranchOnly: false,
        downDepth: 1,
        innerRadius: am5.percent(30),
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    series.data.setAll(data);

    series.slices.template.setAll({
      tooltipText: "{name}: {value}",
      cornerRadius: 10, // Adding rounded edges for slices
      stroke: am5.color("#fff"), // Add a white border between slices
      strokeWidth: 2,
    });

    series.labels.template.setAll({
      text: "{name}",
      inside: true,
      radius: 10,
      fontSize: 14,
      fill: am5.color("#fff"),
    });

    return () => root.dispose();
  }, [data, navigate]);

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Nested Donut Chart Visualization
        </h2>
        <div
          ref={chartRef}
          style={{
            width: "100%",
            height: "500px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NestedDonutChart;
