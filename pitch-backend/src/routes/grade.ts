import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import axios from 'axios';
import { extractText } from '../extract';
import { gradeDeckText } from '../llm';
import { saveRun } from '../store';
import { GradingResult } from '../types';

const upload = multer({ dest: path.join(process.cwd(), 'uploads_tmp') });

export const gradeRouter = Router();

gradeRouter.post('/grade', async (req, res) => {
  upload.single('file')(req, res, async (err: any) => {
    if (err) return res.status(400).json({ error: 'Upload failed', detail: err.message });
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const text = await extractText(file.path, file.originalname);
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
      
      const result: GradingResult = await gradeDeckText(file.originalname, text, { provider: 'openai', apiKey });
      
      // Post to Python backend for database storage
      const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:8000';
      const userId = 1; // Get from request body or auth token
      
      try {
        console.log("Making post request to python")
        await axios.post(`${pythonBackendUrl}/api/deck`, {
          user_id: userId,
          filename: result.filename,
          timestamp: result.timestamp,
          verdict: result.verdict,
          scores: {
            overall_score: result.overall_score,
            problem_solution_fit: result.scores.problem_solution_fit,
            market_potential: result.scores.market_potential,
            business_model_strategy: result.scores.business_model_strategy,
            team_strength: result.scores.team_strength,
            financials_and_traction: result.scores.financials_and_traction,
            communication: result.scores.communication
          },
          suggestions: result.suggestions,
          red_flags: result.red_flags
        });
        console.log('[grade] Successfully saved to Python backend database');
      } catch (dbError: any) {
        console.error('[grade] Failed to save to Python backend:', dbError.message);
        // Don't fail the whole request if DB save fails - still return result to user
      }
      
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });
});
