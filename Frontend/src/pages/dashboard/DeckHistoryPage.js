import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, clearHistory } from '../../services/history';

function DeckHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearDialog, setShowClearDialog] = useState(false);

  useEffect(() => {
    const loadHistory = () => {
      const data = getHistory();
      setHistory(data);
      setLoading(false);
    };
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowClearDialog(false);
  };

  const getVerdictClass = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'strong':
        return 'verdict-strong';
      case 'moderate':
        return 'verdict-moderate';
      case 'weak':
        return 'verdict-weak';
      default:
        return 'verdict-default';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="history-loading">
        <p className="muted">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1>Deck History</h1>
          <p className="muted">View all your previously graded pitch decks</p>
        </div>
        {history.length > 0 && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowClearDialog(true)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Clear History
          </button>
        )}
      </div>

      {/* Clear History Dialog */}
      {showClearDialog && (
        <div className="dialog-overlay" onClick={() => setShowClearDialog(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>Clear all history?</h2>
              <p className="muted">
                This will permanently delete all your grading history. This action cannot be
                undone.
              </p>
            </div>
            <div className="dialog-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowClearDialog(false)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleClearHistory}>
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="card empty-state">
          <svg
            className="empty-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h3>No decks graded yet</h3>
          <p className="muted">
            Upload your first pitch deck to get started with AI-powered grading and feedback.
          </p>
          <Link to="/dashboard/upload" className="btn btn-primary">
            Upload First Deck
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <Link
              key={item.timestamp}
              to={`/dashboard/results?id=${item.timestamp}`}
              className="history-item"
            >
              <div className="card history-card">
                <div className="history-card-content">
                  {/* Left side - File info */}
                  <div className="file-info-section">
                    <div className="file-info-row">
                      <svg
                        className="file-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div className="file-details">
                        <h3 className="file-name">{item.filename}</h3>
                        <div className="file-date">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Scores and verdict */}
                  <div className="scores-section">
                    {/* Overall Score */}
                    <div className="score-display">
                      <svg
                        className={`score-icon ${getScoreColor(item.scores.overall_score)}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                      <div className="score-info">
                        <div className="score-label muted">Overall Score</div>
                        <div className={`score-number ${getScoreColor(item.scores.overall_score)}`}>
                          {item.scores.overall_score}
                        </div>
                      </div>
                    </div>

                    {/* Verdict Badge */}
                    <span className={`verdict-badge ${getVerdictClass(item.verdict)}`}>
                      {item.verdict}
                    </span>

                    {/* Red flags indicator */}
                    {item.red_flags.length > 0 && (
                      <div className="red-flags-indicator">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{item.red_flags.length}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick stats */}
                <div className="quick-stats">
                  {[
                    { label: 'Problem-Solution', value: item.scores.problem_solution_fit },
                    { label: 'Market', value: item.scores.market_potential },
                    { label: 'Business Model', value: item.scores.business_model_strategy },
                    { label: 'Team', value: item.scores.team_strength },
                    { label: 'Financials', value: item.scores.financials_and_traction },
                    { label: 'Communication', value: item.scores.communication },
                  ].map((stat) => (
                    <div key={stat.label} className="stat-item">
                      <div className="stat-label muted">{stat.label}</div>
                      <div className={`stat-value ${getScoreColor(stat.value)}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DeckHistoryPage;
