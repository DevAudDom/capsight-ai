import React from 'react';

function SuggestionsList({ suggestions }) {
  return (
    <ul className="suggestions-list">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="suggestion-item">
          <svg
            className="icon-check"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="suggestion-text">{suggestion}</span>
        </li>
      ))}
    </ul>
  );
}

export default SuggestionsList;
