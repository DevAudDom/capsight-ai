// Shared TypeScript interfaces & schema definition for Pitch Deck Grader

export interface GradingResult {
  run_id: string;
  filename: string;
  overall_score: number; // 0-100
  scores: {
    problem_solution_fit: number;
    market_potential: number;
    business_model_strategy: number;
    team_strength: number;
    financials_and_traction: number;
    communication: number;
  };
  summaries: {
    problem: string;
    solution: string;
    market: string;
    team: string;
    traction: string;
  };
  suggestions: string[];
  red_flags: string[];
  verdict: "Invest" | "Hold" | "Pass";
  timestamp: string; // ISO
}

export interface FallbackGradingResult extends GradingResult {}

export const gradingJsonSchema = {
  type: "object",
  required: [
    "run_id","filename","overall_score","scores","summaries","suggestions","red_flags","verdict","timestamp"
  ],
  properties: {
    run_id: { type: "string" },
    filename: { type: "string" },
    overall_score: { type: "number" },
    scores: {
      type: "object",
      required: [
        "problem_solution_fit","market_potential","business_model_strategy","team_strength","financials_and_traction","communication"
      ],
      properties: {
        problem_solution_fit: { type: "number" },
        market_potential: { type: "number" },
        business_model_strategy: { type: "number" },
        team_strength: { type: "number" },
        financials_and_traction: { type: "number" },
        communication: { type: "number" }
      }
    },
    summaries: {
      type: "object",
      required: ["problem","solution","market","team","traction"],
      properties: {
        problem: { type: "string" },
        solution: { type: "string" },
        market: { type: "string" },
        team: { type: "string" },
        traction: { type: "string" }
      }
    },
    suggestions: { type: "array", items: { type: "string" } },
    red_flags: { type: "array", items: { type: "string" } },
    verdict: { type: "string", enum: ["Invest","Hold","Pass"] },
    timestamp: { type: "string" }
  },
  additionalProperties: false
} as const;
