import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroductionPage from './components/IntroductionPage';
import UploadPage from './components/UploadPage';
import VisualizePage from './components/VisualizePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
      </Routes>
    </Router>
  );
};

export default App;
