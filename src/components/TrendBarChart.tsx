import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeeklyTrend } from '../types';
import { colors, typography } from '../utils/theme';

interface Props {
  data: WeeklyTrend[];
  showDomains?: boolean;
}

const MOTOR_COLOR   = '#6366F1';
const SENSORY_COLOR = '#3B82F6';
const ACADEMIC_COLOR = '#8B5CF6';
const AVG_COLOR     = '#10B981';

export default function TrendBarChart({ data, showDomains = false }: Props) {
  const maxVal = 100;
  const barH   = 90;

  return (
    <View>
      {showDomains && (
        <View style={styles.legend}>
          {[['Motor', MOTOR_COLOR], ['Sensory', SENSORY_COLOR], ['Academic', ACADEMIC_COLOR]].map(([label, color]) => (
            <View key={label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: color as string }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={[styles.chartArea, { height: barH + 28 }]}>
        {/* Y-axis reference lines */}
        {[25, 50, 75, 100].map(val => (
          <View key={val} style={[styles.gridLine, { bottom: (val / maxVal) * barH + 24 }]}>
            <Text style={styles.gridLabel}>{val}</Text>
          </View>
        ))}

        {/* Bars */}
        <View style={styles.barsRow}>
          {data.map((d, i) => {
            const barValue = showDomains ? d.Motor : d.avgPercent;
            const h = (barValue / maxVal) * barH;
            return (
              <View key={i} style={styles.barGroup}>
                {showDomains ? (
                  <View style={styles.multiBar}>
                    <View style={[styles.multiBarFill, { height: (d.Motor / maxVal) * barH, backgroundColor: MOTOR_COLOR }]} />
                    <View style={[styles.multiBarFill, { height: (d.Sensory / maxVal) * barH, backgroundColor: SENSORY_COLOR }]} />
                    <View style={[styles.multiBarFill, { height: (d.Academic / maxVal) * barH, backgroundColor: ACADEMIC_COLOR }]} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.singleBar,
                      {
                        height: h,
                        backgroundColor: i === data.length - 1 ? AVG_COLOR : `${AVG_COLOR}80`,
                      },
                    ]}
                  />
                )}
                <Text style={styles.weekLabel}>{d.week.replace('Wk ', 'W')}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { ...typography.caption, color: colors.textSecondary },
  chartArea: {
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 24,
    right: 0,
    height: 1,
    backgroundColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridLabel: {
    ...typography.caption,
    color: colors.textMuted,
    width: 22,
    marginLeft: -24,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    paddingLeft: 24,
    height: '100%',
    paddingBottom: 24,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
  },
  singleBar: {
    width: '85%',
    borderRadius: 3,
    minHeight: 2,
  },
  multiBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
    justifyContent: 'center',
  },
  multiBarFill: {
    flex: 1,
    borderRadius: 2,
    minHeight: 2,
  },
  weekLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
});
