import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, Circle } from 'react-native-svg';

const DOMAIN_LABELS = ['Motor', 'Sensory', 'Behavior', 'Comm.', 'Academic', 'Health'];
const N = 6;

function getAngle(i: number) {
  // Start at top (-90°), go clockwise
  return (-Math.PI / 2) + (i * 2 * Math.PI) / N;
}

function buildPoints(cx: number, cy: number, maxR: number, values: number[]): string {
  return values.map((v, i) => {
    // Invert: higher inverted value = bigger polygon = better
    const r = ((100 - Math.min(v, 100)) / 100) * maxR;
    const a = getAngle(i);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

function buildRing(cx: number, cy: number, maxR: number, pct: number): string {
  return Array.from({ length: N }, (_, i) => {
    const r = (pct / 100) * maxR;
    const a = getAngle(i);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

interface Props {
  baseline1: number[];   // percentage scores B1 (higher = more symptoms)
  baseline3: number[];   // percentage scores B3 (lower = fewer symptoms = improvement)
  size?: number;
}

export default function RadarChart({ baseline1, baseline3, size = 260 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.33;
  const labelR = size * 0.46;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        {/* Grid rings at 25, 50, 75, 100% */}
        {[25, 50, 75, 100].map(pct => (
          <Polygon key={pct} points={buildRing(cx, cy, maxR, pct)}
            fill="none" stroke="#E2E8F0" strokeWidth={1} />
        ))}
        {/* Axis spokes */}
        {Array.from({ length: N }, (_, i) => {
          const a = getAngle(i);
          return (
            <Line key={i} x1={cx} y1={cy}
              x2={cx + maxR * Math.cos(a)} y2={cy + maxR * Math.sin(a)}
              stroke="#E2E8F0" strokeWidth={1} />
          );
        })}
        {/* Baseline 1 — red, higher = more symptoms */}
        <Polygon points={buildPoints(cx, cy, maxR, baseline1)}
          fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.55)" strokeWidth={1.5} />
        {/* Baseline 3 — green, higher inverted = fewer symptoms */}
        <Polygon points={buildPoints(cx, cy, maxR, baseline3)}
          fill="rgba(16,185,129,0.22)" stroke="rgba(16,185,129,0.85)" strokeWidth={2} />
        {/* Center dot */}
        <Circle cx={cx} cy={cy} r={3} fill="#94A3B8" />
        {/* Domain labels */}
        {DOMAIN_LABELS.map((label, i) => {
          const a = getAngle(i);
          const lx = cx + labelR * Math.cos(a);
          const ly = cy + labelR * Math.sin(a);
          return (
            <SvgText key={i} x={lx} y={ly + 3}
              textAnchor="middle" fontSize={9} fontWeight="600" fill="#475569">
              {label}
            </SvgText>
          );
        })}
      </Svg>
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(239,68,68,0.7)' }]} />
          <Text style={styles.legendText}>Baseline 1 (Start)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(16,185,129,0.85)' }]} />
          <Text style={styles.legendText}>Baseline 3 (Current)</Text>
        </View>
      </View>
      <Text style={styles.hint}>Larger green area = greater improvement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  legend: { flexDirection: 'row', gap: 20, marginTop: 6 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  hint: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
});
