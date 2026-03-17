import { Domain, PerformanceZone, ROIInputs, ROIResults } from '../types';

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

// ── ROI calculation ───────────────────────────────────────────────────────────

export const calcROI = (inputs: ROIInputs): ROIResults => {
  const { memberCount, programCostPerMember, therapyLines } = inputs;
  const lineBreakdown = therapyLines.map(line => {
    const savings =
      memberCount *
      (line.utilizationPct / 100) *
      line.annualCostPerUser *
      (line.reductionPct / 100);
    return { key: line.key, label: line.label, savings, color: line.color };
  });
  const totalSavings = lineBreakdown.reduce((sum, l) => sum + l.savings, 0);
  const programCost = memberCount * programCostPerMember;
  const netSavings = totalSavings - programCost;
  const roiMultiple = programCost > 0 ? totalSavings / programCost : 0;
  const perMemberSavings = memberCount > 0 ? netSavings / memberCount : 0;
  return { totalSavings, programCost, netSavings, roiMultiple, perMemberSavings, lineBreakdown };
};
