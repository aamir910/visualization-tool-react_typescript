import React, { useEffect, useState } from "react";
import { Button, message, Spin, Row, Col, Card, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { ForceGraph2D } from "react-force-graph";
import { useSelector } from "react-redux";
import { transformData } from "./parseFile"; // Import the transform function
import { RootState } from "../store"; // Adjust path as per your project structure

const VisualizePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [nodeColors, setNodeColors] = useState<Record<string, string>>({});
  const [linkColors, setLinkColors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.data.data); // Redux state for raw data

  useEffect(() => {
    if (data) {
      const transformed = transformData(data); // Use transform function
      const uniqueNodeTypes = Array.from(
        new Set(transformed.nodes.map((node) => node.type))
      );
      const uniqueLinkTypes = Array.from(
        new Set(transformed.links.map((link) => link.type))
      );

      // Assign default colors to unique node and link types
      const initialNodeColors: Record<string, string> = {};
      uniqueNodeTypes.forEach((type, index) => {
        initialNodeColors[type] = `hsl(${(index * 60) % 360}, 70%, 50%)`;
      });

      const initialLinkColors: Record<string, string> = {};
      uniqueLinkTypes.forEach((type, index) => {
        initialLinkColors[type] = `hsl(${(index * 60 + 180) % 360}, 70%, 50%)`;
      });

      setNodeColors(initialNodeColors);
      setLinkColors(initialLinkColors);
      setGraphData(transformed); // Update graph data
    }
    setTimeout(() => {
      setLoading(false);
      message.success("Data visualization loaded");
    }, 500);
  }, [data]);

  const handleColorChange = (type: string, newColor: string, isNode: boolean) => {
    if (isNode) {
      setNodeColors({ ...nodeColors, [type]: newColor });
    } else {
      setLinkColors({ ...linkColors, [type]: newColor });
    }
  };

  const drawNode = (node: any, ctx: any) => {
    const shapeSize = 8;
    const color = nodeColors[node.type] || "#999";
  
    ctx.fillStyle = color;
  
    if (node.group === "entity_2_type") {
      // Draw a triangle
      ctx.beginPath();
      ctx.moveTo(node.x, node.y - shapeSize); // Top vertex
      ctx.lineTo(node.x - shapeSize, node.y + shapeSize); // Bottom left
      ctx.lineTo(node.x + shapeSize, node.y + shapeSize); // Bottom right
      ctx.closePath();
      ctx.fill();
    } else {
      // Default shape: circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, shapeSize, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  };
  

  const renderLegendShape = (
    type: string,
    color: string,
    isNode: boolean = true
  ) => {
    console.log(type , "here is the type there ")
    const shapeSize = 10; // Adjust size as needed
    const canvas = document.createElement("canvas");
    canvas.width = shapeSize * 2;
    canvas.height = shapeSize * 2;
    const ctx = canvas.getContext("2d");
  
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
  
      if (type === "entity_2_type" && isNode) {
        // Draw a triangle for entity_1_type
        ctx.beginPath();
        ctx.moveTo(shapeSize, 0); // Top vertex
        ctx.lineTo(0, shapeSize * 2); // Bottom left
        ctx.lineTo(shapeSize * 2, shapeSize * 2); // Bottom right
        ctx.closePath();
        ctx.fill();
      } else if (isNode) {
        // Draw a circle for other node types
        ctx.beginPath();
        ctx.arc(shapeSize, shapeSize, shapeSize / 2, 0, 2 * Math.PI, false);
        ctx.fill();
      } else {
        // Draw a line for links
        ctx.beginPath();
        ctx.moveTo(0, shapeSize);
        ctx.lineTo(shapeSize * 2, shapeSize);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
    return canvas.toDataURL();
  };
  

  const handleGoBack = () => {
    navigate("/upload");
  };

  return (
    <div style={{ padding: "20px" }}>
        <br />
      <Button type="default" onClick={handleGoBack}>
        Go Back to Upload
      </Button>
      <h1>Visualize Data</h1>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={24}>
          {/* Legend Section */}
          <Col span={6}>
            <Card title="Legend" style={{ width: "100%" }}>
              <h4>Nodes</h4>
              <Space direction="vertical">
                {Object.entries(nodeColors).map(([type, color]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={renderLegendShape(type, color, true)}
                      alt={type}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "color";
                        input.value = color;
                        input.oninput = (e) =>
                          handleColorChange(type, e.currentTarget.value, true);
                        input.click();
                      }}
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </Space>

              <h4 style={{ marginTop: "20px" }}>Links</h4>
              <Space direction="vertical">
                {Object.entries(linkColors).map(([type, color]) => (
                  <div key={type} style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={renderLegendShape(type, color, false)}
                      alt={type}
                      style={{ cursor: "pointer", marginRight: "10px" }}
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "color";
                        input.value = color;
                        input.oninput = (e) =>
                          handleColorChange(type, e.currentTarget.value, false);
                        input.click();
                      }}
                    />
                    <span>{type}</span>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Graph Section */}
          <Col span={18}>
          <Card title="Graphs" style={{ width: "100%" }}>

            <div style={{ width: "100%", height: "500px" }}>
              <ForceGraph2D
                graphData={graphData}
                nodeLabel="entity"
                linkLabel="type"
                nodeAutoColorBy="type"
                nodeCanvasObject={drawNode}
                linkColor={(link: any) => linkColors[link.type] || "#999"}
                width={1000}
                height={500}
              />
            </div>
          </Card>
          </Col>
        </Row>
      )}

    
    </div>
  );
};

export default VisualizePage;
