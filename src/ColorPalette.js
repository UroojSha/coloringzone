import React from 'react';
import './ColorPalette.css';

// Mapping of colors to corresponding pencil icons
const colorPencilIcons = {
  black: '⚫️',
  red: '🔴',
  green: '🟢',
  blue: '🔵',
  yellow: '🟡',
};

function ColorPalette({ colors, onSelectColor }) {
  return (
    <div className="ColorPalette">
      {colors.map((color, index) => (
        <div
          key={index}
          className="color"
          style={{
            backgroundColor: color,
            fontSize: '24px', // Adjust the size of the color pencil
            margin: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onClick={() => onSelectColor(color)}
        >
          {colorPencilIcons[color]} {/* Get the corresponding color pencil icon */}
        </div>
      ))}
    </div>
  );
}

export default ColorPalette;
