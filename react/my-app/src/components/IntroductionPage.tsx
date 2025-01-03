import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { Carousel } from 'antd'; // Import Carousel from Ant Design

const IntroductionPage: React.FC = () => {
  const navigate = useNavigate(); // Use useNavigate to get the navigate function

  const handleNavigate = () => {
    navigate('/upload');  // Navigate to the /upload page
  };
  const contentStyle: React.CSSProperties = {
    height: '100px',
    color: '#fff',
    lineHeight: '100px',
    textAlign: 'center',
    background: 'black',
  };

  return (
    <div>
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle} >Introduction to Visualization Tool</h3>
      </div>
        <div>
          <h3 style={contentStyle} >Graph 1: Data Representation of Disorder Nodes</h3>
           </div>
        <div>
          <h3 style={contentStyle}>Graph 2: Genetic Data Interaction</h3>
        </div>
      </Carousel>
      <button onClick={handleNavigate}>Go to Upload</button>

    </div>
  );
};

export default IntroductionPage;
