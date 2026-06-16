// ── BrainyAct core types ────────────────────────────────────────────────────

export type Domain = 'Motor' | 'Sensory' | 'Behavior' | 'Communication' | 'Academic' | 'Health';

export type BrainSide = 'Left' | 'Right';

export type PerformanceZone = 'high' | 'medium' | 'low';

export interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  gamerName: string;
  age: number;
  grade: string;
  brainDeficit: BrainSide;
  baselineCount: number;
  playCount: number;
  totalCount: number;
  totalCoins: number;
}

export interface DomainScore {
  domain: Domain;
  score: number;
  maxScore: number;
  percentage: number;
  leftScore: number;
  leftMax: number;
  leftPercentage: number;
  rightScore: number;
  rightMax: number;
  rightPercentage: number;
}

export interface Baseline {
  number: number;
  date: string;
  totalPlayTime: number;
  turtleTime: number;
  brainDeficit: BrainSide;
  domainScores: DomainScore[];
  totalScore: number;
  totalMax: number;
  totalPercentage: number;
  leftTotalScore: number;
  rightTotalScore: number;
}

export interface SessionExercise {
  name: string;
  displayName: string;
  domain: Domain;
  dateTime: string;
  score: number;
  numberCorrect: number;
  numberTotal: number;
  level: number;
  maxScorePossible: number;
  coins: number;
  totalCoins: number;
  percentCorrect: number;
  maxLevelPossible: number;
  levelUpGoal: number;
  levelUpFreq: number;
  consecutiveFreqAchieved: number;
}

export interface Session {
  id: string;
  playNumber: number;
  date: string;
  totalPlayTime: number;
  turtleTimePercent: number;
  exercises: SessionExercise[];
  averagePercent: number;
  totalCoinsSession: number;
}

export interface WeeklyTrend {
  week: string;
  Motor: number;
  Sensory: number;
  Academic: number;
  avgPercent: number;
}

export interface RealLifeImprovement {
  title: string;
  icon: string;
  color: string;
  improvements: string[];
}

// ── ROI Calculator types ─────────────────────────────────────────────────────

export interface TherapyLine {
  key: string;
  label: string;
  color: string;
  utilizationPct: number;    // % of members using this therapy (0–100)
  annualCostPerUser: number; // avg annual cost per user (USD)
  reductionPct: number;      // step-down reduction % applied in Program B (0–100)
}

export interface ProgramAInputs {
  avgDurationYears: number;   // how long members stay in traditional ABA
  churnRatePct: number;       // shown separately, not baked into cohort math
  therapyLines: TherapyLine[];
}

export interface ProgramBInputs {
  pmpm: number;               // BrainyAct cost per member per month
  avgDurationMonths: number;  // how long members are in BrainyAct
  churnRatePct: number;       // shown separately
  continuationPct: [number, number, number]; // % still using ABA: [yr1, yr2, yr3] post-BrainyAct
  therapyLines: TherapyLine[]; // reductionPct applied to continuation cost
}

export interface YearResult {
  year: number;
  activeCohorts: number;  // Program A stacked cohorts
  costA: number;
  costB: number;
  netSavings: number;     // costA - costB
  cumulativeNet: number;
}

export interface FiveYearModel {
  yearlyResults: YearResult[];
  programACost5yr: number;
  programBCost5yr: number;
  netSavings5yr: number;
  roiMultiple: number;        // programACost5yr / programBCost5yr
  returnPerDollar: number;    // netSavings5yr / programBCost5yr
}

// ── Legacy types (kept for backward compat with old components) ─────────────

export interface ReportMetric {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  summary: string;
  tags: string[];
  metrics: ReportMetric[];
}

export type ReportType =
  | 'performance'
  | 'engagement'
  | 'revenue'
  | 'activity'
  | 'compliance';

export type ReportStatus = 'draft' | 'published' | 'archived' | 'pending';

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}
