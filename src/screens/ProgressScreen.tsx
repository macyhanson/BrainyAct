import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DomainProgressBar from '../components/DomainProgressBar';
import RadarChart from '../components/RadarChart';
import { baselines, realLifeImprovements, childProfile } from '../data/mockData';
import { DOMAINS } from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

type Tab = 'domains' | 'improvements';

export default function ProgressScreen() {
  const [tab, setTab] = useState<Tab>('domains');
  const b1  = baselines[0];
  const cur = baselines[baselines.length - 1];

  const radarB1  = DOMAINS.map(d => b1.domainScores.find(s => s.domain === d)!.percentage);
  const radarCur = DOMAINS.map(d => cur.domainScores.find(s => s.domain === d)!.percentage);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Abilities & Progress</Text>
          <Text style={styles.subtitle}>{childProfile.firstName} · {childProfile.baselineCount} assessments completed</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['domains', 'improvements'] as Tab[]).map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Ionicons
              name={t === 'domains' ? 'bar-chart' : 'heart-circle'}
              size={15}
              color={tab === t ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'domains' ? 'Domain Progress' : 'Real-Life Gains'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {tab === 'domains' ? (
          <>
            {/* Legend */}
            <View style={[styles.legendCard, shadows.sm]}>
              <Text style={styles.legendTitle}>How to read this report</Text>
              <Text style={styles.legendSub}>Lower % = fewer symptoms. Your child improves as bars get shorter.</Text>
              <View style={styles.legendRow}>
                {[
                  { color: '#10B981', label: 'Typical Range', range: '0–24.9%' },
                  { color: '#F59E0B', label: 'Mild Weakness', range: '25–49.9%' },
                  { color: '#EF4444', label: 'Area of Focus', range: '50%+' },
                ].map(z => (
                  <View key={z.label} style={styles.legendZone}>
                    <View style={[styles.legendDot, { backgroundColor: z.color }]} />
                    <View>
                      <Text style={styles.legendZoneLabel}>{z.label}</Text>
                      <Text style={styles.legendZoneRange}>{z.range}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Overall summary */}
            <View style={[styles.summaryCard, shadows.sm]}>
              <Text style={styles.summaryTitle}>Assessment Summary</Text>
              <View style={styles.summaryRow}>
                {baselines.map(b => (
                  <View key={b.number} style={styles.summaryItem}>
                    <Text style={styles.summaryBNum}>Baseline {b.number}</Text>
                    <Text style={styles.summaryDate}>{new Date(b.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</Text>
                    <Text style={[
                      styles.summaryPct,
                      { color: b.totalPercentage < 25 ? '#10B981' : b.totalPercentage < 50 ? '#F59E0B' : '#EF4444' }
                    ]}>
                      {b.totalPercentage.toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Domain bars */}
            <Text style={styles.sectionTitle}>Baseline 1 vs. Baseline 3 (Current)</Text>
            {DOMAINS.map(domain => {
              const b1Score  = b1.domainScores.find(d => d.domain === domain)!;
              const curScore = cur.domainScores.find(d => d.domain === domain)!;
              return (
                <DomainProgressBar
                  key={domain}
                  domain={domain}
                  beforePct={b1Score.percentage}
                  afterPct={curScore.percentage}
                  beforeLabel="Baseline 1"
                  afterLabel="Current"
                />
              );
            })}

            {/* Radar chart */}
            <Text style={styles.sectionTitle}>Progress Spider Chart</Text>
            <View style={[styles.radarCard, shadows.sm]}>
              <RadarChart baseline1={radarB1} baseline3={radarCur} size={260} />
            </View>

            {/* Left vs Right brain */}
            <Text style={styles.sectionTitle}>Left vs Right Brain Focus</Text>
            <View style={[styles.brainCard, shadows.sm]}>
              <View style={styles.brainRow}>
                <View style={styles.brainSide}>
                  <Text style={styles.brainSideTitle}>Left Brain</Text>
                  <Text style={styles.brainB1}>{b1.leftTotalScore} pts at start</Text>
                  <Text style={styles.brainCur}>{cur.leftTotalScore} pts now</Text>
                  <Text style={styles.brainChange}>
                    ↓ {b1.leftTotalScore - cur.leftTotalScore} pts improved
                  </Text>
                </View>
                <View style={styles.brainDivider} />
                <View style={styles.brainSide}>
                  <Text style={styles.brainSideTitle}>Right Brain</Text>
                  <Text style={styles.brainB1}>{b1.rightTotalScore} pts at start</Text>
                  <Text style={styles.brainCur}>{cur.rightTotalScore} pts now</Text>
                  <Text style={styles.brainChange}>
                    ↓ {b1.rightTotalScore - cur.rightTotalScore} pts improved
                  </Text>
                </View>
              </View>
              <View style={[styles.deficitNote, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="information-circle" size={14} color="#EF4444" />
                <Text style={styles.deficitNoteText}>
                  {childProfile.brainDeficit}-brain deficit identified. BrainyAct targets both sides with emphasis on the {childProfile.brainDeficit.toLowerCase()} hemisphere.
                </Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Real-life improvements */}
            <View style={styles.improvementsIntro}>
              <Text style={styles.improvementsTitle}>Real-Life Improvements</Text>
              <Text style={styles.improvementsSub}>
                Families who complete BrainyAct typically observe these gains in their child's daily life.
              </Text>
            </View>
            {realLifeImprovements.map((item, i) => (
              <View key={i} style={[styles.improvCard, shadows.sm]}>
                <View style={styles.improvHeader}>
                  <View style={[styles.improvIcon, { backgroundColor: `${item.color}18` }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={styles.improvTitle}>{item.title}</Text>
                </View>
                <View style={styles.improvList}>
                  {item.improvements.map((imp, j) => (
                    <View key={j} style={styles.improvItem}>
                      <View style={[styles.checkDot, { backgroundColor: item.color }]}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                      <Text style={styles.improvText}>{imp}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  tabs: {
    flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.sm,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: borderRadius.md,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.primary },
  scroll: { paddingHorizontal: spacing.md },
  legendCard: {
    backgroundColor: '#F0FDF4', borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: '#A7F3D0',
  },
  legendTitle: { ...typography.h4, color: '#065F46', marginBottom: 4 },
  legendSub: { ...typography.bodySmall, color: '#047857', marginBottom: spacing.sm },
  legendRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  legendZone: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendZoneLabel: { ...typography.caption, color: colors.text, fontWeight: '700' },
  legendZoneRange: { ...typography.caption, color: colors.textMuted },
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.md,
  },
  summaryTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.sm },
  summaryRow: { flexDirection: 'row', gap: spacing.sm },
  summaryItem: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.sm,
    padding: 10, alignItems: 'center',
  },
  summaryBNum: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4 },
  summaryDate: { ...typography.caption, color: colors.textMuted, marginBottom: 4 },
  summaryPct: { fontSize: 20, fontWeight: '800' },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.sm, marginTop: 4 },
  radarCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    alignItems: 'center', marginBottom: spacing.md,
  },
  brainCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.md,
  },
  brainRow: { flexDirection: 'row', marginBottom: spacing.sm },
  brainSide: { flex: 1, alignItems: 'center' },
  brainDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  brainSideTitle: { ...typography.h4, color: colors.text, marginBottom: 4 },
  brainB1: { ...typography.bodySmall, color: '#EF4444', marginBottom: 2 },
  brainCur: { ...typography.bodySmall, color: '#10B981', marginBottom: 2 },
  brainChange: { ...typography.body, color: '#10B981', fontWeight: '700' },
  deficitNote: {
    flexDirection: 'row', gap: 6, padding: spacing.sm, borderRadius: borderRadius.sm, alignItems: 'flex-start',
  },
  deficitNoteText: { ...typography.bodySmall, color: '#991B1B', flex: 1 },
  improvementsIntro: { marginBottom: spacing.md },
  improvementsTitle: { ...typography.h3, color: colors.text, marginBottom: 4 },
  improvementsSub: { ...typography.body, color: colors.textSecondary },
  improvCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  improvHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  improvIcon: { width: 38, height: 38, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  improvTitle: { ...typography.h4, color: colors.text },
  improvList: { gap: 6 },
  improvItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  checkDot: {
    width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  improvText: { ...typography.body, color: colors.textSecondary, flex: 1, lineHeight: 20 },
});
