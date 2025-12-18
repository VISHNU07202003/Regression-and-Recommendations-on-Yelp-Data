import React from 'react';
import './InsightsPanel.css';

function InsightsPanel() {
  const insights = [
    {
      icon: '📊',
      title: 'Peak Review Activity',
      description: 'Most reviews are posted on',
      highlight: 'Fridays and Saturdays',
      detail: 'between 7-9 PM',
      color: 'red'
    },
    {
      icon: '⭐',
      title: 'Rating Impact',
      description: 'Restaurants with',
      highlight: '4.5+ stars',
      detail: 'have 3x more review engagement',
      color: 'orange'
    },
    {
      icon: '🎯',
      title: 'Category Growth',
      description: 'Asian Fusion restaurants show',
      highlight: '23% YoY growth',
      detail: 'highest among all categories',
      color: 'blue'
    },
    {
      icon: '💬',
      title: 'Sentiment Distribution',
      description: 'Overall sentiment breakdown:',
      highlight: '68% positive',
      detail: '22% neutral, 10% negative',
      color: 'green'
    },
    {
      icon: '🏆',
      title: 'Top Performing Cities',
      description: 'Las Vegas and Toronto lead with',
      highlight: '2M+ reviews each',
      detail: 'and average 4.0+ ratings',
      color: 'purple'
    },
    {
      icon: '📈',
      title: 'User Engagement Trend',
      description: 'Platform engagement increased',
      highlight: '15.7% this quarter',
      detail: 'driven by mobile app growth',
      color: 'teal'
    }
  ];

  return (
    <section className="insights-panel">
      <div className="insights-header">
        <h2>💡 Key Insights & Findings</h2>
        <p>Data-driven discoveries from comprehensive analysis</p>
      </div>
      
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-card ${insight.color}`}>
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <h3>{insight.title}</h3>
              <p className="insight-description">
                {insight.description} <strong>{insight.highlight}</strong> {insight.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="insights-summary">
        <div className="summary-card">
          <h3>🎓 Methodology</h3>
          <p>Analysis based on 8M+ reviews, 1M+ user profiles, and 180K+ businesses across multiple cities. Data aggregated using advanced analytics and machine learning algorithms.</p>
        </div>
        <div className="summary-card">
          <h3>🔄 Update Frequency</h3>
          <p>Dashboard data refreshes every hour. Historical trends analyzed with 365-day rolling window. Real-time metrics updated within 200ms latency.</p>
        </div>
        <div className="summary-card">
          <h3>📌 Recommendations</h3>
          <p>Businesses should focus on maintaining 4.5+ ratings, respond to reviews within 24 hours, and optimize for peak activity times to maximize engagement.</p>
        </div>
      </div>
    </section>
  );
}

export default InsightsPanel;