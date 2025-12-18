import React from 'react';
import './KPICards.css';

function KPICards({ stats }) {
  if (!stats) return null;

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <section className="kpi-section">
      <div className="kpi-card red">
        <div className="kpi-icon">📝</div>
        <div className="kpi-content">
          <h3>Total Reviews</h3>
          <p className="kpi-value">{formatNumber(stats.totalReviews)}</p>
          <span className="kpi-change up">↑ {stats.trends.reviews} vs last month</span>
        </div>
      </div>

      <div className="kpi-card orange">
        <div className="kpi-icon">⭐</div>
        <div className="kpi-content">
          <h3>Average Rating</h3>
          <p className="kpi-value">{stats.avgRating.toFixed(2)}</p>
          <span className="kpi-change stable">→ {stats.trends.rating}</span>
        </div>
      </div>

      <div className="kpi-card blue">
        <div className="kpi-icon">🏪</div>
        <div className="kpi-content">
          <h3>Active Businesses</h3>
          <p className="kpi-value">{formatNumber(stats.totalBusinesses)}</p>
          <span className="kpi-change up">↑ {stats.trends.businesses} growth</span>
        </div>
      </div>

      <div className="kpi-card green">
        <div className="kpi-icon">👥</div>
        <div className="kpi-content">
          <h3>Active Users</h3>
          <p className="kpi-value">{formatNumber(stats.totalUsers)}</p>
          <span className="kpi-change up">↑ {stats.trends.users} engagement</span>
        </div>
      </div>
    </section>
  );
}

export default KPICards;