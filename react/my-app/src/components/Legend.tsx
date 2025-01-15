import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Space, Checkbox } from "antd";
import { RootState } from "../store";
import { setUniqueNodes, setUniqueLinks } from "../store/data/dataSlice";

interface LegendProps {
  nodeColors: Record<string, string>;
  linkColors: Record<string, string>;
  onColorChange: (type: string, newColor: string, isNode: boolean) => void;
  entity1Shape: string;
  entity2Shape: string;
}

const Legend: React.FC<LegendProps> = ({ nodeColors, linkColors, onColorChange, entity1Shape, entity2Shape }) => {
  const dispatch = useDispatch();
  const { UniqueNodes, UniqueLinks } = useSelector((state: RootState) => state.data);

  const handleCheckboxChange = (type: string, isNode: boolean) => {
    if (isNode) {
      dispatch(
        setUniqueNodes({
          ...UniqueNodes,
          [type]: { ...UniqueNodes[type], value: !UniqueNodes[type].value }
        })
      );
    } else {
      dispatch(
        setUniqueLinks({
          ...UniqueLinks,
          [type]: { ...UniqueLinks[type], value: !UniqueLinks[type].value }
        })
      );
    }
  };

  const handleColorPicker = (type: string, currentColor: string, isNode: boolean) => {
    const input = document.createElement("input");
    input.type = "color";
    input.value = currentColor;
    input.oninput = (e) =>
      onColorChange(type, (e.currentTarget as HTMLInputElement).value, isNode);
    input.click();
  };

  return (
    <Card title="Legend" style={{ width: "100%" }}>
      <h4>Nodes</h4>
      <Space direction="vertical">
        {Object.entries(UniqueNodes).map(([key, { type, value }]) => {
          const shape = type === "entity_1_type" ? entity1Shape : entity2Shape;
          return (
            <div key={key} style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={value}
                onChange={() => handleCheckboxChange(key, true)}
              />
              <img
                src={renderLegendShape(shape, nodeColors[key], true)}
                alt={key}
                style={{ cursor: "pointer", margin: "0 10px" }}
                onClick={() => handleColorPicker(key, nodeColors[key], true)}
              />
              <span>{key}</span>
            </div>
          );
        })}
      </Space>

      <h4 style={{ marginTop: "20px" }}>Links</h4>
      <Space direction="vertical">
        {Object.entries(UniqueLinks).map(([key, { type, value }]) => (
          <div key={key} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              checked={value}
              onChange={() => handleCheckboxChange(key, false)}
            />
            <img
              src={renderLegendShape(type, linkColors[key], false)}
              alt={key}
              style={{ cursor: "pointer", margin: "0 10px" }}
              onClick={() => handleColorPicker(key, linkColors[key], false)}
            />
            <span>{key}</span>
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default Legend;

// Updated renderLegendShape function
const renderLegendShape = (shape: string, color: string, isNode: boolean): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 20;
  canvas.height = 20;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = color;
    ctx.beginPath();

    switch (shape) {
      case "circle":
        ctx.arc(10, 10, 8, 0, 2 * Math.PI);
        break;

      case "square":
        ctx.rect(4, 4, 12, 12);
        break;

      case "triangle":
        ctx.moveTo(10, 2);
        ctx.lineTo(2, 18);
        ctx.lineTo(18, 18);
        ctx.closePath();
        break;

        case "pentagon": {
          for (let i = 0; i < 5; i++) {
            const angle = (i * (2 * Math.PI)) / 5 - Math.PI / 2;
            const x = 10 + 8 * Math.cos(angle);
            const y = 10 + 8 * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        }
      
        case "hexagon": {
          for (let i = 0; i < 6; i++) {
            const angle = (i * (2 * Math.PI)) / 6 - Math.PI / 2;
            const x = 10 + 8 * Math.cos(angle);
            const y = 10 + 8 * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          break;
        }

      case "capsule":
        const capsuleWidth = 12;
        const capsuleHeight = 8;
        ctx.arc(6, 10, capsuleHeight / 2, 0.5 * Math.PI, 1.5 * Math.PI);
        ctx.arc(14, 10, capsuleHeight / 2, 1.5 * Math.PI, 0.5 * Math.PI);
        ctx.closePath();
        break;

      default:
        ctx.arc(10, 10, 8, 0, 2 * Math.PI);
    }

    ctx.fill();
  }

  return canvas.toDataURL();
};

