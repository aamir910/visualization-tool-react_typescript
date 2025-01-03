import React, { useEffect, useState } from 'react';
import { Button, message, Spin, Row, Col, Card, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ForceGraph2D } from 'react-force-graph'; // Import the 2D force graph component
import * as THREE from 'three'; // Import THREE.js

const VisualizePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [nodeColorEntity1, setNodeColorEntity1] = useState('#ff7f0e'); // Color for EdgeType1 (default orange)
  const [nodeColorEntity2, setNodeColorEntity2] = useState('#1f77b4'); // Color for EdgeType2 (default blue)
  const [linkColor, setLinkColor] = useState('#999'); // Default link color
  const navigate = useNavigate();  // Use useNavigate to navigate between pages

  // Dummy data for nodes and links
  const nodes = [
    { id: '1', entity: 'Entity 1', group: 'EdgeType1' },
    { id: '2', entity: 'Entity 2', group: 'EdgeType2' },
    { id: '3', entity: 'Entity 3', group: 'EdgeType1' },
    { id: '4', entity: 'Entity 4', group: 'EdgeType2' },
  ];

  const links = [
    { source: '1', target: '2', edgeType: 'EdgeType1' },
    { source: '2', target: '3', edgeType: 'EdgeType2' },
    { source: '3', target: '4', edgeType: 'EdgeType1' },
  ];

  // Simulate fetching visualization data (replace with actual data fetching logic)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      message.success('Data visualization loaded');
    }, 3000);  // Simulate delay for data loading
  }, []);

  const handleGoBack = () => {
    navigate('/upload');  // Use navigate to go back to the upload page
  };

  // Custom node drawing function to render the shapes (triangle for EdgeType2, circle for EdgeType1)
  const drawNode = (node: any, ctx: any) => {
    const shapeSize = 8;
    const color = node.group === 'EdgeType1' ? nodeColorEntity1 : nodeColorEntity2; // Get color based on group
    ctx.beginPath();
    ctx.fillStyle = color;

    if (node.group === "EdgeType2") {
      // Draw triangle for 'EdgeType2'
      ctx.moveTo(node.x, node.y - shapeSize);
      ctx.lineTo(node.x - shapeSize, node.y + shapeSize);
      ctx.lineTo(node.x + shapeSize, node.y + shapeSize);
      ctx.closePath();
    } else if (node.group === "EdgeType1") {
      // Draw circle for 'EdgeType1'
      ctx.arc(node.x, node.y, shapeSize, 0, 2 * Math.PI, false);
    }

    ctx.fill();

    // Optional: Add node ID label next to each node
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    // ctx.fillText(node.id, node.x + shapeSize + 5, node.y);
  };

  // Render node shape for the legend
  const renderLegendShape = (group: string, color: string) => {
    const shapeSize = 10; // Size of the legend shape
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      if (group === 'EdgeType2') {
        // Draw triangle for EdgeType2
        ctx.beginPath();
        ctx.moveTo(shapeSize, 0);
        ctx.lineTo(0, shapeSize * 2);
        ctx.lineTo(shapeSize * 2, shapeSize * 2);
        ctx.closePath();
        ctx.fill();
      } else if (group === 'EdgeType1') {
        // Draw circle for EdgeType1
        ctx.beginPath();
        ctx.arc(shapeSize, shapeSize, shapeSize, 0, 2 * Math.PI, false);
        ctx.fill();
      }
    }
    return canvas.toDataURL(); // Return the shape as an image
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Visualize Data</h1>
      {loading ? (
        <Spin size="large" />  // Show loading spinner while fetching data
      ) : (
        <Row gutter={24}>
          {/* Left Legend Column */}
          <Col span={6}>
            <Card title="Entity Types" style={{ width: '100%' }}>
              <Space direction="vertical">
                <div>
                  <span>EdgeType1 Color: </span>
                  <Input
                    type="color"
                    value={nodeColorEntity1}
                    onChange={(e) => setNodeColorEntity1(e.target.value)}
                  />
                </div>
                <div>
                  <span>EdgeType2 Color: </span>
                  <Input
                    type="color"
                    value={nodeColorEntity2}
                    onChange={(e) => setNodeColorEntity2(e.target.value)}
                  />
                </div>
                <div>
                  <span>Link Color: </span>
                  <Input
                    type="color"
                    value={linkColor}
                    onChange={(e) => setLinkColor(e.target.value)}
                  />
                </div>
                {/* Legend Shapes */}
                <div>
                  <div>
                    <img src={renderLegendShape('EdgeType1', nodeColorEntity1)} alt="EdgeType1" />
                    <span> EdgeType1 (Circle)</span>
                  </div>
                  <div>
                    <img src={renderLegendShape('EdgeType2', nodeColorEntity2)} alt="EdgeType2" />
                    <span> EdgeType2 (Triangle)</span>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Force Graph in the middle */}
          <Col span={12}>
            <div style={{ width: '100%', height: '500px' }}>
              <ForceGraph2D
                graphData={{ nodes, links }}
                nodeLabel="entity"
                linkLabel="edgeType"
                nodeAutoColorBy="group"
                linkColor={linkColor}
                nodeCanvasObject={drawNode} // Use the custom drawNode function for rendering nodes
                width={800}
                height={500}
              />
            </div>
          </Col>
        </Row>
      )}

      <br />
      <Button type="default" onClick={handleGoBack}>
        Go Back to Upload
      </Button>
    </div>
  );
};

export default VisualizePage;
