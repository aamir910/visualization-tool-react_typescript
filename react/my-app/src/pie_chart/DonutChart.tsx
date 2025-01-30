import React, { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Card } from "antd";
import { useLocation } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DonutChart: React.FC = () => {
  const location = useLocation();
  const data = location.state?.data || [];
  const chartRef = useRef<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [colors, setColors] = useState<string[]>([
    "rgba(54, 162, 235, 0.7)",
    "rgba(173, 216, 230, 0.7)",
    "rgba(255, 99, 132, 0.7)",
    "rgba(255, 182, 193, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(144, 238, 144, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(221, 160, 221, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(255, 255, 224, 0.7)",
    "rgba(0, 128, 0, 0.7)",
    "rgba(144, 238, 144, 0.7)",
    "rgba(255, 69, 0, 0.7)",
    "rgba(255, 165, 0.7)",
    "rgba(255, 99, 71, 0.7)",
    "rgba(255, 239, 0, 0.7)",
    "rgba(32, 178, 170, 0.7)",
    "rgba(224, 255, 255, 0.7)",
    "rgba(0, 0, 128, 0.7)",
    "rgba(135, 206, 235, 0.7)",
  ]);

  const labels = data.map((item: any) => item.label);
  const values = data.map((item: any) => item.value);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    // Maintain a valid RGBA color format
    newColors[index] = `${newColor}B3`; // B3 adds ~70% opacity
    setColors(newColors);
    setSelectedIndex(null);
  };

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Dataset 1",
        data: values,
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors
          .slice(0, data.length)
          .map((color) => color.replace("0.7", "1")),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "50%", // Adjust for the donut effect
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedIndex(index);

        // Create hidden color input
        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.style.position = "fixed";
        colorInput.style.left = "-1000px";

        colorInput.onchange = (e: any) => {
          handleColorChange(index, e.target.value);
          document.body.removeChild(colorInput);
        };

        document.body.appendChild(colorInput);
        colorInput.click();
      }
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "#333", font: { size: 14 } },
      },
      title: {
        display: true,
        text: "Donut Chart Example",
        color: "#111",
        font: { size: 18 },
      },
    },
  };

  return (
    <Card
      title="Donut Chart Visualization"
      bordered={true}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
      }}
    >
      <Pie ref={chartRef} data={chartData} options={options} />
      <div style={{ marginTop: 16, textAlign: "center" }}>
        Click any segment to change its color!
      </div>
    </Card>
  );
};

export default DonutChart;
