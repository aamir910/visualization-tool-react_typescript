import React, { useState } from 'react';
import { Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';  // Replace useHistory with useNavigate

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const navigate = useNavigate();  // useNavigate hook for navigation

  // Handle file upload
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file to upload');
      return;
    }

    setLoading(true);

    // Simulate file upload process (you can implement the actual file upload logic here)
    setTimeout(() => {
      setLoading(false);
      message.success('File uploaded successfully');
      navigate('/visualize');  // Use navigate to go to the visualize page after upload
    }, 2000);
  };

  // Handle file selection
  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }

    setFileList(info.fileList);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload Data File</h1>
      <Upload
        action="/upload.do"  // You can change this to your backend endpoint if needed
        onChange={handleFileChange}
        fileList={fileList}
        beforeUpload={() => false}  // Prevent auto upload to allow custom upload logic
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      <br />
      <Button
        type="primary"
        onClick={handleUpload}
        style={{ marginTop: '20px' }}
        loading={loading}
      >
        {loading ? <Spin /> : 'Upload and Visualize'}
      </Button>
    </div>
  );
};

export default UploadPage;
