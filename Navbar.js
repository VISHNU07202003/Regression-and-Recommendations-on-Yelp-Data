import React from 'react';
import './Navbar.css';

function Navbar({ stats }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="#d32323"/>
            <path d="M20 8 L24 16 L32 17 L26 23 L28 31 L20 26 L12 31 L14 23 L8 17 L16 16 Z" fill="white"/>
          </svg>
          <span>Yelp Analytics</span>
        </div>
        
        <div className="nav-menu">
          <a href="#overview" className="nav-link">Overview</a>
          <a href="#reviews" className="nav-link">Reviews</a>
          <a href="#businesses" className="nav-link">Businesses</a>
          <a href="#users" className="nav-link">Users</a>
          <a href="#trends" className="nav-link">Trends</a>
        </div>
        
        <div className="nav-stats">
          {stats && (
            <>
              <span className="stat-badge">{(stats.totalReviews / 1000000).toFixed(1)}M Reviews</span>
              <span className="stat-badge">{(stats.totalUsers / 1000000).toFixed(1)}M Users</span>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;