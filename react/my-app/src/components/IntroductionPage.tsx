import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'antd';
import './styles/IntroductionPage.css'; // Import custom CSS file

const IntroductionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/upload');
  };

  return (
    <div className="introduction-container">
      <h1 className="main-title">Welcome to the Visualization Tool</h1>
      <Carousel autoplay className="carousel-container">
        <div>
          <h3 className="carousel-slide">
            Build interactive graphs like Force Network Graphs  effortlessly.
          </h3>
        </div>
        <div>
          <h3 className="carousel-slide">
            Visualize and analyze disorder nodes in Graph 1.
          </h3>
        </div>
        <div>
          <h3 className="carousel-slide">
            Explore genetic data interactions in Graph 2.
          </h3>
        </div>
        <div>
          <h3 className="carousel-slide">
            Upload CSV or Excel files to generate detailed visualizations.
          </h3>
        </div>
      </Carousel>
      <p className="description">
        Our tool helps you create stunning and insightful visualizations for your projects. Whether you need 
        force network graphs, pie charts, or any other visualization, we’ve got you covered. Upload your data files 
        and see your data come to life.
      </p>
      <button className="navigate-button" onClick={handleNavigate}>Get Started</button>
    </div>
  );
};

export default IntroductionPage;
