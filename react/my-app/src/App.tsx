import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroductionPage from './components/IntroductionPage';
import UploadPage from './components/UploadPage';
import VisualizePage from './components/VisualizePage';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './layouts/Layout';
import VisualizationTypesPage from './components/TypeSelector/VisualizationTypesPage';
import UploadPage_pie from './pie_chart/components/UploadPage_pie';
import PieChart from './pie_chart/components/PieChart';

const App: React.FC = () => {
  return (
    <Provider store={store}>

    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<IntroductionPage />} />
    

        <Route path="/upload" element={<UploadPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
        
        <Route path="/VisualizationTypes" element={<VisualizationTypesPage/>} />
        <Route path="/PieUpload" element={<UploadPage_pie/>} />

        <Route path="/PieChart" element={<PieChart/>} />

        
      </Routes>
      
      </Layout>
    </Router>
    </Provider>
  );
};

export default App;
