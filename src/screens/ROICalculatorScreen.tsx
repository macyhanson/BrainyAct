import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ROITherapyLine } from '../types';
import { calcROI } from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

// ── Default therapy data ──────────────────────────────────────────────────────

const DEFAULT_THERAPY_LINES: ROITherapyLine[] = [
  { key: 'aba',       label: 'ABA Therapy',       icon: 'people',      color: '#6366F1', utilizationPct: 12, annualCostPerUser: 48000, reductionPct: 25 },
  { key: 'ot',        label: 'OT Therapy',         icon: 'hand-left',   color: '#3B82F6', utilizationPct: 22, annualCostPerUser: 3200,  reductionPct: 20 },
  { key: 'speech',    label: 'Speech Therapy',     icon: 'chatbubbles', color: '#10B981', utilizationPct: 25, annualCostPerUser: 4100,  reductionPct: 20 },
  { key: 'pt',        label: 'Physical Therapy',   icon: 'body',        color: '#F59E0B', utilizationPct: 11, annualCostPerUser: 2600,  reductionPct: 15 },
  { key: 'cognitive', label: 'Cognitive Therapy',  icon: 'brain',       color: '#8B5CF6', utilizationPct: 14, annualCostPerUser: 5500,  reductionPct: 25 },
  { key: 'crisis',    label: 'Crisis / ER Visits', icon: 'medical',     color: '#EF4444', utilizationPct: 6,  annualCostPerUser: 9000,  reductionPct: 35 },
];

// ── Formatting helpers ────────────────────────────────────────────────────────

const fmtDollars = (n: number): string => {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `${n < 0 ? '-' : ''}$${(abs / 1_000).toFixed(0)}K`;
  return `${n < 0 ? '-$' : '$'}${abs.toFixed(0)}`;
};

const fmtDollarsShort = (n: number): string => fmtDollars(n);

// ── Component ─────────────────────────────────────────────────────────────────

