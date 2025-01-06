import React from 'react';
import { Layout, Typography, Space, Divider } from 'antd';
import './styles/AppFooter.css';  // Import the custom CSS file

const { Footer } = Layout;
const { Text, Title } = Typography;

const AppFooter: React.FC = () => {
  return (
    <Footer className="custom-footer">
      <div className="footer-content">
        <Space direction="vertical" align="center">
          <Title level={5} className="footer-title">
            Interactive Data Visualization Tool
          </Title>
          <Text className="footer-text">
            &copy; 2025 Aamir Yasin. All Rights Reserved.
          </Text>
        </Space>
        <Divider className="footer-divider" />
        <div className="footer-links">
          <Text className="footer-link">Privacy Policy</Text>
          <Text className="footer-link">Terms of Service</Text>
          <Text className="footer-link">Contact Us</Text>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
