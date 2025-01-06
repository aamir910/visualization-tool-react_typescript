import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroductionPage from './components/IntroductionPage';
import UploadPage from './components/UploadPage';
import VisualizePage from './components/VisualizePage';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './layouts/Layout';

const App: React.FC = () => {
  return (
    <Provider store={store}>

    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<IntroductionPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
      </Routes>
      
      </Layout>
    </Router>
    </Provider>
  );
};

export default App;
