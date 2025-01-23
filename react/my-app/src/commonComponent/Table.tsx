import React, { useState } from "react";
import { Button, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import TableComponent from "../commonComponent/Table"; // Import the separated table component
// import "../components/styles/UploadPage.css";

const { Title, Paragraph } = Typography;

interface DataRow {
  key: string;
  name: string;
  size: number;
  type: string;
}

const UploadPage_pie: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [tableData, setTableData] = useState<DataRow[]>([]);
  const navigate = useNavigate();

  const handleFileChange = (info: any): void => {
    const files = info.fileList.map((file: any, index: number) => ({
      key: `${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFileList(info.fileList);
    setTableData(files);

    if (info.fileList.length === 0) {
      setTableData([]);
    }
  };

  const handleUpload = (): void => {
    if (fileList.length === 0) {
      message.error("Please upload a file first");
      return;
    }

    message.success("Navigating to visualization page");
    navigate("/visualize", { state: { data: tableData } });
  };

  return (
    <div className="upload-page">
      <Title level={2} className="page-title">Upload and Preview Data</Title>
      <Paragraph className="page-description">
        Upload your files and preview their details below.
      </Paragraph>

      <div className="upload-section">
        <Upload
          onChange={handleFileChange}
          fileList={fileList}
          onRemove={() => setTableData([])}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>

      {/* Render the separated TableComponent */}
      <TableComponent tableData={tableData} />

      <Button
        type="primary"
        onClick={handleUpload}
        className="upload-button"
        disabled={fileList.length === 0}
      >
        Upload and Visualize
      </Button>
    </div>
  );
};

export default UploadPage_pie;
