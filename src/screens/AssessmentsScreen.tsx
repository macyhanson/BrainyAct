import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { baselines, childProfile } from '../data/mockData';
import { DOMAINS, getDomainColor, getDomainIcon, getZone, getZoneColor, getZoneLabel, formatDate, calcPointChange } from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import { Baseline } from '../types';

export default function AssessmentsScreen() {
  const [selectedBaseline, setSelectedBaseline] = useState<Baseline>(baselines[baselines.length - 1]);
  const b1 = baselines[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Assessment History</Text>
          <Text style={styles.subtitle}>{childProfile.firstName} · {baselines.length} baselines completed</Text>
        </View>

        {/* Baseline selector cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.baselinePicker}>
          {baselines.map(b => {
            const active = b.number === selectedBaseline.number;
            const zone = getZone(b.totalPercentage);
            const zoneColor = getZoneColor(zone);
            return (
              <TouchableOpacity
                key={b.number}
                style={[styles.baselineChip, active && styles.baselineChipActive]}
                onPress={() => setSelectedBaseline(b)}
              >
                <Text style={[styles.chipTitle, active && { color: '#fff' }]}>Baseline {b.number}</Text>
                <Text style={[styles.chipDate, active && { color: 'rgba(255,255,255,0.8)' }]}>
                  {formatDate(b.date)}
                </Text>
                <View style={[styles.chipZone, { backgroundColor: active ? 'rgba(255,255,255,0.25)' : `${zoneColor}18` }]}>
                  <Text style={[styles.chipZoneText, { color: active ? '#fff' : zoneColor }]}>
                    {b.totalPercentage.toFixed(1)}%
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected baseline overview */}
        <View style={[styles.overviewCard, shadows.md]}>
          <View style={styles.overviewHeader}>
            <View>
              <Text style={styles.overviewTitle}>Baseline {selectedBaseline.number}</Text>
              <Text style={styles.overviewDate}>{formatDate(selectedBaseline.date)}</Text>
            </View>
            <View style={[styles.overviewZone, { backgroundColor: `${getZoneColor(getZone(selectedBaseline.totalPercentage))}18` }]}>
              <Text style={[styles.overviewZoneText, { color: getZoneColor(getZone(selectedBaseline.totalPercentage)) }]}>
                {getZoneLabel(getZone(selectedBaseline.totalPercentage))}
              </Text>
            </View>
          </View>

          {/* Total score */}
          <View style={styles.totalRow}>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Total Score</Text>
              <Text style={[styles.totalValue, { color: getZoneColor(getZone(selectedBaseline.totalPercentage)) }]}>
                {selectedBaseline.totalScore}/{selectedBaseline.totalMax}
              </Text>
              <Text style={styles.totalPct}>{selectedBaseline.totalPercentage.toFixed(1)}% of max</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Left Brain</Text>
              <Text style={styles.totalValue}>{selectedBaseline.leftTotalScore}</Text>
              <Text style={styles.totalPct}>pts observed</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Right Brain</Text>
              <Text style={styles.totalValue}>{selectedBaseline.rightTotalScore}</Text>
              <Text style={styles.totalPct}>pts observed</Text>
            </View>
          </View>

          {/* Brain deficit */}
          <View style={styles.deficitRow}>
            <Ionicons name="pulse" size={16} color="#EF4444" />
            <Text style={styles.deficitText}>
              Brain Deficit: <Text style={{ fontWeight: '700', color: '#EF4444' }}>{selectedBaseline.brainDeficit}</Text>
              {' '}hemisphere · Turtle Time: {selectedBaseline.turtleTime > 0 ? `${selectedBaseline.turtleTime}%` : 'Pre-program'}
            </Text>
          </View>
        </View>

        {/* Domain breakdown for selected baseline */}
        <Text style={styles.sectionTitle}>Domain Breakdown</Text>
        {DOMAINS.map(domain => {
          const score = selectedBaseline.domainScores.find(d => d.domain === domain)!;
          const zone = getZone(score.percentage);
          const zoneColor = getZoneColor(zone);
          const zoneLabel = getZoneLabel(zone);
          const dColor = getDomainColor(domain);
          // Compare to b1 if this is not b1
          const b1Score = b1.domainScores.find(d => d.domain === domain)!;
          const ptChange = selectedBaseline.number > 1 ? calcPointChange(b1Score.percentage, score.percentage) : null;
          const improved = ptChange !== null && ptChange > 0;

          return (
            <View key={domain} style={[styles.domainCard, shadows.sm]}>
              <View style={styles.domainHeader}>
                <View style={[styles.domainIcon, { backgroundColor: `${dColor}18` }]}>
                  <Ionicons name={getDomainIcon(domain) as any} size={16} color={dColor} />
                </View>
                <Text style={styles.domainName}>{domain}</Text>
                <View style={[styles.zoneBadge, { backgroundColor: `${zoneColor}18` }]}>
                  <View style={[styles.zoneDot, { backgroundColor: zoneColor }]} />
                  <Text style={[styles.zoneText, { color: zoneColor }]}>{zoneLabel}</Text>
                </View>
                {ptChange !== null && (
                  <View style={[styles.changeBadge, { backgroundColor: improved ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Ionicons name={improved ? 'trending-down' : 'trending-up'} size={11} color={improved ? '#10B981' : '#EF4444'} />
                    <Text style={[styles.changeText, { color: improved ? '#10B981' : '#EF4444' }]}>
                      {improved ? '-' : '+'}{Math.abs(ptChange).toFixed(1)}pts
                    </Text>
                  </View>
                )}
              </View>

              {/* Score bar */}
              <View style={styles.scoreBarRow}>
                <View style={styles.scoreTrack}>
                  <View style={[styles.scoreFill, { width: `${Math.min(score.percentage, 100)}%`, backgroundColor: zoneColor }]} />
                </View>
                <Text style={[styles.scorePct, { color: zoneColor }]}>{score.percentage.toFixed(1)}%</Text>
              </View>

              {/* Score details */}
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreDetail}>Score: {score.score}/{score.maxScore}</Text>
                <Text style={styles.scoreDetail}>
                  L: {score.leftScore}/{score.leftMax} ({score.leftPercentage.toFixed(0)}%)
                </Text>
                <Text style={styles.scoreDetail}>
                  R: {score.rightScore}/{score.rightMax} ({score.rightPercentage.toFixed(0)}%)
                </Text>
              </View>
            </View>
          );
        })}

        {/* Cross-baseline comparison table */}
        <Text style={styles.sectionTitle}>All Baselines Comparison</Text>
        <View style={[styles.compTable, shadows.sm]}>
          <View style={styles.compHeader}>
            <Text style={styles.compHeaderDomain}>Domain</Text>
            {baselines.map(b => (
              <Text key={b.number} style={styles.compHeaderBase}>B{b.number}</Text>
            ))}
            <Text style={styles.compHeaderChange}>Change</Text>
          </View>
          {DOMAINS.map((domain, i) => {
            const first = baselines[0].domainScores.find(d => d.domain === domain)!;
            const last  = baselines[baselines.length - 1].domainScores.find(d => d.domain === domain)!;
            const change = calcPointChange(first.percentage, last.percentage);
            const improved = change > 0;
            return (
              <View key={domain} style={[styles.compRow, i % 2 === 1 && styles.compRowAlt]}>
                <View style={styles.compDomainCell}>
                  <View style={[styles.compDot, { backgroundColor: getDomainColor(domain) }]} />
                  <Text style={styles.compDomainName}>{domain}</Text>
                </View>
                {baselines.map(b => {
                  const s = b.domainScores.find(d => d.domain === domain)!;
                  const z = getZone(s.percentage);
                  const zc = getZoneColor(z);
                  return (
                    <Text key={b.number} style={[styles.compPct, { color: zc }]}>
                      {s.percentage.toFixed(1)}
                    </Text>
                  );
                })}
                <View style={styles.compChangeCell}>
                  <Ionicons name={improved ? 'arrow-down' : change < 0 ? 'arrow-up' : 'remove'} size={11}
                    color={improved ? '#10B981' : change < 0 ? '#EF4444' : '#94A3B8'} />
                  <Text style={[styles.compChange, { color: improved ? '#10B981' : change < 0 ? '#EF4444' : '#94A3B8' }]}>
                    {Math.abs(change).toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={styles.compFooter}>
            <Text style={styles.compFooterLabel}>TOTAL</Text>
            {baselines.map(b => (
              <Text key={b.number} style={[styles.compFooterPct, {
                color: getZoneColor(getZone(b.totalPercentage))
              }]}>
                {b.totalPercentage.toFixed(1)}
              </Text>
            ))}
            <View style={styles.compChangeCell}>
              <Ionicons name="arrow-down" size={11} color="#10B981" />
              <Text style={[styles.compChange, { color: '#10B981' }]}>
                {(b1.totalPercentage - baselines[baselines.length - 1].totalPercentage).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.md },
  header: { paddingVertical: spacing.sm },
  title: { ...typography.h2, color: colors.text },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  baselinePicker: { paddingVertical: spacing.sm, gap: spacing.sm, paddingRight: spacing.md },
  baselineChip: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: 14,
    borderWidth: 1.5, borderColor: colors.border, minWidth: 120, alignItems: 'center',
  },
  baselineChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTitle: { ...typography.h4, color: colors.text, marginBottom: 2 },
  chipDate: { ...typography.caption, color: colors.textMuted, marginBottom: 6 },
  chipZone: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.full },
  chipZoneText: { ...typography.label, fontWeight: '800' },
  overviewCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md,
  },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  overviewTitle: { ...typography.h3, color: colors.text },
  overviewDate: { ...typography.bodySmall, color: colors.textSecondary },
  overviewZone: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: borderRadius.full },
  overviewZoneText: { ...typography.body, fontWeight: '700' },
  totalRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  totalItem: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.sm,
    padding: 10, alignItems: 'center',
  },
  totalLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  totalValue: { fontSize: 20, fontWeight: '800', color: colors.text },
  totalPct: { ...typography.caption, color: colors.textMuted },
  deficitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#FEF2F2', padding: 10, borderRadius: borderRadius.sm,
  },
  deficitText: { ...typography.bodySmall, color: '#991B1B', flex: 1 },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.sm, marginTop: 4 },
  domainCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border,
  },
  domainHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: spacing.sm },
  domainIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  domainName: { ...typography.h4, color: colors.text, flex: 1 },
  zoneBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.full, gap: 4 },
  zoneDot: { width: 6, height: 6, borderRadius: 3 },
  zoneText: { ...typography.caption, fontWeight: '700' },
  changeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: borderRadius.full, gap: 3 },
  changeText: { ...typography.caption, fontWeight: '700' },
  scoreBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  scoreTrack: { flex: 1, height: 10, backgroundColor: colors.borderLight, borderRadius: 5, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 5 },
  scorePct: { ...typography.body, fontWeight: '700', width: 40, textAlign: 'right' },
  scoreDetails: { flexDirection: 'row', gap: spacing.md },
  scoreDetail: { ...typography.caption, color: colors.textSecondary },
  compTable: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    overflow: 'hidden', marginBottom: spacing.md,
  },
  compHeader: {
    flexDirection: 'row', backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm, paddingVertical: 10,
  },
  compHeaderDomain: { ...typography.label, color: colors.textSecondary, flex: 2 },
  compHeaderBase: { ...typography.label, color: colors.textSecondary, width: 44, textAlign: 'center' },
  compHeaderChange: { ...typography.label, color: colors.textSecondary, width: 50, textAlign: 'center' },
  compRow: { flexDirection: 'row', paddingHorizontal: spacing.sm, paddingVertical: 9, alignItems: 'center' },
  compRowAlt: { backgroundColor: colors.surfaceAlt },
  compDomainCell: { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 },
  compDot: { width: 8, height: 8, borderRadius: 4 },
  compDomainName: { ...typography.body, color: colors.text },
  compPct: { width: 44, textAlign: 'center', fontWeight: '700', fontSize: 13 },
  compChangeCell: { width: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 },
  compChange: { ...typography.body, fontWeight: '700', fontSize: 13 },
  compFooter: {
    flexDirection: 'row', backgroundColor: '#1E293B', paddingHorizontal: spacing.sm, paddingVertical: 10, alignItems: 'center',
  },
  compFooterLabel: { ...typography.label, color: '#fff', flex: 2, letterSpacing: 0.5 },
  compFooterPct: { width: 44, textAlign: 'center', fontWeight: '800', fontSize: 13 },
});
