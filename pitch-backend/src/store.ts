import { GradingResult } from './types.js';
let mem: GradingResult[] = [];

export function saveRun(result: GradingResult): void {
  mem.unshift(result);
  mem = mem.slice(0, 1000); // cap
}

export function listRuns(limit = 10): { run_id: string; filename: string; verdict: string; overall_score: number; timestamp: string }[] {
  return mem.slice(0, limit).map(r => ({ run_id: r.run_id, filename: r.filename, verdict: r.verdict, overall_score: r.overall_score, timestamp: r.timestamp }));
}

export function getRun(run_id: string): GradingResult | null {
  return mem.find(r => r.run_id === run_id) || null;
}
