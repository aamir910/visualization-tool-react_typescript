import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const IntroductionPage: React.FC = () => {
  const navigate = useNavigate(); // Use useNavigate to get the navigate function

  // Function to navigate to a different page
  const handleNavigate = () => {
    navigate('/upload');  // Navigate to the /upload page
  };

  return (
    <div>
      <h1>Welcome to the Data Visualization Tool</h1>
      <button onClick={handleNavigate}>Go to Upload</button>
    </div>
  );
};

export default IntroductionPage;
