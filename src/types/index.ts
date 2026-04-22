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

export interface ROITherapyLine {
  key: string;
  label: string;
  icon: string;
  color: string;
  utilizationPct: number;    // % of members currently using (0–100)
  annualCostPerUser: number; // avg annual cost per member using (USD)
  reductionPct: number;      // expected % reduction from BrainyAct (0–100)
}

export interface ROIInputs {
  memberCount: number;
  programCostPerMember: number;
  therapyLines: ROITherapyLine[];
}

export interface ROIResults {
  totalSavings: number;
  programCost: number;
  netSavings: number;
  roiMultiple: number;
  perMemberSavings: number;
  lineBreakdown: { key: string; label: string; savings: number; color: string }[];
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

export * from './adaptive';
