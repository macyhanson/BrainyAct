import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MetricCard as MetricCardType } from '../types';
import { colors, borderRadius, shadows, spacing, typography } from '../utils/theme';

interface Props {
  metric: MetricCardType;
}

export default function MetricCard({ metric }: Props) {
  const isPositive = metric.trend === 'up';
  const isNeutral = metric.trend === 'neutral';

  return (
    <View style={[styles.card, shadows.md]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${metric.color}18` }]}>
          <Ionicons name={metric.icon as any} size={20} color={metric.color} />
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isNeutral
                ? colors.surfaceAlt
                : isPositive
                ? '#D1FAE5'
                : '#FEE2E2',
            },
          ]}
        >
          <Ionicons
            name={isNeutral ? 'remove' : isPositive ? 'arrow-up' : 'arrow-down'}
            size={10}
            color={isNeutral ? colors.textMuted : isPositive ? colors.success : colors.danger}
          />
          <Text
            style={[
              styles.changeText,
              {
                color: isNeutral
                  ? colors.textMuted
                  : isPositive
                  ? colors.success
                  : colors.danger,
              },
            ]}
          >
            {metric.change}
          </Text>
        </View>
      </View>
      <Text style={styles.value}>{metric.value}</Text>
      <Text style={styles.title}>{metric.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flex: 1,
    minWidth: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  changeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  value: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 2,
  },
  title: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
