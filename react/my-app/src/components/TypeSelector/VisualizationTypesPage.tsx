import React from 'react';
import { Row, Col } from 'antd';
import VisualizationCard from './VisualizationCardProps';
import { useNavigate } from 'react-router-dom';

const visualizationTypes = [
  {
    name: 'Force Network Graph',
    image: './public/images/force-directed-layout.png',
    route: '/Upload',
  },
  {
    name: 'Pie Chart',
    image: './public/images/thumbnail.svg',
    route: '/PieUpload',
  },
  {
    name: 'Chord diagram',
    image: './public/images/chord-diagram-labels-show-1.png',
    route: '/PieUpload',
  },
  {
     name: 'Donut chart',
    image: './public/images/donut-chart-example.svg',
    route: '/PieUpload',
  },
  {
    name: 'Nested Donut Chart',
   image: './public/images/nestedDonutGraph.png',
   route: '/PieUpload',
 },
 {
  name: ' Grainy Gradient PieChart',
 image: './public/images/GrainyGradientPieChart.png',
 route: '/PieUpload',
},

  // Add more visualization types here
];

const VisualizationTypesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Choose a Visualization Type</h1>
      <Row gutter={[16, 16]}>
        {visualizationTypes.map((type) => (
          <Col key={type.name} xs={24} sm={12} md={8} lg={6}>
            <VisualizationCard 
              name={type.name}
              image={type.image}
              onClick={() => navigate(type.route)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VisualizationTypesPage;
