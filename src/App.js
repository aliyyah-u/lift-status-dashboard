import './App.css';
import { useState } from "react";
import GridLayout from "react-grid-layout";

function App() {
  // Define the layout configuration
  const layout = [
    { i: 'lift-status', x: 0, y: 0, w: 2, h: 2 },      // Main lift status widget
  ];

  const appStyle = {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  };

  const titleStyle = {
    color: '#1c3f94',
    marginBottom: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const tileStyle = {
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'auto'
  };

  const tileHeaderStyle = {
    marginTop: 0,
    color: '#1c3f94',
    borderBottom: '2px solid #1c3f94',
    paddingBottom: '10px',
    marginBottom: '15px'
  };

  return (
    <div style={appStyle}>
      <h1 style={titleStyle}>TfL Lift Disruptions Dashboard</h1>
      <GridLayout
        className="layout"
        layout={layout}
        cols={4}
        rowHeight={200}
        width={1200}
        isDraggable={true}
        isResizable={true}
      >
        <div key="current-lift-status" style={tileStyle}>
          <h3 style={tileHeaderStyle}>Current Lift Status</h3>
          <div>Current lift disruptions will appear here</div>
        </div>
      </GridLayout>
    </div>
  );
}

export default App;