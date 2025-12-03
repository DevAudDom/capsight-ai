// Centralized API utilities.
// In a larger app, create per-domain modules (e.g., usersApi, reportsApi).

const API_BASE = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';
const GRADER_BASE = process.env.REACT_APP_GRADER_BASE || 'http://localhost:8080';

// Simple helper to enforce a timeout on fetch
function withTimeout(promise, ms = 8000) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
    promise.then(
      (res) => { clearTimeout(id); resolve(res); },
      (err) => { clearTimeout(id); reject(err); }
    );
  });
}

/**
 * Example: fetch a simple hello message from FastAPI backend.
 * - Uses the Fetch API with async/await and basic error handling.
 * - In real apps, consider wrapping fetch to handle auth, retries, etc.
 */
export async function getHello() {
  const url = `${API_BASE}/api/hello`;
  console.debug('[api] GET', url);
  try {
    const response = await withTimeout(
      fetch(url, { headers: { 'Accept': 'application/json' } })
    );
    if (!response.ok) {
      const text = await response.text();
      console.error('[api] Non-OK response', response.status, text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    const data = await response.json();
    console.debug('[api] Success', data);
    return data;
  } catch (err) {
    console.error('[api] getHello error', err);
    throw err;
  }
}

export async function uploadGrade(file) {
  const form = new FormData();
  form.append('file', file);
  const url = `${GRADER_BASE}/api/grade`;
  const response = await fetch(url, { method: 'POST', body: form });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
  return response.json();
}

/**
 * Upload a pitch deck for grading
 * @param {File} file - The pitch deck file to upload (PDF or PPTX)
 * @returns {Promise<Object>} The grading result
 */
export async function uploadPitchDeck(file) {
  const formData = new FormData();
  formData.append('file', file);

  const url = `${GRADER_BASE}/api/grade`;
  console.debug('[api] POST', url, 'uploading:', file.name);

  try {
    const response = await withTimeout(
      fetch(url, {
        method: 'POST',
        body: formData,
      }),
      30000 // 30 second timeout for file uploads
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('[api] Upload failed', response.status, text);
      throw new Error(`Upload failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    console.debug('[api] Upload success', data);
    return data;
  } catch (err) {
    console.error('[api] uploadPitchDeck error', err);
    throw err;
  }
}


