import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChartDataPoint } from '../types';
import { colors, spacing, typography, borderRadius } from '../utils/theme';

const CHART_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EF4444'];

interface Props {
  data: ChartDataPoint[];
  label?: string;
}

export default function DonutChart({ data, label }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.container}>
        <View style={styles.donut}>
          <View style={styles.donutInner}>
            <Text style={styles.totalValue}>{total}%</Text>
            <Text style={styles.totalLabel}>Total</Text>
          </View>
          {data.map((segment, i) => {
            const percentage = Math.round((segment.value / total) * 100);
            return (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    width: `${percentage}%`,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.legend}>
          {data.map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: CHART_COLORS[i % CHART_COLORS.length] },
                ]}
              />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.value}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  donut: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  donutInner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  totalValue: {
    ...typography.h4,
    color: colors.text,
  },
  totalLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  segment: {
    height: '100%',
  },
  legend: {
    flex: 1,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  legendLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  legendValue: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
  },
});
