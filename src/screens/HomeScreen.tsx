import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { childProfile, baselines, sessions } from '../data/mockData';
import { DOMAINS, getDomainColor, getDomainIcon, getZone, getZoneColor, getZoneShort, calcPointChange, formatDate, formatNumber } from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const b1  = baselines[0];
  const cur = baselines[baselines.length - 1];
  const latest = sessions[sessions.length - 1];
  const totalImprovement = Math.round(((b1.totalPercentage - cur.totalPercentage) / b1.totalPercentage) * 100);
  const ptChange = (b1.totalPercentage - cur.totalPercentage).toFixed(1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <View style={styles.nameRow}>
            <Text style={styles.childName}>{childProfile.firstName}</Text>
            <View style={[styles.deficitBadge, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="pulse" size={11} color="#EF4444" />
              <Text style={styles.deficitText}>{childProfile.brainDeficit}-Brain Focus</Text>
            </View>
          </View>
          <Text style={styles.gamerTag}>🎮 {childProfile.gamerName} · {childProfile.grade} Grade</Text>
        </View>
        <View style={[styles.coinsBadge, shadows.sm]}>
          <Ionicons name="logo-bitcoin" size={18} color="#F59E0B" />
          <Text style={styles.coinsText}>{formatNumber(childProfile.totalCoins)}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); }} tintColor={colors.primary} />}
      >
        {/* ── Progress Banner ── */}
        <View style={[styles.banner, shadows.md]}>
          <View style={styles.bannerTop}>
            <View>
              <Text style={styles.bannerLabel}>OVERALL PROGRESS</Text>
              <Text style={styles.bannerBig}>{totalImprovement}% improvement</Text>
              <Text style={styles.bannerSub}>Symptoms reduced by {ptChange} points since {formatDate(b1.date)}</Text>
            </View>
            <View style={styles.ringContainer}>
              <View style={styles.ring}>
                <Text style={styles.ringValue}>{totalImprovement}%</Text>
                <Text style={styles.ringLabel}>better</Text>
              </View>
            </View>
          </View>
          <View style={styles.bannerStats}>
            {[
              { label: 'Baselines', value: childProfile.baselineCount },
              { label: 'Play Sessions', value: childProfile.playCount },
              { label: 'Total Sessions', value: childProfile.totalCount },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Baseline Progress Note ── */}
        <View style={[styles.noteCard, shadows.sm]}>
          <Ionicons name="information-circle" size={18} color={colors.info} />
          <Text style={styles.noteText}>
            <Text style={{ fontWeight: '700' }}>How to read scores:</Text> Lower % = fewer symptoms observed. Green = Typical Range (0–24.9%), Yellow = Mild Weakness (25–49.9%), Red = Area of Focus (50%+).
          </Text>
        </View>

        {/* ── 6 Domain Cards ── */}
        <Text style={styles.sectionTitle}>Domain Progress</Text>
        <View style={styles.domainGrid}>
          {DOMAINS.map(domain => {
            const b1Score  = b1.domainScores.find(d => d.domain === domain);
            const curScore = cur.domainScores.find(d => d.domain === domain);
            if (!b1Score || !curScore) return null;
            const zone      = getZone(curScore.percentage);
            const zoneColor = getZoneColor(zone);
            const ptDiff    = calcPointChange(b1Score.percentage, curScore.percentage);
            const improved  = ptDiff > 0;
            const dColor    = getDomainColor(domain);
            return (
              <View key={domain} style={[styles.domainCard, shadows.sm]}>
                <View style={styles.domainCardTop}>
                  <View style={[styles.domainIcon, { backgroundColor: `${dColor}18` }]}>
                    <Ionicons name={getDomainIcon(domain) as any} size={18} color={dColor} />
                  </View>
                  <View style={[styles.zonePill, { backgroundColor: `${zoneColor}18` }]}>
                    <Text style={[styles.zoneShort, { color: zoneColor }]}>{getZoneShort(zone)}</Text>
                  </View>
                </View>
                <Text style={styles.domainCardName}>{domain}</Text>
                <Text style={[styles.domainPct, { color: zoneColor }]}>{curScore.percentage.toFixed(1)}%</Text>
                {ptDiff !== 0 && (
                  <View style={styles.domainChange}>
                    <Ionicons
                      name={improved ? 'arrow-down' : 'arrow-up'}
                      size={11}
                      color={improved ? '#10B981' : '#EF4444'}
                    />
                    <Text style={[styles.domainChangeTxt, { color: improved ? '#10B981' : '#EF4444' }]}>
                      {Math.abs(ptDiff).toFixed(1)} pts
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── Latest Session ── */}
        <Text style={styles.sectionTitle}>Latest Session</Text>
        <View style={[styles.sessionCard, shadows.sm]}>
          <View style={styles.sessionHeader}>
            <View>
              <Text style={styles.sessionTitle}>Play Session #{latest.playNumber}</Text>
              <Text style={styles.sessionDate}>{formatDate(latest.date)}</Text>
            </View>
            <View style={[styles.avgBadge, { backgroundColor: latest.averagePercent >= 80 ? '#D1FAE5' : latest.averagePercent >= 60 ? '#FEF3C7' : '#FEE2E2' }]}>
              <Text style={[styles.avgText, { color: latest.averagePercent >= 80 ? '#10B981' : latest.averagePercent >= 60 ? '#F59E0B' : '#EF4444' }]}>
                {latest.averagePercent}% avg
              </Text>
            </View>
          </View>
          <View style={styles.sessionMeta}>
            <View style={styles.sessionMetaItem}>
              <Ionicons name="time" size={14} color={colors.textMuted} />
              <Text style={styles.sessionMetaTxt}>{latest.totalPlayTime.toFixed(0)} min</Text>
            </View>
            <View style={styles.sessionMetaItem}>
              <Ionicons name="timer-outline" size={14} color={colors.textMuted} />
              <Text style={styles.sessionMetaTxt}>Turtle {latest.turtleTimePercent}%</Text>
            </View>
            <View style={styles.sessionMetaItem}>
              <Ionicons name="logo-bitcoin" size={14} color="#F59E0B" />
              <Text style={styles.sessionMetaTxt}>{formatNumber(latest.totalCoinsSession)} coins</Text>
            </View>
            <View style={styles.sessionMetaItem}>
              <Ionicons name="fitness" size={14} color={colors.textMuted} />
              <Text style={styles.sessionMetaTxt}>{latest.exercises.length} exercises</Text>
            </View>
          </View>
          {/* Top 3 exercises */}
          <Text style={styles.topExLabel}>Top exercises this session:</Text>
          {latest.exercises
            .sort((a, b) => b.percentCorrect - a.percentCorrect)
            .slice(0, 3)
            .map(ex => (
              <View key={ex.name} style={styles.topEx}>
                <View style={[styles.exDot, { backgroundColor: getDomainColor(ex.domain) }]} />
                <Text style={styles.exName}>{ex.displayName}</Text>
                <Text style={[styles.exPct, { color: ex.percentCorrect >= 80 ? '#10B981' : '#F59E0B' }]}>
                  {ex.percentCorrect.toFixed(0)}%
                </Text>
              </View>
            ))}
        </View>

        {/* ── Milestone Banner ── */}
        {totalImprovement >= 40 && (
          <View style={[styles.milestoneBanner, shadows.sm]}>
            <Text style={styles.milestoneEmoji}>🎉</Text>
            <View style={styles.milestoneText}>
              <Text style={styles.milestoneTitle}>Amazing progress, {childProfile.firstName}!</Text>
              <Text style={styles.milestoneSub}>
                {childProfile.firstName} has improved {totalImprovement}% overall since starting BrainyAct. Keep going!
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  greeting: { ...typography.bodySmall, color: colors.textSecondary },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  childName: { ...typography.h2, color: colors.text },
  deficitBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.full,
  },
  deficitText: { ...typography.caption, color: '#EF4444', fontWeight: '700' },
  gamerTag: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  coinsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: borderRadius.full,
  },
  coinsText: { ...typography.body, color: '#F59E0B', fontWeight: '700' },
  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  banner: {
    backgroundColor: '#4F46E5', borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md,
  },
  bannerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  bannerLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  bannerBig: { ...typography.h2, color: '#fff', marginBottom: 4 },
  bannerSub: { ...typography.bodySmall, color: 'rgba(255,255,255,0.75)', maxWidth: 200 },
  ringContainer: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
  },
  ringValue: { ...typography.h3, color: '#fff' },
  ringLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  bannerStats: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.sm, paddingVertical: 10,
  },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.h3, color: '#fff' },
  statLabel: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  noteCard: {
    flexDirection: 'row', backgroundColor: '#EFF6FF', borderRadius: borderRadius.sm,
    padding: spacing.sm, gap: 8, marginBottom: spacing.md, alignItems: 'flex-start',
  },
  noteText: { ...typography.bodySmall, color: '#1D4ED8', flex: 1, lineHeight: 17 },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: spacing.sm, marginTop: 4 },
  domainGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  domainCard: {
    width: '31%', backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: 10, borderWidth: 1, borderColor: colors.border,
  },
  domainCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  domainIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  zonePill: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: borderRadius.full },
  zoneShort: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  domainCardName: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', marginBottom: 2 },
  domainPct: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  domainChange: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  domainChangeTxt: { ...typography.caption, fontWeight: '700' },
  sessionCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md,
    marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border,
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  sessionTitle: { ...typography.h4, color: colors.text },
  sessionDate: { ...typography.bodySmall, color: colors.textSecondary },
  avgBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: borderRadius.full },
  avgText: { ...typography.body, fontWeight: '700' },
  sessionMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.sm },
  sessionMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sessionMetaTxt: { ...typography.bodySmall, color: colors.textSecondary },
  topExLabel: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  topEx: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  exDot: { width: 7, height: 7, borderRadius: 4 },
  exName: { ...typography.body, color: colors.text, flex: 1 },
  exPct: { ...typography.body, fontWeight: '700' },
  milestoneBanner: {
    flexDirection: 'row', backgroundColor: '#FFFBEB', borderRadius: borderRadius.md,
    padding: spacing.md, gap: spacing.sm, alignItems: 'flex-start',
    borderWidth: 1, borderColor: '#FDE68A',
  },
  milestoneEmoji: { fontSize: 28 },
  milestoneText: { flex: 1 },
  milestoneTitle: { ...typography.h4, color: '#92400E', marginBottom: 2 },
  milestoneSub: { ...typography.bodySmall, color: '#B45309' },

});
