import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const DownloadSampleButton: React.FC = () => {
  const handleDownload = () => {
    fetch("/sample_data.xlsx")
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "sample_data.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => console.error("Failed to download file"));
  };

  return (
    <Button icon={<DownloadOutlined />} onClick={handleDownload} type="default">
      Download Sample Excel File
    </Button>
  );
};

export default DownloadSampleButton;
