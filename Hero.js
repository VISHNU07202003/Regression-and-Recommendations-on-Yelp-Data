import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Business Intelligence Dashboard</h1>
        <p className="hero-subtitle">
          Comprehensive analytics platform visualizing insights from 8M+ reviews across 180K+ businesses
        </p>
        
        <div className="hero-highlights">
          <div className="highlight-card">
            <div className="highlight-icon">⚡</div>
            <div className="highlight-content">
              <strong>&lt;200ms</strong>
              <span>Response Time</span>
            </div>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">📊</div>
            <div className="highlight-content">
              <strong>40% ↑</strong>
              <span>Engagement Increase</span>
            </div>
          </div>
          
          <div className="highlight-card">
            <div className="highlight-icon">🚀</div>
            <div className="highlight-content">
              <strong>60% ↓</strong>
              <span>Load Time Reduction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;