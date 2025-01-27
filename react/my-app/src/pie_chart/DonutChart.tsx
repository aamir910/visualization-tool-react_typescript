import React from "react";
import { Pie } from "react-chartjs-2";
import { Card } from "antd";
import { useLocation } from "react-router-dom"; // Import useLocation to access state
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DonutChart: React.FC = () => {
  const location = useLocation(); // Access location state
  const data = location.state?.data || []; // Get data from state or fallback to empty array

  const labels = data.map((item: any) => item.label);
  const values = data.map((item: any) => item.value);

  // Define a color scheme with alternating dark and light colors
  const colorScheme = [
    "rgba(54, 162, 235, 0.7)", // Dark blue
    "rgba(173, 216, 230, 0.7)", // Light blue
    "rgba(255, 99, 132, 0.7)", // Dark red
    "rgba(255, 182, 193, 0.7)", // Light red
    "rgba(75, 192, 192, 0.7)", // Dark teal
    "rgba(144, 238, 144, 0.7)", // Light green
    "rgba(153, 102, 255, 0.7)", // Dark purple
    "rgba(221, 160, 221, 0.7)", // Light purple
    "rgba(255, 206, 86, 0.7)", // Dark yellow
    "rgba(255, 255, 224, 0.7)", // Light yellow
    "rgba(0, 128, 0, 0.7)", // Dark green
    "rgba(144, 238, 144, 0.7)", // Light green
    "rgba(255, 69, 0, 0.7)", // Dark orange
    "rgba(255, 165, 0, 0.7)", // Light orange
    "rgba(255, 99, 71, 0.7)", // Dark tomato
    "rgba(255, 239, 0, 0.7)", // Light tomato
    "rgba(32, 178, 170, 0.7)", // Dark light sea green
    "rgba(224, 255, 255, 0.7)", // Light light sea green
    "rgba(0, 0, 128, 0.7)", // Dark navy
    "rgba(135, 206, 235, 0.7)", // Light sky blue
  ];

  // Adjust the color scheme to match the dataset size
  const chartColors = colorScheme.slice(0, data.length);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Dataset 1",
        data: values,
        backgroundColor: chartColors,
        borderColor: chartColors.map(color => color.replace("0.7", "1")), // Make border color more opaque
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
        text: "Donut Chart Example",
        color: "#111",
        font: {
          size: 18,
        },
      },
    },
    cutout: "50%", // Always render as a donut chart
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
      <Pie data={chartData} options={options} />
    </Card>
  );
};

export default DonutChart;
