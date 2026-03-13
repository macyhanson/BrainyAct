import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChartDataPoint } from '../types';
import { colors, spacing, typography } from '../utils/theme';

interface Props {
  data: ChartDataPoint[];
  color?: string;
  height?: number;
  label?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export default function SimpleBarChart({
  data,
  color = colors.primary,
  height = 120,
  label,
  valuePrefix = '',
  valueSuffix = '',
}: Props) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.chart, { height }]}>
        {data.map((point, index) => {
          const barHeight = (point.value / maxValue) * height * 0.85;
          return (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.valueLabel}>
                {valuePrefix}
                {point.value >= 1000
                  ? `${(point.value / 1000).toFixed(0)}k`
                  : point.value}
                {valueSuffix}
              </Text>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: color,
                      opacity: 0.8 + (index / data.length) * 0.2,
                    },
                  ]}
                />
              </View>
              <Text style={styles.xLabel}>{point.label}</Text>
            </View>
          );
        })}
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
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 4,
  },
  xLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  valueLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
    fontSize: 9,
  },
});
