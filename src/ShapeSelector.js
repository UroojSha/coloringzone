import React from 'react';

function ShapeSelector({ onSelectShape }) {
  const shapes = ['Pen', 'Circle', 'Rectangle', 'Star']; // Add more shapes as needed

  return (
    <select onChange={(e) => onSelectShape(e.target.value)}>
      {shapes.map((shape, index) => (
        <option key={index} value={shape.toLowerCase()}>
          {shape}
        </option>
      ))}
    </select>
  );
}

export default ShapeSelector;
