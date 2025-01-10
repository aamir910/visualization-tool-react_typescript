import React from "react";
import { Table } from "antd";

interface NodeInfoTableProps {
  node: any;
}

const NodeInfoTable: React.FC<NodeInfoTableProps> = ({ node }) => {
  const columns = [
    { title: "Property", dataIndex: "property", key: "property" },
    { title: "Value", dataIndex: "value", key: "value" },
  ];

  // List of properties to always show
  const requiredProperties = ["name", "id", "group"];

  // Filter and include only the properties that are in requiredProperties and are not null or undefined
  const data = Object.keys(node)
    .filter((key) => requiredProperties.includes(key) || (key.startsWith("description") && node[key] !== null && node[key] !== undefined))
    .map((key) => ({
      key,
      property: key,
      value: node[key],
    }));

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        bordered
      />
    </div>
  );
};

export default NodeInfoTable;
