import React from 'react';
import './LoadingOverlay.css';

function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-ring"></div>
        </div>
        <h2>Loading Analytics Dashboard...</h2>
        <p>Fetching data from 8M+ reviews</p>
        <div className="loading-stats">
          <span className="loading-stat">📊 Processing data</span>
          <span className="loading-stat">🔄 Building visualizations</span>
          <span className="loading-stat">⚡ Optimizing performance</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;