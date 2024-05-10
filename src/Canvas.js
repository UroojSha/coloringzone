import React, { useRef, useEffect, useState } from 'react';
import './Canvas.css';
import ColorPalette from './ColorPalette';
import ShapeSelector from './ShapeSelector'; // Import the ShapeSelector component

function Canvas({ selectedColor, colors, handleColorChange }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [isErasing, setIsErasing] = useState(false);
  const [selectedShape, setSelectedShape] = useState('pen'); // Default shape is 'pen'
  const [startX, setStartX] = useState(0); // Initialize startX state
  const [startY, setStartY] = useState(0); // Initialize startY state
  const [previousShapes, setPreviousShapes] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    function drawPreviousShapes() {
      previousShapes.forEach((shape) => {
        context.strokeStyle = shape.color;
        context.lineWidth = shape.lineWidth;
        context.beginPath();
        switch (shape.type) {
          case 'pen':
            for (let i = 0; i < shape.points.length - 1; i++) {
              const startPoint = shape.points[i];
              const endPoint = shape.points[i + 1];
              context.moveTo(startPoint.x, startPoint.y);
              context.lineTo(endPoint.x, endPoint.y);
              context.stroke();
            }
            break;
          case 'circle':
            context.arc(shape.startX, shape.startY, shape.radius, 0, 2 * Math.PI);
            context.stroke();
            break;
          case 'rectangle':
            context.rect(shape.startX, shape.startY, shape.width, shape.height);
            context.stroke();
            break;
          default:
            break;
        }
        context.closePath();
      });
    }

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = brushSize;

    function draw(e) {
      const rect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      if (!isDrawing) return;

      if (isErasing) {
        context.clearRect(offsetX - brushSize / 2, offsetY - brushSize / 2, brushSize, brushSize);
      } else {
        context.strokeStyle = isErasing ? '#FFFFFF' : selectedColor;
        context.lineWidth = brushSize;

        switch (selectedShape) {
          case 'pen':
            context.lineTo(offsetX, offsetY);
            context.stroke();
            context.beginPath();
            context.moveTo(offsetX, offsetY);
            break;
          case 'circle':
            drawPreviousShapes();
            const radius = Math.sqrt(Math.pow(offsetX - startX, 2) + Math.pow(offsetY - startY, 2));
            context.beginPath();
            context.arc(startX, startY, radius, 0, 2 * Math.PI);
            context.stroke();
            break;
          case 'rectangle':
            drawPreviousShapes();
            context.beginPath();
            context.rect(startX, startY, offsetX - startX, offsetY - startY);
            context.stroke();
            break;
          default:
            break;
        }
      }
    }

    function startDrawing(e) {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      setStartX(offsetX);
      setStartY(offsetY);
      context.beginPath();
      context.moveTo(offsetX, offsetY);
    }

    function finishDrawing() {
      setIsDrawing(false);
      context.closePath();

      if (!isErasing && selectedShape !== 'pen') {
        const shape = {
          type: selectedShape,
          startX,
          startY,
          radius: Math.sqrt(Math.pow(startX - startX, 2) + Math.pow(startY - startY, 2)),
          width: Math.abs(startX - startX),
          height: Math.abs(startY - startY),
          color: selectedColor,
          lineWidth: brushSize,
        };
        setPreviousShapes(prevShapes => [...prevShapes, shape]);
      }
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', finishDrawing);
    canvas.addEventListener('mouseout', finishDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', finishDrawing);
      canvas.removeEventListener('mouseout', finishDrawing);
    };
  }, [brushSize, isDrawing, isErasing, selectedShape, startX, startY, selectedColor, previousShapes]);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setPreviousShapes([]);
  };

  const handleSaveDrawing = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.png';
    link.click();
  };

  const handleEraserToggle = () => {
    setIsErasing(!isErasing);
  };

  return (
    <div className="canvas-container">
      <canvas
        id="canvas"
        ref={canvasRef}
        className="Canvas"
        width={800}
        height={600}
      ></canvas>
      <div className="buttons">
        <ColorPalette colors={colors} selectedColor={selectedColor} onSelectColor={handleColorChange} />

        <div className="brush-sizes">
          <button onClick={() => setBrushSize(5)} style={{ fontSize: '20px' }}>◯</button>
          <button onClick={() => setBrushSize(7)} style={{ fontSize: '25px' }}>◯</button>
          <button onClick={() => setBrushSize(10)} style={{ fontSize: '30px' }}>◯</button>
        </div>

        <ShapeSelector onSelectShape={setSelectedShape} />

        <button onClick={handleClearCanvas}>🧽</button>
        <button onClick={handleSaveDrawing}>💾</button>
        <button onClick={handleEraserToggle}>{isErasing ? '🖌️ Disable Eraser' : '🚫 Enable Eraser'}</button>
      </div>
    </div>
  );
}

export default Canvas;
