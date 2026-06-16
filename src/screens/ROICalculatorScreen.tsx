import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TherapyLine } from '../types';
import { calcFiveYearModel } from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

// ── Default therapy data ──────────────────────────────────────────────────────

const DEFAULT_LINES: TherapyLine[] = [
  { key: 'aba',       label: 'ABA Therapy',      color: '#6366F1', utilizationPct: 12, annualCostPerUser: 48000, reductionPct: 25 },
  { key: 'ot',        label: 'OT Therapy',        color: '#3B82F6', utilizationPct: 22, annualCostPerUser: 3200,  reductionPct: 20 },
  { key: 'speech',    label: 'Speech Therapy',    color: '#10B981', utilizationPct: 25, annualCostPerUser: 4100,  reductionPct: 20 },
  { key: 'pt',        label: 'Physical Therapy',  color: '#F59E0B', utilizationPct: 11, annualCostPerUser: 2600,  reductionPct: 15 },
  { key: 'cognitive', label: 'Cognitive Therapy', color: '#8B5CF6', utilizationPct: 14, annualCostPerUser: 5500,  reductionPct: 25 },
  { key: 'crisis',    label: 'Crisis / ER',       color: '#EF4444', utilizationPct: 6,  annualCostPerUser: 9000,  reductionPct: 35 },
];

// ── Formatting ────────────────────────────────────────────────────────────────

