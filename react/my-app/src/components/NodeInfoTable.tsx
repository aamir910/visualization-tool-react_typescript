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

  const data = Object.keys(node).map((key) => ({
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
