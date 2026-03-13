import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SimpleBarChart from '../components/SimpleBarChart';
import DonutChart from '../components/DonutChart';
import { monthlyRevenue, weeklyData, engagementBreakdown, mockReports } from '../data/mockData';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import { getTypeColor, getTypeLabel } from '../utils/helpers';
import { ReportType } from '../types';

const PERIODS = ['7D', '1M', '3M', '6M', '1Y'];

const typeDistribution = (['performance', 'engagement', 'revenue', 'activity', 'compliance'] as ReportType[]).map(
  (type) => ({
    label: getTypeLabel(type),
    value: mockReports.filter((r) => r.type === type).length,
    color: getTypeColor(type),
  })
);

const kpiData = [
  { label: 'Reports Generated', value: '1,284', change: '+12.5%', up: true, icon: 'document-text' },
  { label: 'Avg. Load Time', value: '1.2s', change: '-0.3s', up: true, icon: 'timer' },
  { label: 'Data Accuracy', value: '99.1%', change: '+0.4%', up: true, icon: 'checkmark-done-circle' },
  { label: 'Export Rate', value: '67%', change: '-3.2%', up: false, icon: 'cloud-download' },
];

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'revenue' | 'engagement'>('overview');

  const chartData = selectedPeriod === '7D' ? weeklyData : monthlyRevenue.slice(-6);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity style={[styles.exportBtn, shadows.sm]}>
          <Ionicons name="share-outline" size={18} color={colors.primary} />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Period Selector */}
        <View style={[styles.periodSelector, shadows.sm]}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, selectedPeriod === p && styles.periodBtnActive]}
              onPress={() => setSelectedPeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === p && styles.periodTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabs}>
          {(['overview', 'revenue', 'engagement'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiGrid}>
          {kpiData.map((kpi, i) => (
            <View key={i} style={[styles.kpiCard, shadows.sm]}>
              <View style={styles.kpiTop}>
                <Ionicons name={kpi.icon as any} size={18} color={colors.primary} />
                <View
                  style={[
                    styles.kpiBadge,
                    { backgroundColor: kpi.up ? '#D1FAE5' : '#FEE2E2' },
                  ]}
                >
                  <Ionicons
                    name={kpi.up ? 'arrow-up' : 'arrow-down'}
                    size={10}
                    color={kpi.up ? colors.success : colors.danger}
                  />
                  <Text
                    style={[
                      styles.kpiChange,
                      { color: kpi.up ? colors.success : colors.danger },
                    ]}
                  >
                    {kpi.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.kpiValue}>{kpi.value}</Text>
              <Text style={styles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>

        {/* Main Chart */}
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {selectedTab === 'revenue'
                ? 'Revenue Trend'
                : selectedTab === 'engagement'
                ? 'User Engagement'
                : 'Activity Overview'}
            </Text>
            <Ionicons name="trending-up" size={18} color={colors.success} />
          </View>
          <SimpleBarChart
            data={chartData}
            color={
              selectedTab === 'revenue'
                ? colors.accent
                : selectedTab === 'engagement'
                ? colors.secondary
                : colors.primary
            }
            height={150}
            valuePrefix={selectedTab === 'revenue' ? '$' : ''}
            valueSuffix={selectedTab === 'overview' ? '%' : ''}
          />
        </View>

        {/* Engagement Breakdown */}
        <View style={[styles.card, shadows.sm]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Platform Breakdown</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <DonutChart data={engagementBreakdown} />
        </View>

        {/* Report Type Distribution */}
        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardTitle}>Report Distribution</Text>
          <View style={styles.distList}>
            {typeDistribution.map((item, i) => {
              const total = typeDistribution.reduce((s, d) => s + d.value, 0);
              const pct = Math.round((item.value / total) * 100);
              return (
                <View key={i} style={styles.distItem}>
                  <View style={styles.distLabelRow}>
                    <View style={[styles.distDot, { backgroundColor: item.color }]} />
                    <Text style={styles.distLabel}>{item.label}</Text>
                    <Text style={styles.distCount}>{item.value} reports</Text>
                  </View>
                  <View style={styles.distBar}>
                    <View
                      style={[
                        styles.distFill,
                        { width: `${pct}%`, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Performance Summary */}
        <View style={[styles.card, shadows.sm]}>
          <Text style={styles.cardTitle}>Performance Summary</Text>
          <View style={styles.summaryGrid}>
            {[
              { label: 'Published', value: mockReports.filter((r) => r.status === 'published').length, color: colors.success },
              { label: 'Drafts', value: mockReports.filter((r) => r.status === 'draft').length, color: colors.accent },
              { label: 'Pending', value: mockReports.filter((r) => r.status === 'pending').length, color: colors.info },
              { label: 'Total', value: mockReports.length, color: colors.primary },
            ].map((item, i) => (
              <View
                key={i}
                style={[styles.summaryItem, { borderLeftColor: item.color }]}
              >
                <Text style={[styles.summaryValue, { color: item.color }]}>
                  {item.value}
                </Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exportText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  periodBtnActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  periodTextActive: {
    color: colors.textInverse,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  kpiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  kpiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    gap: 2,
  },
  kpiChange: {
    ...typography.caption,
    fontWeight: '600',
  },
  kpiValue: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 2,
  },
  kpiLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  distList: {
    gap: spacing.sm,
  },
  distItem: {
    gap: 6,
  },
  distLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  distLabel: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  distCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  distBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  distFill: {
    height: '100%',
    borderRadius: 3,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  summaryItem: {
    flex: 1,
    borderLeftWidth: 3,
    paddingLeft: spacing.sm,
  },
  summaryValue: {
    ...typography.h3,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  bottomPad: {
    height: spacing.xl,
  },
});