const fmt = (n: number): string => {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ROICalculatorScreen() {
  // Shared
  const [membersPerYear, setMembersPerYear] = useState('500');

  // Program A — Behavioral Care
  const [durationYears, setDurationYears]   = useState('3.5');
  const [churnA, setChurnA]                 = useState('12');
  const [linesA, setLinesA]                 = useState<TherapyLine[]>(DEFAULT_LINES);

  // Program B — BrainyAct
  const [pmpm, setPmpm]                         = useState('100');
  const [durationMonths, setDurationMonths]     = useState('6');
  const [churnB, setChurnB]                     = useState('12');
  const [contYr1, setContYr1]                   = useState('80');
  const [contYr2, setContYr2]                   = useState('40');
  const [contYr3, setContYr3]                   = useState('20');
  const [linesB, setLinesB]                     = useState<TherapyLine[]>(DEFAULT_LINES);

  const updateA = (key: string, field: 'utilizationPct' | 'annualCostPerUser', v: string) =>
    setLinesA(prev => prev.map(l => l.key === key ? { ...l, [field]: parseFloat(v) || 0 } : l));

  const updateB = (key: string, field: 'utilizationPct' | 'annualCostPerUser' | 'reductionPct', v: string) =>
    setLinesB(prev => prev.map(l => l.key === key ? { ...l, [field]: parseFloat(v) || 0 } : l));

  const n = parseFloat(membersPerYear) || 0;

  const model = useMemo(() => calcFiveYearModel(
    n,
    {
      avgDurationYears: parseFloat(durationYears) || 0,
      churnRatePct:     parseFloat(churnA) || 0,
      therapyLines:     linesA,
    },
    {
      pmpm:              parseFloat(pmpm) || 0,
      avgDurationMonths: parseFloat(durationMonths) || 0,
      churnRatePct:      parseFloat(churnB) || 0,
      continuationPct:   [parseFloat(contYr1) || 0, parseFloat(contYr2) || 0, parseFloat(contYr3) || 0],
      therapyLines:      linesB,
    },
  ), [n, durationYears, churnA, linesA, pmpm, durationMonths, churnB, contYr1, contYr2, contYr3, linesB]);

  const yr1 = model.yearlyResults[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Brainy<Text style={styles.logoAccent}>Act</Text></Text>
          <View style={styles.badge}>
            <Ionicons name="calculator" size={11} color="#A5B4FC" />
            <Text style={styles.badgeText}>Payor ROI Calculator</Text>
          </View>
        </View>
        <Text style={styles.headerSub}>Insurance Cost-Savings Model</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Shared Input ── */}
          <View style={[styles.card, shadows.sm]}>
            <View style={styles.cardHeader}>
              <Ionicons name="people-circle" size={18} color={colors.primary} />
              <Text style={styles.cardTitle}>Population</Text>
            </View>
            <View style={styles.sharedInputRow}>
              <Text style={styles.inputLabel}>ASD Members Enrolled / Year</Text>
              <View style={styles.inputBox}>
                <Ionicons name="people-outline" size={13} color={colors.textMuted} style={{ marginRight: 4 }} />
                <TextInput
                  style={styles.textInput}
                  value={membersPerYear}
                  onChangeText={setMembersPerYear}
                  keyboardType="numeric"
                  placeholder="500"
                  placeholderTextColor={colors.textMuted}
                  selectTextOnFocus
                />
              </View>
            </View>
          </View>

          {/* ── Program A: Behavioral Care ── */}
          <View style={[styles.card, styles.cardA, shadows.md]}>
            <View style={styles.cardHeader}>
              <View style={styles.programChip}>
                <Text style={styles.programChipText}>Program A  ·  Top-Down Approach</Text>
              </View>
            </View>
            <Text style={styles.programLabel}>Behavioral Care</Text>

            <View style={styles.twoCol}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelLight}>Avg Duration (yrs)</Text>
                <View style={styles.inputBoxDark}>
                  <TextInput
                    style={styles.textInputLight}
                    value={durationYears}
                    onChangeText={setDurationYears}
                    keyboardType="numeric"
                    placeholder="3.5"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    selectTextOnFocus
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelLight}>Churn Rate %</Text>
                <View style={styles.inputBoxDark}>
                  <TextInput
                    style={styles.textInputLight}
                    value={churnA}
                    onChangeText={setChurnA}
                    keyboardType="numeric"
                    placeholder="12"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    selectTextOnFocus
                  />
                  <Text style={styles.inputSuf}>%</Text>
                </View>
              </View>
            </View>
            <Text style={styles.churnNote}>
              Est. churn: ~{Math.round(n * (parseFloat(churnA) || 0) / 100)} members/yr — shown for reference only
            </Text>

            {/* Therapy table — Program A */}
            <View style={styles.tableWrap}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.colHead, { flex: 2.5 }]}>Therapy</Text>
                <Text style={[styles.colHead, { flex: 1.5, textAlign: 'center' }]}>Usage %</Text>
                <Text style={[styles.colHead, { flex: 2, textAlign: 'center' }]}>Cost / Yr</Text>
              </View>
              {linesA.map(l => (
                <View key={l.key} style={styles.tableRow}>
                  <View style={[styles.dot, { backgroundColor: l.color }]} />
                  <Text style={[styles.therapyName, { flex: 2.5 }]} numberOfLines={1}>{l.label}</Text>
                  <TextInput
                    style={[styles.cellInput, { flex: 1.5 }]}
                    value={String(l.utilizationPct)}
                    onChangeText={v => updateA(l.key, 'utilizationPct', v)}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                  <TextInput
                    style={[styles.cellInput, { flex: 2 }]}
                    value={String(l.annualCostPerUser)}
                    onChangeText={v => updateA(l.key, 'annualCostPerUser', v)}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            <View style={styles.outputRow}>
              <View style={styles.outputItem}>
                <Text style={styles.outputLabel}>Yr 1 Active Users</Text>
                <Text style={styles.outputValue}>{n.toLocaleString()}</Text>
              </View>
              <View style={styles.outputDivider} />
              <View style={styles.outputItem}>
                <Text style={styles.outputLabel}>Yr 1 Total Cost</Text>
                <Text style={styles.outputValueHero}>{fmt(yr1?.costA ?? 0)}</Text>
              </View>
            </View>
          </View>

          {/* ── Program B: BrainyAct ── */}
          <View style={[styles.card, styles.cardB, shadows.md]}>
            <View style={styles.cardHeader}>
              <View style={[styles.programChip, styles.programChipB]}>
                <Text style={styles.programChipText}>Program B  ·  Bottom-Up Approach</Text>
              </View>
            </View>
            <Text style={styles.programLabel}>BrainyAct</Text>

            <View style={styles.twoCol}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelLight}>Cost / Member / Month</Text>
                <View style={styles.inputBoxDark}>
                  <Text style={styles.inputPre}>$</Text>
                  <TextInput
                    style={styles.textInputLight}
                    value={pmpm}
                    onChangeText={setPmpm}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    selectTextOnFocus
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabelLight}>Avg Duration (months)</Text>
                <View style={styles.inputBoxDark}>
                  <TextInput
                    style={styles.textInputLight}
                    value={durationMonths}
                    onChangeText={setDurationMonths}
                    keyboardType="numeric"
                    placeholder="6"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    selectTextOnFocus
                  />
                </View>
              </View>
            </View>

            <View style={[styles.twoCol, { marginBottom: 0 }]}>
              <View style={[styles.inputGroup, { flex: 0.5 }]}>
                <Text style={styles.inputLabelLight}>Churn Rate %</Text>
                <View style={styles.inputBoxDark}>
                  <TextInput
                    style={styles.textInputLight}
                    value={churnB}
                    onChangeText={setChurnB}
                    keyboardType="numeric"
                    placeholder="12"
                    placeholderTextColor="rgba(255,255,255,0.35)"
                    selectTextOnFocus
                  />
                  <Text style={styles.inputSuf}>%</Text>
                </View>
              </View>
            </View>
            <Text style={styles.churnNote}>
              Est. churn: ~{Math.round(n * (parseFloat(churnB) || 0) / 100)} members/yr — occurs over first {durationMonths} months
            </Text>

            <Text style={styles.sectionLabel}>% Continuing ABA After BrainyAct</Text>
            <View style={styles.threeCol}>
              {[
                { label: 'Year 1', value: contYr1, set: setContYr1 },
                { label: 'Year 2', value: contYr2, set: setContYr2 },
                { label: 'Year 3', value: contYr3, set: setContYr3 },
              ].map(({ label, value, set }) => (
                <View key={label} style={styles.inputGroup}>
                  <Text style={styles.inputLabelLight}>{label}</Text>
                  <View style={styles.inputBoxDark}>
                    <TextInput
                      style={styles.textInputLight}
                      value={value}
                      onChangeText={set}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="rgba(255,255,255,0.35)"
                      selectTextOnFocus
                    />
                    <Text style={styles.inputSuf}>%</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Therapy table — Program B */}
            <View style={styles.tableWrap}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.colHead, { flex: 2 }]}>Therapy</Text>
                <Text style={[styles.colHead, { flex: 1.5, textAlign: 'center' }]}>Usage %</Text>
                <Text style={[styles.colHead, { flex: 2, textAlign: 'center' }]}>Cost / Yr</Text>
                <Text style={[styles.colHead, { flex: 1.5, textAlign: 'center' }]}>Reduce %</Text>
              </View>
              {linesB.map(l => (
                <View key={l.key} style={styles.tableRow}>
                  <View style={[styles.dot, { backgroundColor: l.color }]} />
                  <Text style={[styles.therapyName, { flex: 2 }]} numberOfLines={1}>{l.label}</Text>
                  <TextInput
                    style={[styles.cellInput, { flex: 1.5 }]}
                    value={String(l.utilizationPct)}
                    onChangeText={v => updateB(l.key, 'utilizationPct', v)}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                  <TextInput
                    style={[styles.cellInput, { flex: 2 }]}
                    value={String(l.annualCostPerUser)}
                    onChangeText={v => updateB(l.key, 'annualCostPerUser', v)}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                  <TextInput
                    style={[styles.cellInput, { flex: 1.5 }]}
                    value={String(l.reductionPct)}
                    onChangeText={v => updateB(l.key, 'reductionPct', v)}
                    keyboardType="numeric"
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            <View style={styles.outputRow}>
              <View style={styles.outputItem}>
                <Text style={styles.outputLabel}>Yr 1 BrainyAct Cost</Text>
                <Text style={styles.outputValue}>{fmt(n * (parseFloat(pmpm) || 0) * (parseFloat(durationMonths) || 0))}</Text>
              </View>
              <View style={styles.outputDivider} />
              <View style={styles.outputItem}>
                <Text style={styles.outputLabel}>Yr 1 Total Cost</Text>
                <Text style={styles.outputValueHero}>{fmt(yr1?.costB ?? 0)}</Text>
              </View>
            </View>
          </View>

          {/* ── 5-Year Comparison Table ── */}
          <View style={[styles.card, shadows.md]}>
            <View style={styles.cardHeader}>
              <Ionicons name="bar-chart" size={18} color={colors.primary} />
              <Text style={styles.cardTitle}>5-Year Comparison</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <View style={styles.tableRow5}>
                  <Text style={[styles.cell5Label, { width: 130 }]} />
                  {model.yearlyResults.map(r => (
                    <Text key={r.year} style={styles.cell5Head}>Yr {r.year}</Text>
                  ))}
                </View>

                <View style={styles.dividerRow}>
                  <Text style={styles.dividerLabel}>Program A — Behavioral Care</Text>
                </View>
                <View style={styles.tableRow5}>
                  <Text style={[styles.cell5Label, { width: 130 }]}>Active Cohorts</Text>
                  {model.yearlyResults.map(r => (
                    <Text key={r.year} style={styles.cell5}>{r.activeCohorts}×</Text>
                  ))}
                </View>
                <View style={styles.tableRow5}>
                  <Text style={[styles.cell5Label, { width: 130 }]}>Annual Cost</Text>
                  {model.yearlyResults.map(r => (
                    <Text key={r.year} style={[styles.cell5, styles.cell5A]}>{fmt(r.costA)}</Text>
                  ))}
                </View>

                <View style={styles.dividerRow}>
                  <Text style={styles.dividerLabel}>Program B — BrainyAct</Text>
                </View>
                <View style={styles.tableRow5}>
                  <Text style={[styles.cell5Label, { width: 130 }]}>Annual Cost</Text>
                  {model.yearlyResults.map(r => (
                    <Text key={r.year} style={[styles.cell5, styles.cell5B]}>{fmt(r.costB)}</Text>
                  ))}
                </View>

                <View style={styles.dividerRow}>
                  <Text style={styles.dividerLabel}>Savings (A − B)</Text>
                </View>
                <View style={styles.tableRow5}>
                  <Text style={[styles.cell5Label, { width: 130 }]}>Year Net</Text>
                  {model.yearlyResults.map(r => (
                    <Text key={r.year} style={[styles.cell5, styles.cell5Net]}>{fmt(r.netSavings)}</Text>
                  ))}
                </View>
                <View style={styles.tableRow5}>
                  <Text style={[styles.cell5Label, { width: 130 }]}>Cumulative Net</Text>
                  {model.yearlyResults.map(r => (
                    <Text key={r.year} style={[styles.cell5, styles.cell5Cum]}>{fmt(r.cumulativeNet)}</Text>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          {/* ── ROI Summary ── */}
          <View style={[styles.card, styles.cardSummary, shadows.lg]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={18} color="#fff" />
              <Text style={[styles.cardTitle, { color: '#fff' }]}>ROI Summary</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>5-Yr Total Cost: Program A</Text>
              <Text style={styles.summaryValA}>{fmt(model.programACost5yr)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>5-Yr Total Cost: Program B</Text>
              <Text style={styles.summaryValB}>{fmt(model.programBCost5yr)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#fff', fontWeight: '600' }]}>
                5-Year Net Savings
              </Text>
              <Text style={styles.summaryHero}>{fmt(model.netSavings5yr)}</Text>
            </View>

            <View style={styles.chipsRow}>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryChipLabel}>ROI Multiple</Text>
                <Text style={styles.summaryChipValue}>{model.roiMultiple.toFixed(1)}×</Text>
              </View>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryChipLabel}>Return per $1 Spent</Text>
                <Text style={styles.summaryChipValue}>${model.returnPerDollar.toFixed(2)}</Text>
              </View>
            </View>

            <Text style={styles.callout}>
              BrainyAct members complete care in {durationMonths} months. Traditional ABA costs
              accumulate for {durationYears} years per cohort — Program B saves{' '}
              {fmt(model.netSavings5yr)} over 5 years.
            </Text>
          </View>

          <Text style={styles.disclaimer}>
            * Projections based on entered utilization rates and industry cost benchmarks.
            Actual savings may vary. For illustrative purposes only.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo:       { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  logoAccent: { color: '#A5B4FC' },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.full, gap: 4,
    alignSelf: 'flex-start', marginTop: 4,
  },
  badgeText: { ...typography.caption, color: '#C7D2FE', fontWeight: '600' },
  headerSub: { ...typography.bodySmall, color: '#93C5FD', textAlign: 'right' },

  scroll: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.md },

  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardA:       { backgroundColor: '#1E3A8A', borderColor: '#1E40AF' },
  cardB:       { backgroundColor: '#312E81', borderColor: '#4338CA' },
  cardSummary: { backgroundColor: '#064E3B', borderColor: '#065F46' },

  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm, marginBottom: spacing.sm,
  },
  cardTitle: { ...typography.h4, color: colors.text },

  programChip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm, paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  programChipB:   { backgroundColor: 'rgba(255,255,255,0.12)' },
  programChipText: {
    ...typography.caption, color: '#C7D2FE',
    fontWeight: '700', letterSpacing: 0.5,
  },
  programLabel: {
    fontSize: 20, fontWeight: '700', color: '#fff',
    marginBottom: spacing.md, letterSpacing: -0.3,
  },

  sharedInputRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', gap: spacing.sm,
  },
  inputLabel:      { ...typography.label, color: colors.textSecondary, flex: 1 },
  inputLabelLight: { ...typography.caption, color: '#A5B4FC', marginBottom: 4 },
  sectionLabel: {
    ...typography.label, color: '#A5B4FC',
    marginTop: spacing.sm, marginBottom: spacing.xs,
  },

  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm, backgroundColor: colors.surfaceAlt,
    height: 38, width: 130,
  },
  inputBoxDark: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm, backgroundColor: 'rgba(0,0,0,0.2)', height: 36,
  },
  inputPre: { ...typography.body, color: 'rgba(255,255,255,0.55)', marginRight: 2 },
  inputSuf: { ...typography.body, color: 'rgba(255,255,255,0.55)', marginLeft: 2 },
  textInput:      { flex: 1, ...typography.body, color: colors.text, padding: 0 },
  textInputLight: { flex: 1, ...typography.body, color: '#fff', padding: 0 },

  twoCol:     { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  threeCol:   { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  inputGroup: { flex: 1 },

  churnNote: {
    ...typography.caption, color: 'rgba(165,180,252,0.75)',
    marginBottom: spacing.sm, fontStyle: 'italic',
  },

  tableWrap: {
    borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden', marginTop: spacing.sm,
  },
  tableHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xs, paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.2)', paddingLeft: 18,
  },
  colHead: {
    ...typography.caption, color: 'rgba(165,180,252,0.8)',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.xs, paddingVertical: 5,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)', gap: 4,
  },
  dot:         { width: 7, height: 7, borderRadius: 4 },
  therapyName: { ...typography.bodySmall, color: '#E0E7FF', fontWeight: '500' },
  cellInput: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5, paddingHorizontal: 4, paddingVertical: 3,
    ...typography.caption, color: '#fff', textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  outputRow: {
    flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: spacing.sm,
  },
  outputItem:      { flex: 1, alignItems: 'center' },
  outputDivider:   { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  outputLabel:     { ...typography.caption, color: '#A5B4FC', marginBottom: 2, textAlign: 'center' },
  outputValue:     { ...typography.h4, color: '#fff' },
  outputValueHero: { fontSize: 20, fontWeight: '700', color: '#6EE7B7' },

  // 5-year table
  tableRow5: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight,
  },
  cell5Head:  { width: 68, ...typography.label, color: colors.textMuted, textAlign: 'center', fontWeight: '700' },
  cell5Label: { ...typography.bodySmall, color: colors.textSecondary, paddingLeft: 4 },
  cell5:      { width: 68, ...typography.bodySmall, color: colors.text, textAlign: 'center' },
  cell5A:     { color: '#DC2626', fontWeight: '600' },
  cell5B:     { color: '#059669', fontWeight: '600' },
  cell5Net:   { fontWeight: '700', color: colors.text },
  cell5Cum:   { fontWeight: '700', color: colors.primary },
  dividerRow: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border,
  },
  dividerLabel: {
    ...typography.caption, color: colors.textMuted,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },

  // Summary card
  summaryRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  summaryLabel:  { ...typography.body, color: '#A7F3D0' },
  summaryValA:   { ...typography.h4, color: '#FCA5A5' },
  summaryValB:   { ...typography.h4, color: '#6EE7B7' },
  summaryHero:   { fontSize: 26, fontWeight: '800', color: '#fff' },
  summaryDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: spacing.sm },
  chipsRow:      { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.md },
  summaryChip: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center',
  },
  summaryChipLabel: { ...typography.caption, color: '#6EE7B7', marginBottom: 2 },
  summaryChipValue: { ...typography.h3, color: '#fff' },
  callout: {
    ...typography.bodySmall, color: '#6EE7B7',
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: borderRadius.sm,
    padding: spacing.sm, lineHeight: 18,
  },

  disclaimer: {
    ...typography.caption, color: colors.textMuted,
    textAlign: 'center', paddingHorizontal: spacing.md, lineHeight: 16,
  },
});
