import React, { useEffect, useState } from "react";
import { Button, Spin, Row, Col, Card, Modal, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { ForceGraph2D } from "react-force-graph";
import { useSelector } from "react-redux";
import { transformData } from "./utils/TransformedData";
import { RootState } from "../store";
import Legend from "./Legend";
import NodeInfoTable from "./NodeInfoTable";

const { Option } = Select;

interface Node {
  id: string;
  type: string;
  group?: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

const VisualizePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [nodeColors, setNodeColors] = useState<Record<string, string>>({});
  const [linkColors, setLinkColors] = useState<Record<string, string>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entity1Shape, setEntity1Shape] = useState<string>("circle");
  const [entity2Shape, setEntity2Shape] = useState<string>("square");

  const navigate = useNavigate();
  const data = useSelector((state: RootState) => state.data.CopyData);

  useEffect(() => {
    if (data) {
      setLoading(true);
      const transformed: GraphData = transformData(data);
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
      setLoading(false);
    }
  }, [data]);
  const handleColorChange = (type: string, newColor: string, isNode: boolean) => {
    if (isNode) {
      setNodeColors({ ...nodeColors, [type]: newColor });
    } else {
      setLinkColors({ ...linkColors, [type]: newColor });
    }
  };

  const drawNode = (node: Node, ctx: CanvasRenderingContext2D) => {
    const size = 8;
    const color = nodeColors[node.type] || "#999";
    ctx.fillStyle = color;
  
    ctx.beginPath();
    const shape =
      node.group === "entity_1_type"
        ? entity1Shape
        : node.group === "entity_2_type"
        ? entity2Shape
        : "circle";
  
    switch (shape) {
      case "circle":
        ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
        break;
  
      case "square":
        ctx.rect(node.x! - size, node.y! - size, size * 2, size * 2);
        break;
  
      case "triangle":
        ctx.moveTo(node.x!, node.y! - size);
        ctx.lineTo(node.x! - size, node.y! + size);
        ctx.lineTo(node.x! + size, node.y! + size);
        ctx.closePath();
        break;  
  
      case "pentagon":
        for (let i = 0; i < 5; i++) {
          const angle = (i * (2 * Math.PI)) / 5 - Math.PI / 2;
          const x = node.x! + size * Math.cos(angle);
          const y = node.y! + size * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
  
      case "hexagon":
        for (let i = 0; i < 6; i++) {
          const angle = (i * (2 * Math.PI)) / 6 - Math.PI / 2;
          const x = node.x! + size * Math.cos(angle);
          const y = node.y! + size * Math.sin(angle);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
  
      case "capsule":
        const capsuleWidth = size * 2;
        const capsuleHeight = size;
        ctx.arc(node.x! - capsuleWidth / 2, node.y!, capsuleHeight, 0.5 * Math.PI, 1.5 * Math.PI);
        ctx.arc(node.x! + capsuleWidth / 2, node.y!, capsuleHeight, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.closePath();
        break;
    }
    ctx.fill();
  };
  

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedNode(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button type="default" onClick={() => navigate("/upload")}>Go Back to Upload</Button>
      <h1>Visualize Data</h1>
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col>
          <Select value={entity1Shape} style={{ width: 200 }} onChange={setEntity1Shape}>
            <Option value="circle">Circle (Entity 1)</Option>
            <Option value="square">Square (Entity 1)</Option>
            <Option value="triangle">Triangle (Entity 1)</Option>
            <Option value="pentagon">pentagon (Entity 1)</Option>
            <Option value="hexagon">hexagon (Entity 1)</Option>
            <Option value="capsule">capsule (Entity 1)</Option>
          </Select>
        </Col>
        <Col>
          <Select value={entity2Shape} style={{ width: 200 }} onChange={setEntity2Shape}>
            <Option value="circle">Circle (Entity 2)</Option>
            <Option value="square">Square (Entity 2)</Option>
            <Option value="triangle">Triangle (Entity 2)</Option>
            <Option value="pentagon">pentagon (Entity 2)</Option>
            <Option value="hexagon">hexagon (Entity 2)</Option>
            <Option value="capsule">capsule (Entity 2)</Option>
          </Select>
        </Col>
      </Row>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={24}>
          <Col span={6}>
          <Legend
    nodeColors={nodeColors}
    linkColors={linkColors}
    onColorChange={handleColorChange}
    entity1Shape={entity1Shape}
    entity2Shape={entity2Shape}
  />
          
          </Col>
          <Col span={18}>
            <Card title="Graphs" style={{ width: "100%" }}>
              <ForceGraph2D
                graphData={graphData}
                nodeCanvasObject={drawNode}
                linkColor={(link: any) => linkColors[link.type] || "#999"}
                width={1000}
                height={500}
                onNodeClick={handleNodeClick}
              />
            </Card>
          </Col>
        </Row>
      )}
      <Modal
        title="Node Information"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={600}
      >
        {selectedNode && <NodeInfoTable node={selectedNode} />}
      </Modal>
    </div>
  );
};

export default VisualizePage;
