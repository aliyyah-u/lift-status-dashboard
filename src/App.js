import './App.css';
import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";

function App() {
  const [liftData, setLiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch TfL lift disruption data
  useEffect(() => {
    const fetchLiftData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.tfl.gov.uk/Disruptions/Lifts/');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLiftData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLiftData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchLiftData, 300000);
    return () => clearInterval(interval);
  }, []);

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

  const messageStyle = {
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9',
    borderLeft: '4px solid #e32119',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.5'
  };

  return (
    <div style={appStyle}>
      <h1 style={titleStyle}>TfL Lift Disruptions Dashboard</h1>
      
      {loading && <p>Loading lift disruption data...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}

      <GridLayout
        className="layout"
        layout={layout}
        cols={4}
        rowHeight={200}
        width={1200}
        isDraggable={true}
        isResizable={true}
      >
        <div key="lift-status" style={tileStyle}>
          <h3 style={tileHeaderStyle}>Current Lift Status</h3>
          <div>
            {liftData.length === 0 && !loading && (
              <p>No lift disruptions reported</p>
            )}
            {liftData.map((disruption, index) => (
              <div key={index} style={messageStyle}>
                {disruption.message}
              </div>
            ))}
          </div>
        </div>
      </GridLayout>
    </div>
  );
}

export default App;