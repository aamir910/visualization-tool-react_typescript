import { useState } from 'react';
import { Modal ,Button } from 'antd';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { RootState } from '../store'; // Adjust this import to your store setup

const ExportChartModal: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // Type inference for OriginalData from Redux
  const OriginalData = useSelector((state: RootState) => state.data.OriginalData);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const captureScreenshot = async (): Promise<void> => {
    setIsModalVisible(false);
    // Implement PNG or JPEG capture logic here
  };

  const exportToExcel = (): void => {
    if (!OriginalData || !OriginalData.length) {
      console.warn('No data to export.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(OriginalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

    XLSX.writeFile(workbook, 'graph_data.xlsx');
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Export
      </Button>
      <Modal
        title="Export Chart as"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 8px rgba(255, 255, 255, 0.6)',
          }}
        >
          <Button type="primary" style={{ marginBottom: 10 }} onClick={() => captureScreenshot('png')}>
            Download PNG
          </Button>
          <Button type="primary" style={{ marginBottom: 10 }} onClick={() => captureScreenshot('jpeg')}>
            Download JPEG
          </Button>
          <Button type="primary" style={{ marginBottom: 10 }} onClick={exportToExcel}>
            Download Excel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ExportChartModal;
