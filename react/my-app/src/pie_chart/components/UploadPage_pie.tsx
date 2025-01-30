import React, { useState } from "react";
import { Button, Upload, message, Table, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx"; // Import XLSX to read the file
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const { Title, Paragraph } = Typography;

interface DataRow {
  key: string;
  label: string;
  value: number;
}

const UploadPage_pie: React.FC = () => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [tableData, setTableData] = useState<DataRow[]>([]);
  const navigate = useNavigate(); // Initialize navigate

  // Handle file upload and parse the data
  const handleFileChange = (info: any): void => {
    const file = info.file.originFileObj;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const ab = e.target.result;
      const workbook = XLSX.read(ab, { type: "array" });
      const sheetName = workbook.SheetNames[0]; // Read the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert to JSON

      // Assuming the first two columns are Label and Value
      const parsedData: DataRow[] = jsonData.map((row: any, index: number) => ({
        key: `${index}`,
        label: row["Labels"], // Column name in your file
        value: row["Values"], // Column name in your file
      }));

      setTableData(parsedData);
      setFileList(info.fileList);
    };

    reader.readAsArrayBuffer(file);
  };

  const columns = [
    {
      title: "Label",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
    },
  ];

  const handleUpload = (): void => {
    if (fileList.length === 0) {
      message.error("Please upload a file first");
      return;
    }
    const data = [
      {
        name: "Category A",
        value: 120,
        children: [
          { name: "Subcategory A1", value: 40 },
          { name: "Subcategory A2", value: 80 },
        ],
      },
      {
        name: "Category B",
        value: 100,
        children: [
          { name: "Subcategory B1", value: 60 },
          { name: "Subcategory B2", value: 40 },
        ],
      },
    ];
  
    
    const GrainyGradientPieChart = [
      { category: "Default A", value: 40, color: "#6f3d75" },
      { category: "Default B", value: 30, color: "#494949" },
      { category: "Default C", value: 20, color: "#b86e47" },
      { category: "Default D", value: 10, color: "#8b6d67" },
    ];

    // Navigate to PieChart page with state
    // navigate("/NestedDonutChart", { state: { data: data } });
    
    navigate("/pie-chart", { state: { data: tableData } });
    // navigate("/GrainyGradientPieChart", { state: { data: GrainyGradientPieChart } });
  };

  return (
    <div className="upload-page">
      <Title level={2} className="page-title">
        Upload and Preview Data
      </Title>
      <Paragraph className="page-description">
        Upload your files and preview their details below.
      </Paragraph>

      <div className="upload-section">
        <Upload
          onChange={handleFileChange}
          fileList={fileList}
          onRemove={() => setTableData([])}
          accept=".xlsx" // Accept only .xlsx files
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>

      <div className="table-section">
        {tableData.length > 0 ? (
          <Table
            dataSource={tableData}
            columns={columns}
            bordered
            rowKey="key"
            pagination={{ pageSize: 5 }}
            className="data-table"
          />
        ) : (
          <Paragraph className="no-data">
            No data to display. Upload a file to preview details.
          </Paragraph>
        )}
      </div>

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
