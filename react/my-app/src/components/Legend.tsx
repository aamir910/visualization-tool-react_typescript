import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Space, Checkbox } from "antd";
import { renderLegendShape } from "./utils/funstions";
import { RootState } from "../store";
import { setUniqueNodes, setUniqueLinks } from "../store/data/dataSlice";

interface LegendProps {
  nodeColors: Record<string, string>;
  linkColors: Record<string, string>;
  onColorChange: (type: string, newColor: string, isNode: boolean) => void;
}

const Legend: React.FC<LegendProps> = ({ nodeColors, linkColors, onColorChange }) => {
  const dispatch = useDispatch();

  // Accessing state from Redux
  const { UniqueNodes, UniqueLinks } = useSelector((state: RootState) => state.data);

  React.useEffect(() => {
    console.log("Dispatched State - UniqueNodes:", UniqueNodes);
    console.log("Dispatched State - UniqueLinks:", UniqueLinks);
  }, [UniqueNodes, UniqueLinks]);

  const handleCheckboxChange = (type: string, isNode: boolean) => {
    if (isNode) {
      dispatch(setUniqueNodes({ ...UniqueNodes, [type]: !UniqueNodes[type] }));
    } else {
      dispatch(setUniqueLinks({ ...UniqueLinks, [type]: !UniqueLinks[type] }));
    }
  };

  const handleColorPicker = (type: string, currentColor: string, isNode: boolean) => {
    const input = document.createElement("input");
    input.type = "color";
    input.value = currentColor;
    input.oninput = (e) => onColorChange(type, e.currentTarget.value, isNode);
    input.click();
  };

  return (
    <Card title="Legend" style={{ width: "100%" }}>
      <h4>Nodes</h4>
      <Space direction="vertical">
        {Object.entries(UniqueNodes).map(([type, visible]) => (
          <div key={type} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={visible}
              onChange={() => handleCheckboxChange(type, true)}
            />
            <img
              src={renderLegendShape(type, nodeColors[type], true)}
              alt={type}
              style={{ cursor: "pointer", margin: "0 10px" }}
              onClick={() => handleColorPicker(type, nodeColors[type], true)}
            />
            <span>{type}</span>
          </div>
        ))}
      </Space>

      <h4 style={{ marginTop: "20px" }}>Links</h4>
      <Space direction="vertical">
        {Object.entries(UniqueLinks).map(([type, visible]) => (
          <div key={type} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={visible}
              onChange={() => handleCheckboxChange(type, false)}
            />
            <img
              src={renderLegendShape(type, linkColors[type], false)}
              alt={type}
              style={{ cursor: "pointer", margin: "0 10px" }}
              onClick={() => handleColorPicker(type, linkColors[type], false)}
            />
            <span>{type}</span>
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default Legend;
