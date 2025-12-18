import React from 'react';
import './ControlPanel.css';

function ControlPanel({ filters, onFilterChange, onReset, onExport }) {
  return (
    <section className="control-panel" id="overview">
      <div className="panel-header">
        <h2>🎛️ Control Panel</h2>
        <p>Filter and explore data dynamically</p>
      </div>
      
      <div className="controls-grid">
        <div className="control-item">
          <label>City</label>
          <select 
            className="control-select"
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
          >
            <option value="all">All Cities</option>
            <option value="las-vegas">Las Vegas, NV</option>
            <option value="phoenix">Phoenix, AZ</option>
            <option value="charlotte">Charlotte, NC</option>
            <option value="pittsburgh">Pittsburgh, PA</option>
            <option value="toronto">Toronto, ON</option>
            <option value="montreal">Montreal, QC</option>
          </select>
        </div>

        <div className="control-item">
          <label>Category</label>
          <select 
            className="control-select"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="restaurants">Restaurants</option>
            <option value="shopping">Shopping</option>
            <option value="beauty">Beauty & Spas</option>
            <option value="home">Home Services</option>
            <option value="automotive">Automotive</option>
            <option value="health">Health & Medical</option>
          </select>
        </div>

        <div className="control-item">
          <label>Min Rating</label>
          <select 
            className="control-select"
            value={filters.minRating}
            onChange={(e) => onFilterChange('minRating', e.target.value)}
          >
            <option value="0">All Ratings</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>

        <div className="control-item">
          <label>Time Range</label>
          <select 
            className="control-select"
            value={filters.timeRange}
            onChange={(e) => onFilterChange('timeRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="year">Last Year</option>
            <option value="6months">Last 6 Months</option>
            <option value="3months">Last 3 Months</option>
          </select>
        </div>

        <div className="control-item full-width">
          <label>Search Business</label>
          <input 
            type="text" 
            className="control-input" 
            placeholder="Search by business name..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        <button className="btn-reset" onClick={onReset}>
          Reset Filters
        </button>
        
        <button className="btn-export" onClick={onExport}>
          📥 Export Report
        </button>
      </div>
    </section>
  );
}

export default ControlPanel;