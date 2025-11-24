import { GradingResult, gradingJsonSchema } from './types';
import { randomUUID } from 'crypto';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface LlmOptions {
  provider: 'openai'; // extend later
  apiKey: string;
}

const SYSTEM_PROMPT = `You are PitchGradeLiteV1.
Return ONLY strict JSON matching the provided schema.
Scores are 0-100 integers. Use conservative scoring.
If input is [[UNREADABLE_DECK]] produce verdict "Hold" with red flag.
No prose outside JSON.`;

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
    if (!obj.verdict) obj.verdict = 'Hold';
    return obj as GradingResult;
  } catch (e: any) {
    return fallback(filename, run_id, timestamp, 'JSON parse error: ' + e.message);
  }
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
    verdict: 'Hold',
    timestamp
  };
}
