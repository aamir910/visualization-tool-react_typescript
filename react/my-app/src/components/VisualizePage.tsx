import React, { useEffect, useState } from 'react';
import { Button, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const VisualizePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Use useNavigate to navigate between pages

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Visualize Data</h1>
      {loading ? (
        <Spin size="large" />  // Show loading spinner while fetching data
      ) : (
        <div>
          <p>Data visualization will appear here.</p>
          {/* You can embed your 3D force graph or other visualizations here */}
        </div>
      )}
      <br />
      <Button type="default" onClick={handleGoBack}>
        Go Back to Upload
      </Button>
    </div>
  );
};

export default VisualizePage;
