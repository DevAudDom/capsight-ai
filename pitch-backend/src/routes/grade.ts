import { Router } from 'express';
import multer from 'multer';
import path from 'path';
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
      saveRun(result);
      return res.status(200).json(result);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });
});
