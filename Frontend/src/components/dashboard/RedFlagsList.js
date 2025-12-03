import React from 'react';

function RedFlagsList({ redFlags }) {
  return (
    <ul className="red-flags-list">
      {redFlags.map((flag, index) => (
        <li key={index} className="red-flag-item">
          <svg
            className="icon-alert"
            width="20"
            height="20"
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
          <span className="red-flag-text">{flag}</span>
        </li>
      ))}
    </ul>
  );
}

export default RedFlagsList;
