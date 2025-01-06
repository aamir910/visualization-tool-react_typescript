import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroductionPage from './components/IntroductionPage';
import UploadPage from './components/UploadPage';
import VisualizePage from './components/VisualizePage';
import { Provider } from 'react-redux';
import store from './store';

const App: React.FC = () => {
  return (
    <Provider store={store}>

    <Router>
      <Routes>
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
      </Routes>
    </Router>
    </Provider>
  );
};

export default App;
