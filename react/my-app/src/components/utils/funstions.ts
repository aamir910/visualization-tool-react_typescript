export const renderLegendShape = (
    type: string,
    color: string,
    isNode: boolean = true
  ) => {
    console.log(type , "here is the type there ")
    const shapeSize = 10; // Adjust size as needed
    const canvas = document.createElement("canvas");
    canvas.width = shapeSize * 2;
    canvas.height = shapeSize * 2;
    const ctx = canvas.getContext("2d");
  
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
  
      if (type === "entity_2_type" && isNode) {
        // Draw a triangle for entity_1_type
        ctx.beginPath();
        ctx.moveTo(shapeSize, 0); // Top vertex
        ctx.lineTo(0, shapeSize * 2); // Bottom left
        ctx.lineTo(shapeSize * 2, shapeSize * 2); // Bottom right
        ctx.closePath();
        ctx.fill();
      } else if (isNode) {
        // Draw a circle for other node types
        ctx.beginPath();
        ctx.arc(shapeSize, shapeSize, shapeSize / 2, 0, 2 * Math.PI, false);
        ctx.fill();
      } else {
        // Draw a line for links
        ctx.beginPath();
        ctx.moveTo(0, shapeSize);
        ctx.lineTo(shapeSize * 2, shapeSize);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
    return canvas.toDataURL();
  }; 


  