import React from 'react';
import './SentimentAnalysis.css';

function SentimentAnalysis({ data }) {
  if (!data) return null;

  const renderWordCloud = (keywords, type) => {
    return (
      <div className={`word-cloud ${type}`}>
        {keywords.map((word, index) => (
          <span
            key={index}
            className="word-item"
            style={{
              fontSize: `${word.weight * 2 + 12}px`,
              opacity: word.weight / 10
            }}
          >
            {word.word}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="viz-card full-width" id="trends">
      <div className="card-header">
        <div className="header-left">
          <h2>💬 Review Sentiment Analysis</h2>
          <p>Most frequent words in positive vs negative reviews</p>
        </div>
      </div>
      <div className="card-body">
        <div className="sentiment-overview">
          <div className="sentiment-stat positive">
            <div className="stat-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e8e8e8" strokeWidth="8"/>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#00a699" 
                  strokeWidth="8"
                  strokeDasharray={`${data.positive.percentage * 2.827} 282.7`}
                  strokeDashoffset="70.675"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="24" fontWeight="700" fill="#00a699">
                  {data.positive.percentage}%
                </text>
              </svg>
            </div>
            <h3>Positive</h3>
            <p>{data.positive.count.toLocaleString()} reviews</p>
          </div>

          <div className="sentiment-stat neutral">
            <div className="stat-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e8e8e8" strokeWidth="8"/>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#ff9500" 
                  strokeWidth="8"
                  strokeDasharray={`${data.neutral.percentage * 2.827} 282.7`}
                  strokeDashoffset="70.675"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="24" fontWeight="700" fill="#ff9500">
                  {data.neutral.percentage}%
                </text>
              </svg>
            </div>
            <h3>Neutral</h3>
            <p>{data.neutral.count.toLocaleString()} reviews</p>
          </div>

          <div className="sentiment-stat negative">
            <div className="stat-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e8e8e8" strokeWidth="8"/>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#e74c3c" 
                  strokeWidth="8"
                  strokeDasharray={`${data.negative.percentage * 2.827} 282.7`}
                  strokeDashoffset="70.675"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy=".3em" fontSize="24" fontWeight="700" fill="#e74c3c">
                  {data.negative.percentage}%
                </text>
              </svg>
            </div>
            <h3>Negative</h3>
            <p>{data.negative.count.toLocaleString()} reviews</p>
          </div>
        </div>

        <div className="sentiment-words">
          <div className="word-section positive-section">
            <h3>✅ Positive Keywords</h3>
            {renderWordCloud(data.positive.keywords, 'positive')}
          </div>

          <div className="word-section negative-section">
            <h3>❌ Negative Keywords</h3>
            {renderWordCloud(data.negative.keywords, 'negative')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SentimentAnalysis;