export default function ROICalculatorScreen() {
  const [memberCount, setMemberCount] = useState('500');
  const [programCost, setProgramCost] = useState('1200');
  const [lines, setLines] = useState<ROITherapyLine[]>(DEFAULT_THERAPY_LINES);

  const updateLine = (key: string, field: keyof ROITherapyLine, raw: string) => {
    setLines(prev => prev.map(l => {
      if (l.key !== key) return l;
      const num = parseFloat(raw);
      return { ...l, [field]: isNaN(num) ? 0 : num };
    }));
  };

  const results = useMemo(() => calcROI({
    memberCount: parseFloat(memberCount) || 0,
    programCostPerMember: parseFloat(programCost) || 0,
    therapyLines: lines,
  }), [memberCount, programCost, lines]);

  const maxSavings = Math.max(...results.lineBreakdown.map(l => l.savings), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>Brainy<Text style={styles.logoAccent}>Act</Text></Text>
          <View style={styles.headerBadge}>
            <Ionicons name="calculator" size={11} color="#A5B4FC" />
            <Text style={styles.headerBadgeText}>Payor ROI Calculator</Text>
          </View>
        </View>
        <Text style={styles.headerSub}>Insurance Cost-Savings Model</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Card 1: Population & Program Cost ── */}
          <View style={[styles.card, shadows.md]}>
            <View style={styles.cardHeader}>
              <Ionicons name="people-circle" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Population & Program</Text>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Covered Children</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="people-outline" size={14} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={memberCount}
                    onChangeText={setMemberCount}
                    keyboardType="numeric"
                    placeholder="500"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>BrainyAct Cost / Child / Yr</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputPrefix}>$</Text>
                  <TextInput
                    style={styles.textInput}
                    value={programCost}
                    onChangeText={setProgramCost}
                    keyboardType="numeric"
                    placeholder="1200"
                    placeholderTextColor={colors.textMuted}
                  />
                </View>
              </View>
            </View>

            <View style={styles.programCostSummary}>
              <Text style={styles.programCostLabel}>Total Program Cost</Text>
              <Text style={styles.programCostValue}>{fmtDollars(results.programCost)}</Text>
            </View>
          </View>

          {/* ── Card 2: Therapy Utilization ── */}
          <View style={[styles.card, shadows.md]}>
            <View style={styles.cardHeader}>
              <Ionicons name="medkit" size={20} color={colors.primary} />
              <Text style={styles.cardTitle}>Therapy Utilization</Text>
            </View>

            {/* Column headers */}
            <View style={styles.tableHeader}>
              <Text style={[styles.colLabel, { flex: 3 }]}>Therapy</Text>
              <Text style={[styles.colLabel, { flex: 2, textAlign: 'center' }]}>Usage %</Text>
              <Text style={[styles.colLabel, { flex: 2.5, textAlign: 'center' }]}>Avg Cost/Yr</Text>
              <Text style={[styles.colLabel, { flex: 2, textAlign: 'center' }]}>Reduce %</Text>
            </View>

            {lines.map(line => (
              <View key={line.key} style={styles.therapyRow}>
                <View style={[styles.therapyDot, { backgroundColor: line.color }]} />
                <Text style={styles.therapyName} numberOfLines={1}>{line.label}</Text>
                <TextInput
                  style={[styles.cellInput, { flex: 2 }]}
                  value={String(line.utilizationPct)}
                  onChangeText={v => updateLine(line.key, 'utilizationPct', v)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <TextInput
                  style={[styles.cellInput, { flex: 2.5 }]}
                  value={String(line.annualCostPerUser)}
                  onChangeText={v => updateLine(line.key, 'annualCostPerUser', v)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <TextInput
                  style={[styles.cellInput, { flex: 2 }]}
                  value={String(line.reductionPct)}
                  onChangeText={v => updateLine(line.key, 'reductionPct', v)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              </View>
            ))}
          </View>

          {/* ── Card 3: ROI Results ── */}
          <View style={[styles.card, shadows.lg, styles.resultsCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="trending-up" size={20} color="#fff" />
              <Text style={[styles.cardTitle, { color: '#fff' }]}>ROI Results</Text>
            </View>

            {/* Hero metric */}
            <View style={styles.heroMetric}>
              <Text style={styles.heroLabel}>Net Annual Savings</Text>
              <Text style={[styles.heroValue, { color: results.netSavings >= 0 ? '#6EE7B7' : '#FCA5A5' }]}>
                {fmtDollarsShort(results.netSavings)}
              </Text>
            </View>

            {/* Summary chips */}
            <View style={styles.chipsRow}>
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>ROI Multiple</Text>
                <Text style={styles.chipValue}>{results.roiMultiple.toFixed(1)}×</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>Gross Savings</Text>
                <Text style={styles.chipValue}>{fmtDollars(results.totalSavings)}</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipLabel}>Per-Member Net</Text>
                <Text style={[styles.chipValue, { color: results.perMemberSavings >= 0 ? '#6EE7B7' : '#FCA5A5' }]}>
                  {fmtDollars(results.perMemberSavings)}
                </Text>
              </View>
            </View>

            {/* Savings breakdown bars */}
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>Savings by Therapy</Text>
              {results.lineBreakdown.map(item => (
                <View key={item.key} style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel} numberOfLines={1}>{item.label}</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: item.color,
                          width: `${Math.max((item.savings / maxSavings) * 100, 2)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownValue}>{fmtDollars(item.savings)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Disclaimer ── */}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header
  header: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  logo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  logoAccent: {
    color: '#A5B4FC',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    ...typography.caption,
    color: '#C7D2FE',
    fontWeight: '600',
  },
  headerSub: {
    ...typography.bodySmall,
    color: '#93C5FD',
    textAlign: 'right',
  },

  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },

  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
  },

  // Population inputs
  inputRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    height: 40,
  },
  inputIcon: {
    marginRight: 4,
  },
  inputPrefix: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: 2,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },
  programCostSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: 4,
  },
  programCostLabel: {
    ...typography.label,
    color: colors.primary,
  },
  programCostValue: {
    ...typography.h4,
    color: colors.primaryDark,
  },

  // Therapy table
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    paddingLeft: 18,
  },
  colLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  therapyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: 6,
  },
  therapyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  therapyName: {
    flex: 3,
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  cellInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'center',
    backgroundColor: colors.surfaceAlt,
  },

  // Results card
  resultsCard: {
    backgroundColor: '#1E3A8A',
    borderColor: '#1E40AF',
  },
  heroMetric: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: spacing.md,
  },
  heroLabel: {
    ...typography.label,
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroValue: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  chipLabel: {
    ...typography.caption,
    color: '#93C5FD',
    marginBottom: 2,
    textAlign: 'center',
  },
  chipValue: {
    ...typography.h4,
    color: '#fff',
  },

  // Breakdown bars
  breakdownSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: spacing.md,
  },
  breakdownTitle: {
    ...typography.label,
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: spacing.sm,
  },
  breakdownLabel: {
    ...typography.bodySmall,
    color: '#CBD5E1',
    width: 110,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownValue: {
    ...typography.label,
    color: '#fff',
    width: 56,
    textAlign: 'right',
  },

  // Disclaimer
  disclaimer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    lineHeight: 16,
  },
});
