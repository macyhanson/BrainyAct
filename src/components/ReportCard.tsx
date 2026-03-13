import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Report } from '../types';
import {
  getStatusColor,
  getStatusLabel,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  formatDate,
} from '../utils/helpers';
import { colors, borderRadius, shadows, spacing, typography } from '../utils/theme';

interface Props {
  report: Report;
  onPress?: (report: Report) => void;
}

export default function ReportCard({ report, onPress }: Props) {
  const typeColor = getTypeColor(report.type);
  const statusColor = getStatusColor(report.status);

  return (
    <TouchableOpacity
      style={[styles.card, shadows.sm]}
      onPress={() => onPress?.(report)}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={[styles.typeIcon, { backgroundColor: `${typeColor}15` }]}>
          <Ionicons name={getTypeIcon(report.type) as any} size={18} color={typeColor} />
        </View>
        <View style={styles.metaRight}>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusLabel(report.status)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {report.title}
      </Text>
      <Text style={styles.summary} numberOfLines={2}>
        {report.summary}
      </Text>

      <View style={styles.tags}>
        {report.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.authorRow}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarInitial}>
              {report.author.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.authorText}>{report.author}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={styles.dateText}>{formatDate(report.updatedAt)}</Text>
          <View style={[styles.typePill, { backgroundColor: `${typeColor}10` }]}>
            <Text style={[styles.typeText, { color: typeColor }]}>
              {getTypeLabel(report.type)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeIcon: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  title: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 4,
  },
  summary: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: spacing.sm,
  },
  tag: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
    fontSize: 9,
  },
  authorText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  typePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginLeft: 4,
  },
  typeText: {
    ...typography.caption,
    fontWeight: '600',
  },
});
