import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Domain } from '../types';
import { getDomainColor, getDomainIcon, getZone, getZoneColor, getZoneLabel, calcPointChange } from '../utils/helpers';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

interface Props {
  domain: Domain;
  beforePct: number;
  afterPct: number;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function DomainProgressBar({ domain, beforePct, afterPct, beforeLabel = 'Baseline 1', afterLabel = 'Current' }: Props) {
  const domainColor = getDomainColor(domain);
  const afterZone    = getZone(afterPct);
  const zoneColor    = getZoneColor(afterZone);
  const zoneLabel    = getZoneLabel(afterZone);
  const pointChange  = calcPointChange(beforePct, afterPct); // positive = improvement
  const improved     = pointChange > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: `${domainColor}18` }]}>
          <Ionicons name={getDomainIcon(domain) as any} size={16} color={domainColor} />
        </View>
        <Text style={styles.domainName}>{domain}</Text>
        <View style={[styles.zoneBadge, { backgroundColor: `${zoneColor}18` }]}>
          <View style={[styles.zoneDot, { backgroundColor: zoneColor }]} />
          <Text style={[styles.zoneText, { color: zoneColor }]}>{zoneLabel}</Text>
        </View>
        {pointChange !== 0 && (
          <View style={[styles.changeBadge, { backgroundColor: improved ? '#D1FAE5' : '#FEE2E2' }]}>
            <Ionicons
              name={improved ? 'trending-down' : 'trending-up'}
              size={11}
              color={improved ? '#10B981' : '#EF4444'}
            />
            <Text style={[styles.changeText, { color: improved ? '#10B981' : '#EF4444' }]}>
              {improved ? '-' : '+'}{Math.abs(pointChange).toFixed(1)} pts
            </Text>
          </View>
        )}
      </View>

      {/* Before bar */}
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>{beforeLabel}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${Math.min(beforePct, 100)}%`, backgroundColor: '#EF444480' }]} />
        </View>
        <Text style={[styles.barPct, { color: '#EF4444' }]}>{beforePct.toFixed(1)}%</Text>
      </View>

      {/* After bar */}
      <View style={styles.barRow}>
        <Text style={styles.barLabel}>{afterLabel}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${Math.min(afterPct, 100)}%`, backgroundColor: zoneColor }]} />
        </View>
        <Text style={[styles.barPct, { color: zoneColor }]}>{afterPct.toFixed(1)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.sm,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainName: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  zoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  zoneDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  zoneText: {
    ...typography.caption,
    fontWeight: '700',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 3,
  },
  changeText: {
    ...typography.caption,
    fontWeight: '700',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 68,
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.borderLight,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barPct: {
    ...typography.caption,
    fontWeight: '700',
    width: 38,
    textAlign: 'right',
  },
});
