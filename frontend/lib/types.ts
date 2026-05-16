export type Difficulty = "Easy" | "Medium" | "Hard" | "Nightmare";
export type BurnoutLevel = "Low" | "Medium" | "High" | "Extreme";

export interface TechBreakdown {
  frontend: Difficulty;
  backend: Difficulty;
  ai_system: Difficulty;
  scaling: Difficulty;
  security: Difficulty;
}

export interface InvestorReactionT {
  persona: string;
  emoji: string;
  reaction: string;
}

export interface AnalyzeResponse {
  idea: string;
  yc_probability: number;
  technical_difficulty: Difficulty;
  tech_breakdown: TechBreakdown;
  burnout_risk: number;
  burnout_level: BurnoutLevel;
  monetization_difficulty: number;
  hype_score: number;
  startup_type: string;
  sleeps_per_week: number;
  competitors: string[];
  revenue_models: string[];
  first_year_revenue: string;
  market_size: string;
  market_size_note: string;
  investor_reactions: InvestorReactionT[];
  final_verdict: string;
}
