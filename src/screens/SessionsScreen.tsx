import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ExerciseRow from '../components/ExerciseRow';
import TrendBarChart from '../components/TrendBarChart';
import { sessions, weeklyTrends, childProfile } from '../data/mockData';
import { seedVariants } from '../data/seedVariants';
import { getDomainColor, formatDate, formatNumber } from '../utils/helpers';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import { Session, Domain } from '../types';
import { createInitialAdaptiveProfile, recommendVariant, updateAdaptiveProfile } from '../utils/adaptiveEngine';
import { ExerciseCategory, ExerciseResult } from '../types/adaptive';

type ViewMode = 'sessions' | 'trends';

export default function SessionsScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('sessions');
  const [selectedSession, setSelectedSession] = useState<Session>(sessions[sessions.length - 1]);
  const [domainFilter, setDomainFilter] = useState<Domain | 'All'>('All');

  const filteredExercises = domainFilter === 'All'
    ? selectedSession.exercises
    : selectedSession.exercises.filter(e => e.domain === domainFilter);

  const domainsInSession = Array.from(new Set(selectedSession.exercises.map(e => e.domain)));
  const categoryMap: Record<Domain, ExerciseCategory> = {
    Motor: 'coordination',
    Sensory: 'balance',
    Behavior: 'calm',
    Communication: 'bilateral',
    Academic: 'strength',
    Health: 'strength',
  };

  const adaptiveResults: ExerciseResult[] = selectedSession.exercises.map((exercise) => ({
    missionId: `session-${selectedSession.id}`,
    childId: childProfile.id,
    date: selectedSession.date,
    exerciseId: exercise.name,
    category: categoryMap[exercise.domain],
    levelPlayed: (Math.max(1, Math.min(3, exercise.level)) as 1 | 2 | 3),
    completed: exercise.percentCorrect >= 60,
    skipped: exercise.percentCorrect < 30,
    tooHardTapped: exercise.percentCorrect < 50,
    doAgainTapped: exercise.percentCorrect >= 90,
    attempts: exercise.percentCorrect >= 80 ? 1 : exercise.percentCorrect >= 50 ? 2 : 3,
    durationSecActual: Math.max(20, Math.round((exercise.levelUpGoal / Math.max(1, exercise.levelUpFreq)) * 6)),
  }));

  const adaptiveProfile = updateAdaptiveProfile(
    createInitialAdaptiveProfile(childProfile.id),
    adaptiveResults,
    seedVariants
  );

  const recommendedByCategory = (Object.keys(adaptiveProfile.categories) as ExerciseCategory[]).map((category) => {
    const categoryState = adaptiveProfile.categories[category];
    const recommendation = recommendVariant(seedVariants, category, categoryState.currentLevel);
    return { category, state: categoryState, recommendation };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Training Sessions</Text>
        <View style={styles.modeToggle}>
          {(['sessions', 'trends'] as ViewMode[]).map(m => (
            <TouchableOpacity key={m} style={[styles.modeBtn, viewMode === m && styles.modeBtnActive]} onPress={() => setViewMode(m)}>
              <Text style={[styles.modeBtnText, viewMode === m && styles.modeBtnTextActive]}>
                {m === 'sessions' ? 'Sessions' : 'Trends'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {viewMode === 'trends' ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Overall trend */}
          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.cardTitle}>Average Accuracy Over 10 Weeks</Text>
            <Text style={styles.cardSub}>Higher % = better exercise performance</Text>
            <TrendBarChart data={weeklyTrends} showDomains={false} />
          </View>

          {/* Domain-specific trends */}
          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.cardTitle}>Progress by Domain</Text>
            <Text style={styles.cardSub}>Motor · Sensory · Academic accuracy over time</Text>
            <TrendBarChart data={weeklyTrends} showDomains={true} />
          </View>

          {/* Session summary table */}
          <View style={[styles.card, shadows.sm]}>
            <Text style={styles.cardTitle}>Session History</Text>
            {sessions.map((s, i) => {
              const prev = i > 0 ? sessions[i - 1].averagePercent : null;
              const delta = prev !== null ? s.averagePercent - prev : null;
              return (
                <View key={s.id} style={[styles.summaryRow, i < sessions.length - 1 && styles.summaryRowBorder]}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryPlay}>Play #{s.playNumber}</Text>
                    <Text style={styles.summaryDate}>{formatDate(s.date)}</Text>
                  </View>
                  <View style={styles.summaryMid}>
                    <Text style={styles.summaryTime}>{s.totalPlayTime.toFixed(0)} min</Text>
                    <Text style={styles.summaryTurtle}>🐢 {s.turtleTimePercent}%</Text>
                  </View>
                  <View style={styles.summaryRight}>
                    <Text style={[styles.summaryAvg, {
                      color: s.averagePercent >= 80 ? '#10B981' : s.averagePercent >= 60 ? '#F59E0B' : '#EF4444'
                    }]}>
                      {s.averagePercent}%
                    </Text>
                    {delta !== null && (
                      <Text style={[styles.summaryDelta, { color: delta >= 0 ? '#10B981' : '#EF4444' }]}>
                        {delta >= 0 ? '▲' : '▼'}{Math.abs(delta).toFixed(1)}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      ) : (
        <View style={styles.flex}>
          {/* Session selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sessionPicker}>
            {[...sessions].reverse().map(s => {
              const active = s.id === selectedSession.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.sessionChip, active && styles.sessionChipActive]}
                  onPress={() => setSelectedSession(s)}
                >
                  <Text style={[styles.chipPlay, active && { color: '#fff' }]}>Play #{s.playNumber}</Text>
                  <Text style={[styles.chipDate, active && { color: 'rgba(255,255,255,0.8)' }]}>
                    {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                  <Text style={[styles.chipAvg, { color: active ? '#fff' : s.averagePercent >= 80 ? '#10B981' : s.averagePercent >= 60 ? '#F59E0B' : '#EF4444' }]}>
                    {s.averagePercent}%
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Session overview */}
          <View style={[styles.sessionOverview, shadows.sm]}>
            <View style={styles.overviewRow}>
              {[
                { icon: 'time', label: 'Play Time', value: `${selectedSession.totalPlayTime.toFixed(0)} min` },
                { icon: 'turtle', label: 'Turtle Time', value: `${selectedSession.turtleTimePercent}%` },
                { icon: 'analytics', label: 'Avg Accuracy', value: `${selectedSession.averagePercent}%` },
                { icon: 'logo-bitcoin', label: 'Coins', value: formatNumber(selectedSession.totalCoinsSession) },
              ].map(item => (
                <View key={item.label} style={styles.overviewItem}>
                  <Ionicons name={item.icon as any} size={16} color={colors.primary} />
                  <Text style={styles.overviewVal}>{item.value}</Text>
                  <Text style={styles.overviewLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={[styles.adaptiveCard, shadows.sm]}>
            <Text style={styles.cardTitle}>Adaptive Difficulty Suggestions</Text>
            <Text style={styles.cardSub}>
              Recommendations auto-adjust based on completion, retries, and “too hard” signals.
            </Text>
            {recommendedByCategory.map(({ category, state, recommendation }) => (
              <View key={category} style={styles.adaptiveRow}>
                <View style={styles.adaptiveLeft}>
                  <Text style={styles.adaptiveCategory}>{category}</Text>
                  <Text style={styles.adaptiveMeta}>
                    Success {(state.rollingSuccessRate * 100).toFixed(0)}% · Confidence {(state.confidence * 100).toFixed(0)}%
                  </Text>
                </View>
                <View style={styles.adaptiveRight}>
                  <Text style={styles.adaptiveLevel}>L{state.currentLevel}</Text>
                  <Text style={styles.adaptiveTitle} numberOfLines={1}>
                    {recommendation?.title ?? 'No variant'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Domain filter pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.domainPills}>
            {(['All', ...domainsInSession] as (Domain | 'All')[]).map(d => {
              const active = domainFilter === d;
              const dColor = d === 'All' ? colors.primary : getDomainColor(d as Domain);
              return (
                <TouchableOpacity
                  key={d}
                  style={[styles.domainPill, active && { backgroundColor: dColor }]}
                  onPress={() => setDomainFilter(d)}
                >
                  <Text style={[styles.domainPillText, active ? { color: '#fff' } : { color: dColor }]}>{d}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Exercise list */}
          <FlatList
            data={filteredExercises}
            keyExtractor={item => item.name}
            renderItem={({ item }) => <ExerciseRow exercise={item} showDomain={true} />}
            contentContainerStyle={styles.exerciseList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <Text style={styles.exerciseCount}>{filteredExercises.length} exercises</Text>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  title: { ...typography.h2, color: colors.text },
  modeToggle: {
    flexDirection: 'row', backgroundColor: colors.surface,
    borderRadius: borderRadius.md, padding: 3, borderWidth: 1, borderColor: colors.border,
  },
  modeBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 },
  modeBtnActive: { backgroundColor: colors.primary },
  modeBtnText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600' },
  modeBtnTextActive: { color: '#fff' },
  scroll: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    padding: spacing.md, marginBottom: spacing.md,
  },
  cardTitle: { ...typography.h4, color: colors.text, marginBottom: 2 },
  cardSub: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  summaryRow: {
    flexDirection: 'row', paddingVertical: 10, alignItems: 'center',
  },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  summaryLeft: { flex: 2 },
  summaryMid: { flex: 2, alignItems: 'center' },
  summaryRight: { flex: 1, alignItems: 'flex-end' },
  summaryPlay: { ...typography.body, color: colors.text, fontWeight: '600' },
  summaryDate: { ...typography.caption, color: colors.textMuted },
  summaryTime: { ...typography.bodySmall, color: colors.textSecondary },
  summaryTurtle: { ...typography.caption, color: colors.textMuted },
  summaryAvg: { ...typography.h4 },
  summaryDelta: { ...typography.caption, fontWeight: '700' },
  sessionPicker: {
    paddingHorizontal: spacing.md, paddingVertical: 10, gap: spacing.sm,
  },
  sessionChip: {
    backgroundColor: colors.surface, borderRadius: borderRadius.md,
    paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.border, minWidth: 80,
  },
  sessionChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipPlay: { ...typography.body, color: colors.text, fontWeight: '700' },
  chipDate: { ...typography.caption, color: colors.textMuted },
  chipAvg: { ...typography.body, fontWeight: '700', marginTop: 2 },
  sessionOverview: {
    backgroundColor: colors.surface, marginHorizontal: spacing.md,
    borderRadius: borderRadius.md, marginBottom: spacing.sm,
    paddingVertical: 10,
  },
  overviewRow: { flexDirection: 'row' },
  overviewItem: { flex: 1, alignItems: 'center', gap: 3 },
  overviewVal: { ...typography.h4, color: colors.text },
  overviewLabel: { ...typography.caption, color: colors.textMuted },
  adaptiveCard: {
    backgroundColor: colors.surface, marginHorizontal: spacing.md,
    borderRadius: borderRadius.md, marginBottom: spacing.sm, marginTop: spacing.sm,
    padding: spacing.md, borderWidth: 1, borderColor: colors.borderLight,
  },
  adaptiveRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.borderLight,
  },
  adaptiveLeft: { flex: 1, paddingRight: 10 },
  adaptiveRight: { width: 130, alignItems: 'flex-end' },
  adaptiveCategory: { ...typography.body, color: colors.text, fontWeight: '700', textTransform: 'capitalize' },
  adaptiveMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  adaptiveLevel: { ...typography.bodySmall, color: colors.primary, fontWeight: '800' },
  adaptiveTitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2, maxWidth: 130, textAlign: 'right' },
  domainPills: {
    paddingHorizontal: spacing.md, gap: 8, paddingBottom: 10,
  },
  domainPill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: borderRadius.full,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
  },
  domainPillText: { ...typography.bodySmall, fontWeight: '700' },
  exerciseList: { paddingHorizontal: spacing.md, paddingBottom: 32 },
  exerciseCount: { ...typography.label, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
});
