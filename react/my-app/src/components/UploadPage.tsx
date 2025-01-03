import React, { useState, useEffect, useRef } from 'react';
import { Button, Upload, message, Spin, Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const UploadPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [fileParsed, setFileParsed] = useState(false); // Track if the file has been parsed
  const navigate = useNavigate();

  const REQUIRED_COLUMNS = ['entity_1', 'entity_2', 'edge_type'];
  const lastUploadedFile = useRef<any>(null); // Track the last uploaded file

  const beforeFileUpload = (file: any) => {
    const isCsv = file.type === 'text/csv';
    if (!isCsv) {
      message.error('Only CSV files are allowed');
    }
    return isCsv || Upload.LIST_IGNORE;
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
    
    if (info.fileList.length === 0) {
      setTableData([]); // Clear table data
      setFileParsed(false); // Reset the parsing state
    }
  };

  useEffect(() => {
    if (fileList.length === 0 || fileParsed) return;

    const file = fileList[fileList.length - 1].originFileObj;

    if (file && file !== lastUploadedFile.current) {
      lastUploadedFile.current = file;
      setLoading(true);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log('Parsed Data:', result.data);
          const data = result.data;

          if (!data || data.length === 0) {
            message.error('Parsed data is empty or invalid');
            setLoading(false);
            return;
          }

          const headers = Object.keys(data[0]);
          const missingColumns = REQUIRED_COLUMNS.filter(
            (col) => !headers.includes(col)
          );

          if (missingColumns.length > 0) {
            message.error(
              `Missing required columns: ${missingColumns.join(', ')}. Please follow the pattern.`
            );
            setLoading(false);
            return;
          }

          const generatedColumns = headers.map((key) => ({
            title: key.charAt(0).toUpperCase() + key.slice(1),
            dataIndex: key,
            key,
          }));

          setColumns(generatedColumns);
          setTableData(data.map((row, index) => ({
            key: index,
            ...row,
          })));

          setLoading(false);
          setFileParsed(true); // Mark as parsed
          message.success('File parsed successfully');
        },
        error: (err) => {
          setLoading(false);
          message.error(`Error parsing file: ${err.message}`);
        },
      });
    }
  }, [fileList, fileParsed]);

  const handleUpload = async () => {
    if (fileList.length === 0 || tableData.length === 0) {
      message.error('Please upload and parse a file first');
      return;
    }

    message.success('Navigating to visualization page');
    navigate('/visualize', { state: { data: tableData } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload and Preview Data</h1>
      <Upload
        beforeUpload={beforeFileUpload}
        onChange={handleFileChange}
        fileList={fileList}
        onRemove={() => setTableData([])}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>

      <br />
      <br />

      {loading ? (
        <Spin size="large" />
      ) : tableData.length > 0 ? (
        <Table
          dataSource={tableData}
          columns={columns}
          bordered
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      ) : (
        <p>No data to display. Upload and parse a file to preview data.</p>
      )}

      <Button
        type="primary"
        onClick={handleUpload}
        style={{ marginTop: '20px' }}
        disabled={fileList.length === 0 || tableData.length === 0}
      >
        Upload and Visualize
      </Button>
    </div>
  );
};

export default UploadPage;
