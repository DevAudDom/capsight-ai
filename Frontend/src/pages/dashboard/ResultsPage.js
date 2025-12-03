import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getHistoryItem } from '../../services/history';
import ScoreCard from '../../components/dashboard/ScoreCard';
import SuggestionsList from '../../components/dashboard/SuggestionsList';
import RedFlagsList from '../../components/dashboard/RedFlagsList';

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const item = getHistoryItem(id);
      setResult(item);
    }
    setLoading(false);
  }, [searchParams]);

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
      <div className="results-loading">
        <p className="muted">Loading results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-empty">
        <p className="muted">No results found</p>
        <Link to="/dashboard/upload" className="btn btn-outline">
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
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="results-page">
      {/* Header */}
      <div className="results-header">
        <div>
          <div className="back-button-row">
            <Link to="/dashboard/upload" className="btn btn-ghost btn-sm">
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </Link>
          </div>
          <h1>Grading Results</h1>
          <div className="results-meta">
            <div className="meta-item">
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {result.filename}
            </div>
            <div className="meta-item">
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {formatDate(result.timestamp)}
            </div>
          </div>
        </div>
        <button className="btn btn-outline btn-sm">
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
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Report
        </button>
      </div>

      {/* Verdict & Overall Score */}
      <div className="card verdict-card">
        <div className="verdict-content">
          <div className="verdict-item">
            <p className="verdict-label muted">Verdict</p>
            <span className={`verdict-badge ${getVerdictClass(result.verdict)}`}>
              {result.verdict}
            </span>
          </div>
          <div className="verdict-divider" />
          <div className="verdict-item">
            <p className="verdict-label muted">Overall Score</p>
            <div className="overall-score">
              {result.scores.overall_score}
              <span className="score-suffix muted">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="score-breakdown-section">
        <h2>Score Breakdown</h2>
        <div className="score-grid">
          <ScoreCard
            title="Problem-Solution Fit"
            score={result.scores.problem_solution_fit}
          />
          <ScoreCard
            title="Market Potential"
            score={result.scores.market_potential}
          />
          <ScoreCard
            title="Business Model"
            score={result.scores.business_model_strategy}
          />
          <ScoreCard
            title="Team Strength"
            score={result.scores.team_strength}
          />
          <ScoreCard
            title="Financials & Traction"
            score={result.scores.financials_and_traction}
          />
          <ScoreCard
            title="Communication"
            score={result.scores.communication}
          />
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="card suggestions-card">
          <div className="card-header">
            <h3 className="card-title">
              <svg
                className="icon-lightbulb"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="9" y1="18" x2="15" y2="18" />
                <line x1="10" y1="22" x2="14" y2="22" />
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
              </svg>
              Suggestions for Improvement
            </h3>
          </div>
          <SuggestionsList suggestions={result.suggestions} />
        </div>
      )}

      {/* Red Flags */}
      {result.red_flags.length > 0 && (
        <div className="card red-flags-card">
          <div className="card-header">
            <h3 className="card-title">
              <svg
                className="icon-alert-triangle"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Red Flags
            </h3>
          </div>
          <RedFlagsList redFlags={result.red_flags} />
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
