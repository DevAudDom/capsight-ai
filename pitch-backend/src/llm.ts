import { GradingResult, gradingJsonSchema } from './types';
import { randomUUID } from 'crypto';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface LlmOptions {
  provider: 'openai'; // extend later
  apiKey: string;
}

const SYSTEM_PROMPT = `You are PitchGradeLiteV1, an expert pitch deck evaluator.
Return ONLY strict JSON matching the provided schema.

CRITICAL RULES FOR SCORES:
- ALL score fields MUST be numeric integers (not strings, not words like "Fifty")
- Score range: 0-100 (inclusive)
- Use actual numbers: 50, 75, 85 (NOT "50", NOT "Fifty", NOT "seventy-five")
- overall_score must be calculated as the average of all category scores
- Use conservative but realistic scoring based on the pitch deck content

VERDICT RULES:
- verdict must be one of: "Poor", "Fair", "Good", "Great"
- Poor: overall_score < 50 (significant weaknesses, not recommended)
- Fair: overall_score 50-69 (has potential but major improvements needed)
- Good: overall_score 70-84 (solid opportunity with some refinements needed)
- Great: overall_score 85+ (exceptional opportunity, highly promising)
- Do NOT use investment language (avoid "Invest", "Pass", "Consider")

If input is [[UNREADABLE_DECK]], produce verdict "Fair" with appropriate red flag.
No prose outside JSON. Ensure all numeric fields contain actual numbers.`;

export async function gradeDeckText(filename: string, text: string, opts: LlmOptions): Promise<GradingResult> {
  const run_id = randomUUID();
  const timestamp = new Date().toISOString();

  // Fallback unreadable deck
  const effectiveText = text && text.length >= 500 ? text : '[[UNREADABLE_DECK]]';

  if (opts.provider === 'openai') {
    const client = new OpenAI({ apiKey: opts.apiKey });
    const schema = gradingJsonSchema;

    // Construct tool definition for structured output if model supports; fallback to prompt enforced JSON.
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Filename: ${filename}\nDeck Text:\n${effectiveText}` }
    ];

    // Attempt deterministic completion with structured output
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const baseParams = { model, messages, seed: 42 } as any;
    try {
      const completion = await client.chat.completions.create({
        ...baseParams,
        temperature: 0,
        top_p: 1,
        response_format: { type: 'json_schema', json_schema: { name: 'PitchGradeLiteV1', schema } }
      });
      const raw = completion.choices[0].message?.content || '{}';
      return parseAndFill(raw, filename, run_id, timestamp);
    } catch (err: any) {
      const msg = String(err?.message || '');
      const unsupportedTemp = /Unsupported value: 'temperature'/i.test(msg);
      try {
        const retryParams: any = { ...baseParams };
        if (!unsupportedTemp) {
          retryParams.temperature = 0;
          retryParams.top_p = 1;
        }
        const retry = await client.chat.completions.create(retryParams);
        const raw2 = retry.choices[0].message?.content || '{}';
        return parseAndFill(raw2, filename, run_id, timestamp);
      } catch (finalErr: any) {
        return fallback(filename, run_id, timestamp, 'Schema/LLM failure: ' + finalErr.message);
      }
    }
  }
  throw new Error('Unsupported provider');
}

function parseAndFill(raw: string, filename: string, run_id: string, timestamp: string): GradingResult {
  try {
    const obj = JSON.parse(raw);
    // Basic required field patching if missing
    obj.run_id ||= run_id;
    obj.filename ||= filename;
    obj.timestamp ||= timestamp;
    if (!obj.verdict) obj.verdict = 'Fair';
    
    // Coerce all scores to numbers (in case LLM returns strings or text numbers)
    if (obj.overall_score !== undefined) {
      obj.overall_score = coerceToNumber(obj.overall_score, 0);
    }
    if (obj.scores) {
      obj.scores.problem_solution_fit = coerceToNumber(obj.scores.problem_solution_fit, 0);
      obj.scores.market_potential = coerceToNumber(obj.scores.market_potential, 0);
      obj.scores.business_model_strategy = coerceToNumber(obj.scores.business_model_strategy, 0);
      obj.scores.team_strength = coerceToNumber(obj.scores.team_strength, 0);
      obj.scores.financials_and_traction = coerceToNumber(obj.scores.financials_and_traction, 0);
      obj.scores.communication = coerceToNumber(obj.scores.communication, 0);
    }
    
    return obj as GradingResult;
  } catch (e: any) {
    return fallback(filename, run_id, timestamp, 'JSON parse error: ' + e.message);
  }
}

// Helper to convert string numbers or text to numeric, with bounds checking
function coerceToNumber(value: any, fallback: number): number {
  if (typeof value === 'number') return Math.max(0, Math.min(100, value));
  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (!isNaN(num)) return Math.max(0, Math.min(100, num));
  }
  return fallback;
}

function fallback(filename: string, run_id: string, timestamp: string, reason: string): GradingResult {
  return {
    run_id,
    filename,
    overall_score: 0,
    scores: {
      problem_solution_fit: 0,
      market_potential: 0,
      business_model_strategy: 0,
      team_strength: 0,
      financials_and_traction: 0,
      communication: 0
    },
    summaries: {
      problem: '',
      solution: '',
      market: '',
      team: '',
      traction: ''
    },
    suggestions: [],
    red_flags: [reason],
    verdict: 'Fair',
    timestamp
  };
}
