import React, { useState } from 'react';
import DataCard from '../components/DataCard';
import { uploadGrade } from '../services/api';

function Grade() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    if (!file) { setError('Choose a file first'); return; }
    setLoading(true);
    try {
      const res = await uploadGrade(file);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DataCard title="Pitch Deck Grader">
        <form onSubmit={onSubmit}>
          <input type="file" accept=".pdf,.txt,.doc,.docx,.pptx" onChange={e => setFile(e.target.files[0] || null)} />
          <button type="submit" disabled={!file || loading}>Grade Deck</button>
        </form>
        {loading && <p className="muted">Grading...</p>}
        {error && <p style={{color:'crimson'}}>Error: {error}</p>}
        {result && (
          <pre style={{whiteSpace:'pre-wrap', fontSize:'0.85rem', background:'#f5f5f5', padding:'8px', borderRadius:4}}>
{JSON.stringify(result, null, 2)}
          </pre>
        )}
      </DataCard>
    </div>
  );
}

export default Grade;
