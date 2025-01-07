import React, { useEffect, useState } from "react";
import { Button, Spin, Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ForceGraph2D } from "react-force-graph";
import { useSelector } from "react-redux";
import { transformData } from "./parseFile";
import { RootState } from "../store";
import Legend from "./Legend"; // Import the Legend component

const VisualizePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [nodeColors, setNodeColors] = useState<Record<string, string>>({});
  const [linkColors, setLinkColors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const data = useSelector((state: RootState) => state.data.CopyData);

  useEffect(() => {
    if (data) {
      console.log(data)
      
      const transformed = transformData(data);
      const uniqueNodeTypes = Array.from(new Set(transformed.nodes.map((node) => node.type)));
      const uniqueLinkTypes = Array.from(new Set(transformed.links.map((link) => link.type)));

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
      setGraphData(transformed);
    }
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
      ctx.beginPath();
      ctx.moveTo(node.x, node.y - shapeSize);
      ctx.lineTo(node.x - shapeSize, node.y + shapeSize);
      ctx.lineTo(node.x + shapeSize, node.y + shapeSize);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(node.x, node.y, shapeSize, 0, 2 * Math.PI, false);
      ctx.fill();
    }
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
          <Col span={6}>
            <Legend
              nodeColors={nodeColors}
              linkColors={linkColors}
              onColorChange={handleColorChange}
            />
          </Col>
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
