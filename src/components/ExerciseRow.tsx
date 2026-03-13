import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SessionExercise } from '../types';
import { getDomainColor, getPctColor } from '../utils/helpers';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

interface Props {
  exercise: SessionExercise;
  showDomain?: boolean;
}

export default function ExerciseRow({ exercise, showDomain = true }: Props) {
  const pctColor = getPctColor(exercise.percentCorrect);
  const domainColor = getDomainColor(exercise.domain);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {showDomain && (
          <View style={[styles.domainDot, { backgroundColor: domainColor }]} />
        )}
        <View style={styles.nameBlock}>
          <Text style={styles.name}>{exercise.displayName}</Text>
          <Text style={styles.meta}>
            {exercise.numberCorrect}/{exercise.numberTotal} correct · Lv.{exercise.level}
            {exercise.consecutiveFreqAchieved > 0 && ' · ⭐ Level Up!'}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {/* Accuracy bar */}
        <View style={styles.barArea}>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${exercise.percentCorrect}%`, backgroundColor: pctColor },
              ]}
            />
          </View>
          <Text style={[styles.pct, { color: pctColor }]}>
            {exercise.percentCorrect.toFixed(0)}%
          </Text>
        </View>
        {/* Coins */}
        <View style={styles.coinsRow}>
          <Ionicons name="logo-bitcoin" size={11} color="#F59E0B" />
          <Text style={styles.coins}>{exercise.coins}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 1,
  },
  nameBlock: { flex: 1 },
  name: { ...typography.body, color: colors.text, fontWeight: '600' },
  meta: { ...typography.caption, color: colors.textMuted, marginTop: 1 },
  right: { alignItems: 'flex-end', gap: 4, minWidth: 100 },
  barArea: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  track: {
    width: 70,
    height: 7,
    backgroundColor: colors.borderLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 4 },
  pct: { ...typography.caption, fontWeight: '700', width: 32, textAlign: 'right' },
  coinsRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  coins: { ...typography.caption, color: '#F59E0B', fontWeight: '600' },
});
