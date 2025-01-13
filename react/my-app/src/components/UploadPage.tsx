import React, { useState, useEffect, useRef } from "react";
import { Button, Upload, message, Spin, Table, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { parseCSVFile } from "./parseFile";
import { useDispatch } from "react-redux";
import { setData } from "../store/data/dataSlice"; // Assuming these are your action creators

import "./styles/UploadPage.css"; // Import the custom CSS file
import DownloadSampleButton from "./DownloadSampleButton";

const { Title, Paragraph } = Typography;

interface DataRow {
  [key: string]: string | number | undefined;
}

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [tableData, setTableData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [fileParsed, setFileParsed] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const REQUIRED_COLUMNS: string[] = ["entity_1", "entity_2"];
  const lastUploadedFile = useRef<File | null>(null);

  // Fix for Upload namespace issue
  const beforeFileUpload = (file: File): boolean | typeof Upload.LIST_IGNORE => {
    const isCsv = file.type === "text/csv";
    const isExcel =
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel";

    if (!isCsv && !isExcel) {
      message.error("Only CSV and Excel files are allowed");
    }

    return isCsv || isExcel || Upload.LIST_IGNORE;
  };

  const handleFileChange = (info: any): void => {
    setFileList(info.fileList);

    if (info.fileList.length === 0) {
      setTableData([]);
      setFileParsed(false);
    }
  };

  useEffect(() => {
    if (fileList.length === 0 || fileParsed) return;

    const file = fileList[fileList.length - 1]?.originFileObj as File;

    if (file && file !== lastUploadedFile.current) {
      lastUploadedFile.current = file;
      setLoading(true);

      parseCSVFile<DataRow>(file, REQUIRED_COLUMNS, (data) => {
        const headers = Object.keys(data[0]);

        // Ensure dataIndex and key are strings
        const generatedColumns = headers.map((key) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1),
          dataIndex: key.toString(),
          key: key.toString(),
        }));

        setColumns(generatedColumns);

        // Fix duplicate `key` by using a unique identifier
        setTableData(
          data.map((row, index) => ({
            ...row,
            key: `${index}`, // Ensure key is unique and a string
          }))
        );

        // Extract unique node and link types
        const uniqueNodeTypes = new Set<string>();
        const uniqueLinkTypes = new Set<string>();

        data.forEach((row) => {
          if (row["entity_1_type"]) uniqueNodeTypes.add(String(row["entity_1_type"]));
          if (row["entity_2_type"]) uniqueNodeTypes.add(String(row["entity_2_type"]));
          if (row["edge_type"]) uniqueLinkTypes.add(String(row["edge_type"]));
        });

        // Dispatch actions to update Redux state
        dispatch(setData(data));
    

        setLoading(false);
        setFileParsed(true);
        message.success("File parsed successfully");
      }, dispatch, (error) => {
        setLoading(false);
        message.error(error);
      });
    }
  }, [fileList, fileParsed, dispatch]);

  const handleUpload = (): void => {
    if (fileList.length === 0 || tableData.length === 0) {
      message.error("Please upload and parse a file first");
      return;
    }

    message.success("Navigating to visualization page");
    navigate("/visualize", { state: { data: tableData } });
  };

  return (
    <div className="upload-page">
      <Title level={2} className="page-title">Upload and Preview Data</Title>
      <Paragraph className="page-description">
        Easily upload your CSV or Excel files, preview the data, and navigate to the visualization page.
      </Paragraph>

      <div className="upload-section">
        <Upload
          beforeUpload={beforeFileUpload}
          onChange={handleFileChange}
          fileList={fileList}
          onRemove={() => setTableData([])}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>

      <div className="table-section">
        {loading ? (
          <Spin size="large" />
        ) : tableData.length > 0 ? (
          <Table
            dataSource={tableData}
            columns={columns}
            bordered
            rowKey="key" // Uses the unique key we set
            pagination={{ pageSize: 5 }}
            className="data-table"
          />
        ) : (
          <Paragraph className="no-data">
            No data to display. Upload and parse a file to preview data.
          </Paragraph>
        )}
      </div>

      <Button
        type="primary"
        onClick={handleUpload}
        className="upload-button"
        disabled={fileList.length === 0 || tableData.length === 0}
      >
        Upload and Visualize
      </Button>

      <DownloadSampleButton />
    </div>
  );
};

export default UploadPage;
