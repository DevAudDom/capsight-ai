import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { gradeRouter } from './routes/grade';
import { listRuns, getRun } from './store';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type','Accept']
}));
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[req] ${req.method} ${req.url}`);
  next();
});

app.use('/api', gradeRouter);

app.get('/api/runs', (req, res) => {
  return res.json(listRuns(10));
});

app.get('/api/runs/:id', (req, res) => {
  const run = getRun(req.params.id);
  if (!run) return res.status(404).json({ error: 'Not found' });
  return res.json(run);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error middleware
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[startup] Pitch Deck Grader listening on port ${PORT}`);
});
