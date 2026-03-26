import { Domain, PerformanceZone, ProgramAInputs, ProgramBInputs, FiveYearModel, YearResult, AutismLevel } from '../types';

// ── Domain metadata ──────────────────────────────────────────────────────────

export const getDomainColor = (domain: Domain): string => {
  switch (domain) {
    case 'Motor':         return '#6366F1';
    case 'Sensory':       return '#3B82F6';
    case 'Behavior':      return '#F59E0B';
    case 'Communication': return '#10B981';
    case 'Academic':      return '#8B5CF6';
    case 'Health':        return '#EC4899';
    default:              return '#6B7280';
  }
};

export const getDomainIcon = (domain: Domain): string => {
  switch (domain) {
    case 'Motor':         return 'body';
    case 'Sensory':       return 'eye';
    case 'Behavior':      return 'heart';
    case 'Communication': return 'chatbubbles';
    case 'Academic':      return 'school';
    case 'Health':        return 'medkit';
    default:              return 'ellipse';
  }
};

export const DOMAINS: Domain[] = [
  'Motor', 'Sensory', 'Behavior', 'Communication', 'Academic', 'Health',
];

// ── Performance zones ────────────────────────────────────────────────────────
// Lower % = better (fewer symptoms)

export const getZone = (pct: number): PerformanceZone => {
  if (pct < 25)  return 'high';
  if (pct < 50)  return 'medium';
  return 'low';
};

export const getZoneColor = (zone: PerformanceZone): string => {
  switch (zone) {
    case 'high':   return '#10B981'; // green — typical range
    case 'medium': return '#F59E0B'; // amber — minimal weakness
    case 'low':    return '#EF4444'; // red   — moderate/severe weakness
  }
};

export const getZoneLabel = (zone: PerformanceZone): string => {
  switch (zone) {
    case 'high':   return 'Typical Range';
    case 'medium': return 'Mild Weakness';
    case 'low':    return 'Area of Focus';
  }
};

export const getZoneShort = (zone: PerformanceZone): string => {
  switch (zone) { case 'high': return 'HIGH'; case 'medium': return 'MED'; case 'low': return 'LOW'; }
};

// ── Exercise helpers ─────────────────────────────────────────────────────────

export const getPctColor = (pct: number): string => {
  if (pct >= 80) return '#10B981';
  if (pct >= 60) return '#F59E0B';
  return '#EF4444';
};

// ── Formatting ───────────────────────────────────────────────────────────────

export const formatDate = (dateString: string): string => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatDateShort = (dateString: string): string => {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatNumber = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};

// ── Progress calculation ─────────────────────────────────────────────────────
// Returns % reduction (positive = improvement, negative = decline)

export const calcImprovement = (before: number, after: number): number => {
  if (before === 0) return 0;
  return Math.round(((before - after) / before) * 100);
};

export const calcPointChange = (before: number, after: number): number =>
  Math.round((before - after) * 10) / 10;

// ── ROI 5-year model ──────────────────────────────────────────────────────────
//
// Program A (Behavioral Care): new cohort of N members enrolled every year,
// each cohort stays for avgDurationYears. Costs stack year over year until
// cohorts start aging out.
//
// Program B (BrainyAct): new cohort enrolled every year, completes care in
// avgDurationMonths. After graduation, a shrinking % continue to ABA therapy
// at step-down (reduced) utilization rates for up to 3 years.

export const calcFiveYearModel = (
  membersPerYear: number,
  programA: ProgramAInputs,
  programB: ProgramBInputs,
): FiveYearModel => {
  // Per-member-per-year therapy cost for Program A (no reduction)
  const costPerMemberA = programA.therapyLines.reduce(
    (sum, l) => sum + (l.utilizationPct / 100) * l.annualCostPerUser, 0,
  );

  // Per-member-per-year continuation cost for Program B (reduction applied)
  const costPerMemberBCont = programB.therapyLines.reduce(
    (sum, l) => sum + (l.utilizationPct / 100) * l.annualCostPerUser * (1 - l.reductionPct / 100), 0,
  );

  // BrainyAct cost for one cohort for the duration of care
  const brainyActCostPerCohort = membersPerYear * programB.pmpm * programB.avgDurationMonths;

  // Number of years a Program A cohort is active (round to nearest integer)
  const dur = Math.max(1, Math.round(programA.avgDurationYears));

  const results: YearResult[] = [];
  let cumNet = 0;

  for (let y = 1; y <= 5; y++) {
    // Program A: cohorts stack up to dur, then plateau as old cohorts age out
    const activeCohorts = Math.min(y, dur);
    const costA = activeCohorts * membersPerYear * costPerMemberA;

    // Program B: BrainyAct cost for this year's new cohort
    // + ABA continuation from the past 3 cohorts at decreasing rates
    let costB = brainyActCostPerCohort;
    for (let post = 1; post <= 5; post++) {
      const cohortYear = y - post;
      if (cohortYear >= 1) {
        const pct = programB.continuationPct[post - 1] / 100;
        costB += membersPerYear * pct * costPerMemberBCont;
      }
    }

    const net = costA - costB;
    cumNet += net;
    results.push({ year: y, activeCohorts, costA, costB, netSavings: net, cumulativeNet: cumNet });
  }

  const programACost5yr = results.reduce((s, r) => s + r.costA, 0);
  const programBCost5yr = results.reduce((s, r) => s + r.costB, 0);
  const netSavings5yr = programACost5yr - programBCost5yr;
  const roiMultiple = programBCost5yr > 0 ? programACost5yr / programBCost5yr : 0;
  const returnPerDollar = programBCost5yr > 0 ? netSavings5yr / programBCost5yr : 0;

  return { yearlyResults: results, programACost5yr, programBCost5yr, netSavings5yr, roiMultiple, returnPerDollar };
};

// ── Autism level defaults ─────────────────────────────────────────────────────

export interface AutismLevelDefaults {
  abaAnnualCost: number;
  reductionPct: number;
  continuationPct: [number, number, number, number, number];
}

export const getAutismLevelDefaults = (level: AutismLevel): AutismLevelDefaults => {
  switch (level) {
    case 1: return { abaAnnualCost: 36_000, reductionPct: 35, continuationPct: [50, 25, 10, 5, 2] };
    case 2: return { abaAnnualCost: 48_000, reductionPct: 25, continuationPct: [80, 40, 20, 10, 5] };
    case 3: return { abaAnnualCost: 72_000, reductionPct: 15, continuationPct: [90, 65, 35, 20, 10] };
  }
};
