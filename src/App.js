import React, { useState } from 'react';
import Canvas from "./Canvas";
import './App.css';

function App() {
  // State for the selected color
  const [selectedColor, setSelectedColor] = useState('black');

  // Array of available colors
  const colors = ['black', 'red', 'green', 'blue', 'yellow']; // Add more colors if needed

  // Function to handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  // State for the brush size
  const [brushSize, setBrushSize] = useState(5); // Initial brush size

  return (
    <div className="App">
      <h1>Welcome to Splash Coloring Zone!</h1>
      
      {/* Canvas component */}
      <Canvas selectedColor={selectedColor} brushSize={brushSize} colors={colors} handleColorChange={handleColorChange} />
      
      {/* Brush controls within Canvas */}
      <div className="brush-controls">
       
        <div className="brush-sizes">
          {/* Button to set small brush size */}
          <button onClick={() => setBrushSize(5)} style={{ fontSize: '20px' }}>◯</button> {/* Small */}
          
          {/* Button to set medium brush size */}
          <button onClick={() => setBrushSize(7)} style={{ fontSize: '25px' }}>◯</button> {/* Medium */}
          
          {/* Button to set large brush size */}
          <button onClick={() => setBrushSize(10)} style={{ fontSize: '30px' }}>◯</button> {/* Large */}
        </div>
      </div>
    </div>
  );
}

export default App;
