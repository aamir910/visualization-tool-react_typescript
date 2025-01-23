// PieChart.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Card } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  data: { key: string; label: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const labels = data.map((item) => item.label);
  const values = data.map((item) => item.value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Dataset 1",
        data: values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Pie Chart Example",
        color: "#111",
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <Card
      title="Pie Chart Visualization"
      bordered={true}
      style={{
        maxWidth: 500,
        margin: "0 auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: 10,
      }}
    >
      <Pie data={chartData} options={options} />
    </Card>
  );
};

export default PieChart;
