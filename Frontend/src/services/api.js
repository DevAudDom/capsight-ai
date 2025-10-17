// Centralized API utilities.
// In a larger app, create per-domain modules (e.g., usersApi, reportsApi).

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';

/**
 * Example: fetch a simple hello message from FastAPI backend.
 * - Uses the Fetch API with async/await and basic error handling.
 * - In real apps, consider wrapping fetch to handle auth, retries, etc.
 */
export async function getHello() {
  const response = await fetch(`${API_BASE}/api/hello`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!response.ok) {
    // Convert non-2xx responses into thrown Errors for the UI to handle.
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}


