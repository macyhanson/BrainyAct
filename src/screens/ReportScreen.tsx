import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RadarChart from '../components/RadarChart';
import TrendBarChart from '../components/TrendBarChart';
import {
  childProfile, baselines, sessions, weeklyTrends, realLifeImprovements,
} from '../data/mockData';
import {
  DOMAINS, getDomainColor, getDomainIcon,
  getZone, getZoneColor, getZoneLabel,
  calcPointChange, formatDate, formatNumber,
} from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

export default function ReportScreen() {
  const b1  = baselines[0];
  const cur = baselines[baselines.length - 1];
  const latest = sessions[sessions.length - 1];
  const totalImprovement = Math.round(((b1.totalPercentage - cur.totalPercentage) / b1.totalPercentage) * 100);
  const ptChange = (b1.totalPercentage - cur.totalPercentage).toFixed(1);

  const radarB1  = DOMAINS.map(d => b1.domainScores.find(s => s.domain === d)!.percentage);
  const radarCur = DOMAINS.map(d => cur.domainScores.find(s => s.domain === d)!.percentage);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* ── Site Header ── */}
      <View style={styles.siteHeader}>
        <Text style={styles.logo}>Brainy<Text style={styles.logoAccent}>Act</Text></Text>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>Family Progress Report</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Child Hero ── */}
        <View style={[styles.hero, shadows.md]}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroName}>{childProfile.firstName} {childProfile.lastName}</Text>
            <Text style={styles.heroMeta}>
              Gamer: {childProfile.gamerName} · Age {childProfile.age} · {childProfile.grade} Grade
            </Text>
            <View style={styles.heroBadges}>
              <View style={styles.badgeWhite}>
                <Ionicons name="game-controller" size={11} color="#fff" />
                <Text style={styles.badgeWhiteText}>{childProfile.playCount} Play Sessions</Text>
              </View>
              <View style={styles.badgeWhite}>
                <Ionicons name="clipboard" size={11} color="#fff" />
                <Text style={styles.badgeWhiteText}>{childProfile.baselineCount} Baselines</Text>
              </View>
              <View style={styles.badgeRed}>
                <Ionicons name="pulse" size={11} color="#FCA5A5" />
                <Text style={styles.badgeRedText}>{childProfile.brainDeficit}-Brain Deficit</Text>
              </View>
              <View style={styles.badgeWhite}>
                <Ionicons name="logo-bitcoin" size={11} color="#FDE68A" />
                <Text style={styles.badgeWhiteText}>{formatNumber(childProfile.totalCoins)} Coins</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroRight}>
            <View style={styles.heroStats}>
              {[
                { val: childProfile.baselineCount, lbl: 'Baselines' },
                { val: childProfile.playCount,     lbl: 'Play' },
                { val: childProfile.totalCount,    lbl: 'Total' },
              ].map((s, i) => (
                <React.Fragment key={s.lbl}>
                  {i > 0 && <View style={styles.heroStatDivider} />}
                  <View style={styles.heroStat}>
                    <Text style={styles.heroStatVal}>{s.val}</Text>
                    <Text style={styles.heroStatLbl}>{s.lbl}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
            <View style={styles.heroRing}>
              <Text style={styles.heroRingVal}>{totalImprovement}%</Text>
              <Text style={styles.heroRingLbl}>better</Text>
            </View>
          </View>
        </View>

        {/* ── Zone Legend ── */}
        <View style={styles.zoneLegend}>
          <Text style={styles.zoneLegendTitle}>
            How to read: Lower % = fewer symptoms = better
          </Text>
          <View style={styles.zoneLegendRow}>
            {[
              { color: '#10B981', label: 'Typical Range', range: '0–24.9%' },
              { color: '#F59E0B', label: 'Mild Weakness',  range: '25–49.9%' },
              { color: '#EF4444', label: 'Area of Focus',  range: '50%+' },
            ].map(z => (
              <View key={z.label} style={styles.zoneItem}>
                <View style={[styles.zoneDot, { backgroundColor: z.color }]} />
                <View>
                  <Text style={[styles.zoneLabel, { color: z.color }]}>{z.label}</Text>
                  <Text style={styles.zoneRange}>{z.range}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Section: Assessment Baselines ── */}
        <Text style={styles.sectionTitle}>Assessment Baselines</Text>
        <View style={styles.baselineGrid}>
          {baselines.map(b => {
            const isLatest = b.number === baselines.length;
            const zColor = getZoneColor(getZone(b.totalPercentage));
            const zLabel = getZoneLabel(getZone(b.totalPercentage));
            return (
              <View key={b.number} style={[styles.baselineCard, isLatest && styles.baselineCardActive, shadows.sm]}>
                <Text style={[styles.baselineNum, isLatest && { color: colors.primary }]}>
                  Baseline {b.number}{isLatest ? ' · Current' : ''}
                </Text>
                <Text style={styles.baselineDate}>{formatDate(b.date)}</Text>
                <Text style={[styles.baselinePct, { color: isLatest ? colors.primary : zColor }]}>
                  {b.totalPercentage.toFixed(1)}%
                </Text>
                <Text style={styles.baselineScore}>{b.totalScore} / {b.totalMax} pts</Text>
                <View style={[styles.baselineZone, { backgroundColor: isLatest ? '#D1FAE5' : `${zColor}18` }]}>
                  <Text style={[styles.baselineZoneText, { color: isLatest ? '#065F46' : zColor }]}>
                    {isLatest ? `↓ ${ptChange} pts improved` : zLabel}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Section: Domain Progress ── */}
        <Text style={styles.sectionTitle}>Domain Progress — Baseline 1 vs. Current</Text>
        <View style={[styles.card, shadows.sm]}>
          {DOMAINS.map(domain => {
            const b1Score  = b1.domainScores.find(d => d.domain === domain)!;
            const curScore = cur.domainScores.find(d => d.domain === domain)!;
            const zColor   = getZoneColor(getZone(curScore.percentage));
            const zLabel   = getZoneLabel(getZone(curScore.percentage));
            const dColor   = getDomainColor(domain);
            const ptDiff   = calcPointChange(b1Score.percentage, curScore.percentage);
            const improved = ptDiff > 0;
            return (
              <View key={domain} style={styles.domainBarBlock}>
                <View style={styles.domainBarHeader}>
                  <View style={[styles.domainIcon, { backgroundColor: `${dColor}18` }]}>
                    <Ionicons name={getDomainIcon(domain) as any} size={14} color={dColor} />
                  </View>
                  <Text style={styles.domainBarName}>{domain}</Text>
                  <View style={[styles.zonePill, { backgroundColor: `${zColor}18` }]}>
                    <View style={[styles.zonePillDot, { backgroundColor: zColor }]} />
                    <Text style={[styles.zonePillText, { color: zColor }]}>{zLabel}</Text>
                  </View>
                  {ptDiff !== 0 && (
                    <View style={[styles.changePill, { backgroundColor: improved ? '#D1FAE5' : '#FEE2E2' }]}>
                      <Ionicons
                        name={improved ? 'trending-down' : 'trending-up'}
                        size={10}
                        color={improved ? '#10B981' : '#EF4444'}
                      />
                      <Text style={[styles.changePillText, { color: improved ? '#10B981' : '#EF4444' }]}>
                        {improved ? '-' : '+'}{Math.abs(ptDiff).toFixed(1)} pts
                      </Text>
                    </View>
                  )}
                </View>
                {/* Baseline 1 bar */}
                <View style={styles.barRow}>
                  <Text style={styles.barLbl}>Baseline 1</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.min(b1Score.percentage, 100)}%`, backgroundColor: '#EF444470' }]} />
                  </View>
                  <Text style={[styles.barPct, { color: '#EF4444' }]}>{b1Score.percentage.toFixed(1)}%</Text>
                </View>
                {/* Current bar */}
                <View style={styles.barRow}>
                  <Text style={styles.barLbl}>Current</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.min(curScore.percentage, 100)}%`, backgroundColor: zColor }]} />
                  </View>
                  <Text style={[styles.barPct, { color: zColor }]}>{curScore.percentage.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Section: All Baselines Comparison Table ── */}
        <Text style={styles.sectionTitle}>All Baselines Comparison</Text>
        <View style={[styles.compTable, shadows.sm]}>
          <View style={styles.compHeader}>
            <Text style={[styles.compCell, { flex: 2, textAlign: 'left' }]}>Domain</Text>
            {baselines.map(b => (
              <Text key={b.number} style={styles.compCell}>B{b.number}</Text>
            ))}
            <Text style={styles.compCell}>Change</Text>
          </View>
          {DOMAINS.map((domain, i) => {
            const first  = baselines[0].domainScores.find(d => d.domain === domain)!;
            const last   = baselines[baselines.length - 1].domainScores.find(d => d.domain === domain)!;
            const change = calcPointChange(first.percentage, last.percentage);
            const improved = change > 0;
            return (
              <View key={domain} style={[styles.compRow, i % 2 === 1 && styles.compRowAlt]}>
                <View style={[styles.compDomainCell, { flex: 2 }]}>
                  <View style={[styles.compDot, { backgroundColor: getDomainColor(domain) }]} />
                  <Text style={styles.compDomainText}>{domain}</Text>
                </View>
                {baselines.map(b => {
                  const s  = b.domainScores.find(d => d.domain === domain)!;
                  const zc = getZoneColor(getZone(s.percentage));
                  return (
                    <Text key={b.number} style={[styles.compCell, { color: zc, fontWeight: '700' }]}>
                      {s.percentage.toFixed(1)}
                    </Text>
                  );
                })}
                <View style={[styles.compCell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }]}>
                  <Ionicons
                    name={improved ? 'arrow-down' : change < 0 ? 'arrow-up' : 'remove'}
                    size={11}
                    color={improved ? '#10B981' : change < 0 ? '#EF4444' : '#94A3B8'}
                  />
                  <Text style={[styles.compChangeText, { color: improved ? '#10B981' : change < 0 ? '#EF4444' : '#94A3B8' }]}>
                    {Math.abs(change).toFixed(1)}
                  </Text>
                </View>
              </View>
            );
          })}
          <View style={styles.compFooter}>
            <Text style={[styles.compCell, { flex: 2, textAlign: 'left', color: '#fff' }]}>TOTAL</Text>
            {baselines.map(b => {
              const c = b.totalPercentage < 25 ? '#34D399' : b.totalPercentage < 50 ? '#FCD34D' : '#F87171';
              return (
                <Text key={b.number} style={[styles.compCell, { color: c, fontWeight: '800' }]}>
                  {b.totalPercentage.toFixed(1)}
                </Text>
              );
            })}
            <View style={[styles.compCell, { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 }]}>
              <Ionicons name="arrow-down" size={11} color="#34D399" />
              <Text style={[styles.compChangeText, { color: '#34D399' }]}>
                {(b1.totalPercentage - cur.totalPercentage).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Section: Left vs Right Brain ── */}
        <Text style={styles.sectionTitle}>Left vs Right Brain Scores</Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.brainRow}>
            <View style={styles.brainSide}>
              <Text style={styles.brainSideTitle}>LEFT BRAIN</Text>
              {baselines.map((b, i) => (
                <Text key={b.number} style={[styles.brainScore, {
                  color: i === 0 ? '#EF4444' : i === 1 ? '#F59E0B' : '#10B981'
                }]}>
                  Baseline {b.number}: <Text style={{ fontWeight: '700' }}>{b.leftTotalScore} pts</Text>
                </Text>
              ))}
              <View style={styles.brainImproveTag}>
                <Text style={styles.brainImproveText}>
                  ↓ {b1.leftTotalScore - cur.leftTotalScore} pts improved
                </Text>
              </View>
            </View>
            <View style={styles.brainDivider} />
            <View style={styles.brainSide}>
              <Text style={styles.brainSideTitle}>RIGHT BRAIN</Text>
              {baselines.map((b, i) => (
                <Text key={b.number} style={[styles.brainScore, {
                  color: i === 0 ? '#EF4444' : i === 1 ? '#F59E0B' : '#10B981'
                }]}>
                  Baseline {b.number}: <Text style={{ fontWeight: '700' }}>{b.rightTotalScore} pts</Text>
                </Text>
              ))}
              <View style={styles.brainImproveTag}>
                <Text style={styles.brainImproveText}>
                  ↓ {b1.rightTotalScore - cur.rightTotalScore} pts improved
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.deficitNote}>
            <Ionicons name="pulse" size={14} color="#EF4444" />
            <Text style={styles.deficitNoteText}>
              <Text style={{ fontWeight: '700' }}>{childProfile.brainDeficit}-brain deficit identified.</Text>
              {' '}BrainyAct targets both hemispheres with additional emphasis on the {childProfile.brainDeficit.toLowerCase()} hemisphere for {childProfile.firstName}.
            </Text>
          </View>
        </View>

        {/* ── Section: Spider Chart ── */}
        <Text style={styles.sectionTitle}>Progress Spider Chart</Text>
        <View style={[styles.card, styles.centeredCard, shadows.sm]}>
          <RadarChart baseline1={radarB1} baseline3={radarCur} size={260} />
        </View>

        {/* ── Section: Training Accuracy Trend ── */}
        <Text style={styles.sectionTitle}>10-Week Training Accuracy Trend</Text>
        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardSub}>
            Average % correct per exercise across weekly training sessions. Higher = better.
          </Text>
          <View style={styles.trendLegend}>
            {[['Motor', '#6366F1'], ['Sensory', '#3B82F6'], ['Academic', '#8B5CF6']].map(([label, color]) => (
              <View key={label} style={styles.trendLegendItem}>
                <View style={[styles.trendDot, { backgroundColor: color as string }]} />
                <Text style={[styles.trendLegendText, { color: color as string }]}>{label}</Text>
              </View>
            ))}
          </View>
          <TrendBarChart data={weeklyTrends} showDomains={true} />
        </View>

        {/* ── Section: Latest Session ── */}
        <Text style={styles.sectionTitle}>
          Latest Session — Play #{latest.playNumber} ({formatDate(latest.date)})
        </Text>
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.sessionStats}>
            {[
              { val: `${latest.averagePercent}%`, lbl: 'Avg Accuracy', color: latest.averagePercent >= 80 ? '#10B981' : '#F59E0B' },
              { val: `${latest.totalPlayTime.toFixed(0)}`, lbl: 'Minutes', color: colors.primary },
              { val: `${latest.turtleTimePercent}%`, lbl: '🐢 Turtle', color: colors.text },
              { val: formatNumber(latest.totalCoinsSession), lbl: '🪙 Coins', color: '#F59E0B' },
            ].map(s => (
              <View key={s.lbl} style={styles.sessionStat}>
                <Text style={[styles.sessionStatVal, { color: s.color }]}>{s.val}</Text>
                <Text style={styles.sessionStatLbl}>{s.lbl}</Text>
              </View>
            ))}
          </View>
          {/* Exercises sorted by accuracy */}
          {[...latest.exercises]
            .sort((a, b) => b.percentCorrect - a.percentCorrect)
            .map(ex => {
              const pctColor = ex.percentCorrect >= 80 ? '#10B981' : ex.percentCorrect >= 60 ? '#F59E0B' : '#EF4444';
              const dColor   = getDomainColor(ex.domain);
              return (
                <View key={ex.name} style={styles.exRow}>
                  <View style={[styles.exDot, { backgroundColor: dColor }]} />
                  <View style={styles.exInfo}>
                    <Text style={styles.exName}>
                      {ex.displayName}{ex.consecutiveFreqAchieved > 0 ? ' ⭐' : ''}
                    </Text>
                    <Text style={styles.exMeta}>
                      {ex.numberCorrect}/{ex.numberTotal} correct · Lv.{ex.level} · {ex.domain}
                    </Text>
                  </View>
                  <View style={styles.exRight}>
                    <View style={styles.exBarRow}>
                      <View style={styles.exTrack}>
                        <View style={[styles.exFill, { width: `${ex.percentCorrect}%`, backgroundColor: pctColor }]} />
                      </View>
                      <Text style={[styles.exPct, { color: pctColor }]}>
                        {ex.percentCorrect.toFixed(0)}%
                      </Text>
                    </View>
                    <Text style={styles.exCoins}>🪙 {ex.coins}</Text>
                  </View>
                </View>
              );
            })}
        </View>

        {/* ── Section: Session History ── */}
        <Text style={styles.sectionTitle}>Session History Overview</Text>
        <View style={[styles.tableCard, shadows.sm]}>
          <View style={styles.tableHeader}>
            <Text style={[styles.thCell, { flex: 1.2 }]}>Session</Text>
            <Text style={[styles.thCell, { flex: 1.5 }]}>Date</Text>
            <Text style={[styles.thCell, { flex: 0.8 }]}>Min</Text>
            <Text style={[styles.thCell, { flex: 0.8 }]}>🐢</Text>
            <Text style={[styles.thCell, { flex: 1.2 }]}>Accuracy</Text>
            <Text style={[styles.thCell, { flex: 1 }]}>🪙</Text>
          </View>
          {sessions.map((s, i) => {
            const prev  = i > 0 ? sessions[i - 1].averagePercent : null;
            const delta = prev !== null ? s.averagePercent - prev : null;
            const accColor = s.averagePercent >= 80 ? '#10B981' : s.averagePercent >= 60 ? '#F59E0B' : '#EF4444';
            return (
              <View key={s.id} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
                <Text style={[styles.tdCell, { flex: 1.2, fontWeight: '700' }]}>#{s.playNumber}</Text>
                <Text style={[styles.tdCell, { flex: 1.5 }]}>
                  {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={[styles.tdCell, { flex: 0.8 }]}>{s.totalPlayTime.toFixed(0)}</Text>
                <Text style={[styles.tdCell, { flex: 0.8 }]}>{s.turtleTimePercent}%</Text>
                <View style={[{ flex: 1.2, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 6 }]}>
                  <Text style={[styles.tdCell, { flex: 0, color: accColor, fontWeight: '700', paddingHorizontal: 0 }]}>
                    {s.averagePercent}%
                  </Text>
                  {delta !== null && (
                    <Text style={{ fontSize: 10, color: delta >= 0 ? '#10B981' : '#EF4444', fontWeight: '700' }}>
                      {delta >= 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(0)}
                    </Text>
                  )}
                </View>
                <Text style={[styles.tdCell, { flex: 1 }]}>{formatNumber(s.totalCoinsSession)}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Section: Real-Life Improvements ── */}
        <Text style={styles.sectionTitle}>Real-Life Improvements</Text>
        <Text style={styles.improveSub}>
          Families who complete BrainyAct typically observe these gains in their child's daily life.
        </Text>
        {realLifeImprovements.map((item, i) => (
          <View key={i} style={[styles.improveCard, shadows.sm]}>
            <View style={styles.improveHeader}>
              <View style={[styles.improveIcon, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={styles.improveTitle}>{item.title}</Text>
            </View>
            {item.improvements.map((imp, j) => (
              <View key={j} style={styles.improveItem}>
                <View style={[styles.checkDot, { backgroundColor: item.color }]}>
                  <Ionicons name="checkmark" size={9} color="#fff" />
                </View>
                <Text style={styles.improveText}>{imp}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>BrainyAct</Text>
          <Text style={styles.footerText}>
            Neurodevelopmental Training Program{'\n'}
            This report was generated from BrainyAct portal assessment data.{'\n'}
            For questions about your child's progress, contact your BrainyAct practitioner.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Site header
  siteHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#1D4ED8', paddingHorizontal: spacing.md, paddingVertical: 14,
  },
  logo: { fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  logoAccent: { color: '#93C5FD' },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  headerBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.md },

  // Hero
  hero: {
    background: 'transparent',
    backgroundColor: '#4F46E5', borderRadius: borderRadius.lg,
    padding: spacing.md, marginBottom: spacing.md,
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md,
  },
  heroLeft: { flex: 1, minWidth: 180 },
  heroName: { fontSize: 22, fontWeight: '900', color: '#fff', marginBottom: 4 },
  heroMeta: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 10 },
  heroBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badgeWhite: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeWhiteText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  badgeRed: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(239,68,68,0.25)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeRedText: { color: '#FCA5A5', fontSize: 11, fontWeight: '700' },
  heroRight: { alignItems: 'center', gap: 10 },
  heroStats: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10, overflow: 'hidden',
  },
  heroStatDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroStat: { paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center' },
  heroStatVal: { fontSize: 22, fontWeight: '900', color: '#fff' },
  heroStatLbl: { fontSize: 10, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  heroRing: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroRingVal: { fontSize: 22, fontWeight: '900', color: '#fff' },
  heroRingLbl: { fontSize: 10, color: 'rgba(255,255,255,0.7)' },

  // Zone legend
  zoneLegend: {
    backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#A7F3D0',
    borderRadius: borderRadius.sm, padding: 14, marginBottom: spacing.md,
  },
  zoneLegendTitle: { fontSize: 12, fontWeight: '700', color: '#065F46', marginBottom: 8 },
  zoneLegendRow: { flexDirection: 'row', gap: 14, flexWrap: 'wrap' },
  zoneItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  zoneDot: { width: 10, height: 10, borderRadius: 5 },
  zoneLabel: { fontSize: 11, fontWeight: '700' },
  zoneRange: { fontSize: 10, color: colors.textMuted },

  // Section title
  sectionTitle: {
    fontSize: 15, fontWeight: '800', color: colors.text,
    marginBottom: spacing.sm, marginTop: spacing.xs,
    borderBottomWidth: 2, borderBottomColor: colors.border, paddingBottom: 6,
  },

  // Baseline grid
  baselineGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  baselineCard: {
    flex: 1, backgroundColor: colors.surfaceAlt, borderRadius: borderRadius.sm,
    borderWidth: 1, borderColor: colors.border, padding: 12, alignItems: 'center',
  },
  baselineCardActive: { backgroundColor: '#EFF6FF', borderColor: colors.primary },
  baselineNum: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  baselineDate: { fontSize: 10, color: colors.textMuted, marginTop: 3, marginBottom: 6, textAlign: 'center' },
  baselinePct: { fontSize: 24, fontWeight: '900' },
  baselineScore: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  baselineZone: { marginTop: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  baselineZoneText: { fontSize: 10, fontWeight: '700', textAlign: 'center' },

  // Card
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.md,
  },
  centeredCard: { alignItems: 'center' },
  cardSub: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },

  // Domain bars
  domainBarBlock: { marginBottom: 14 },
  domainBarHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  domainIcon: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  domainBarName: { ...typography.body, color: colors.text, fontWeight: '700', flex: 1 },
  zonePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20, gap: 4 },
  zonePillDot: { width: 6, height: 6, borderRadius: 3 },
  zonePillText: { fontSize: 10, fontWeight: '700' },
  changePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 20, gap: 3 },
  changePillText: { fontSize: 10, fontWeight: '700' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  barLbl: { fontSize: 10, color: colors.textMuted, width: 62 },
  barTrack: { flex: 1, height: 10, backgroundColor: colors.borderLight, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barPct: { fontSize: 11, fontWeight: '700', width: 38, textAlign: 'right' },

  // Comparison table
  compTable: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    overflow: 'hidden', marginBottom: spacing.md,
  },
  compHeader: {
    flexDirection: 'row', backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.sm, paddingVertical: 9,
  },
  compCell: {
    width: 46, textAlign: 'center',
    fontSize: 11, fontWeight: '600', color: colors.textSecondary,
    paddingHorizontal: 2,
  },
  compRow: { flexDirection: 'row', paddingHorizontal: spacing.sm, paddingVertical: 9, alignItems: 'center' },
  compRowAlt: { backgroundColor: colors.surfaceAlt },
  compDomainCell: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  compDot: { width: 7, height: 7, borderRadius: 4 },
  compDomainText: { fontSize: 12, color: colors.text, fontWeight: '600' },
  compChangeText: { fontSize: 12, fontWeight: '700' },
  compFooter: {
    flexDirection: 'row', backgroundColor: '#1E293B',
    paddingHorizontal: spacing.sm, paddingVertical: 9, alignItems: 'center',
  },

  // Brain
  brainRow: { flexDirection: 'row', marginBottom: spacing.sm },
  brainSide: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  brainDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  brainSideTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, marginBottom: 6 },
  brainScore: { fontSize: 11, marginBottom: 2 },
  brainImproveTag: { backgroundColor: '#D1FAE5', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 },
  brainImproveText: { fontSize: 11, fontWeight: '700', color: '#065F46' },
  deficitNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#FEF2F2', padding: 10, borderRadius: borderRadius.sm,
  },
  deficitNoteText: { ...typography.bodySmall, color: '#991B1B', flex: 1 },

  // Trend
  trendLegend: { flexDirection: 'row', gap: 14, marginBottom: 8 },
  trendLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  trendDot: { width: 8, height: 8, borderRadius: 4 },
  trendLegendText: { fontSize: 11, fontWeight: '700' },

  // Session stats
  sessionStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: spacing.md },
  sessionStat: { alignItems: 'center', minWidth: 70 },
  sessionStatVal: { fontSize: 20, fontWeight: '900' },
  sessionStatLbl: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  // Exercise rows
  exRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 9,
    borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: 8,
  },
  exDot: { width: 8, height: 8, borderRadius: 4, marginTop: 1 },
  exInfo: { flex: 1 },
  exName: { fontSize: 13, fontWeight: '600', color: colors.text },
  exMeta: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  exRight: { alignItems: 'flex-end', gap: 3, minWidth: 110 },
  exBarRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  exTrack: { width: 70, height: 7, backgroundColor: colors.borderLight, borderRadius: 4, overflow: 'hidden' },
  exFill: { height: '100%', borderRadius: 4 },
  exPct: { fontSize: 11, fontWeight: '800', width: 30, textAlign: 'right' },
  exCoins: { fontSize: 10, color: '#F59E0B', fontWeight: '600' },

  // Session table
  tableCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    overflow: 'hidden', marginBottom: spacing.md,
  },
  tableHeader: {
    flexDirection: 'row', backgroundColor: colors.surfaceAlt,
    paddingVertical: 9, borderBottomWidth: 2, borderBottomColor: colors.border,
  },
  thCell: {
    flex: 1, fontSize: 10, fontWeight: '600', color: colors.textSecondary,
    textTransform: 'uppercase', letterSpacing: 0.4, paddingHorizontal: 6,
  },
  tableRow: { flexDirection: 'row', paddingVertical: 9, alignItems: 'center' },
  tableRowAlt: { backgroundColor: colors.surfaceAlt },
  tdCell: { flex: 1, fontSize: 12, color: colors.text, paddingHorizontal: 6 },

  // Improvements
  improveSub: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.sm, marginTop: -4 },
  improveCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm,
  },
  improveHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 10 },
  improveIcon: { width: 36, height: 36, borderRadius: borderRadius.sm, alignItems: 'center', justifyContent: 'center' },
  improveTitle: { ...typography.h4, color: colors.text, flex: 1 },
  improveItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 5 },
  checkDot: { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  improveText: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, lineHeight: 18 },

  // Footer
  footer: {
    marginTop: spacing.lg, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center',
  },
  footerTitle: { ...typography.h4, color: colors.text, marginBottom: 6 },
  footerText: { ...typography.caption, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
});
