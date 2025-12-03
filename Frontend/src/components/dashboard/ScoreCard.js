import React from 'react';

function ScoreCard({ title, score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'progress-high';
    if (score >= 60) return 'progress-medium';
    return 'progress-low';
  };

  return (
    <div className="score-card">
      <div className="score-card-content">
        <div className="score-header">
          <h3 className="score-title">{title}</h3>
          <span className={`score-value ${getScoreColor(score)}`}>{score}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar ${getProgressColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ScoreCard;
