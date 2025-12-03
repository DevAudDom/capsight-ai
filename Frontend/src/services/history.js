// History management for pitch deck grading results
// Uses localStorage to persist grading history across sessions

const HISTORY_KEY = 'deck_grading_history';

/**
 * Save a grading result to history
 * @param {Object} result - The grading result to save
 */
export function saveToHistory(result) {
  const history = getHistory();
  history.unshift(result);

  // Keep only last 50 entries
  const trimmedHistory = history.slice(0, 50);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
}

/**
 * Get all grading history
 * @returns {Array} Array of grading results
 */
export function getHistory() {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Get a specific history item by timestamp
 * @param {string} timestamp - The timestamp ID of the result
 * @returns {Object|null} The grading result or null if not found
 */
export function getHistoryItem(timestamp) {
  const history = getHistory();
  return history.find((item) => item.timestamp === timestamp) || null;
}

/**
 * Clear all history
 */
export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
