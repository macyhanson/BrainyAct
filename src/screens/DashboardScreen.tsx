import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MetricCard from '../components/MetricCard';
import SimpleBarChart from '../components/SimpleBarChart';
import ReportCard from '../components/ReportCard';
import {
  mockMetrics,
  weeklyData,
  mockReports,
  mockNotifications,
  mockUser,
} from '../data/mockData';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;
  const recentReports = mockReports.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{mockUser.name.split(' ')[0]} 👋</Text>
        </View>
        <TouchableOpacity style={[styles.notifBtn, shadows.sm]}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Summary Banner */}
        <View style={[styles.banner, shadows.md]}>
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerLabel}>This Week's Overview</Text>
              <Text style={styles.bannerTitle}>
                {mockReports.filter((r) => r.status === 'published').length} Reports Published
              </Text>
              <Text style={styles.bannerSub}>
                Last updated: {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.bannerIcon}>
              <Ionicons name="analytics" size={36} color="rgba(255,255,255,0.9)" />
            </View>
          </View>
          <View style={styles.bannerStats}>
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatValue}>
                {mockReports.filter((r) => r.status === 'draft').length}
              </Text>
              <Text style={styles.bannerStatLabel}>Drafts</Text>
            </View>
            <View style={styles.bannerStatDivider} />
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatValue}>
                {mockReports.filter((r) => r.status === 'pending').length}
              </Text>
              <Text style={styles.bannerStatLabel}>Pending</Text>
            </View>
            <View style={styles.bannerStatDivider} />
            <View style={styles.bannerStat}>
              <Text style={styles.bannerStatValue}>{unreadCount}</Text>
              <Text style={styles.bannerStatLabel}>Alerts</Text>
            </View>
          </View>
        </View>

        {/* Metrics Grid */}
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.metricsGrid}>
          {mockMetrics.map((metric, index) => (
            <View key={metric.id} style={styles.metricWrapper}>
              <MetricCard metric={metric} />
            </View>
          ))}
        </View>

        {/* Weekly Activity Chart */}
        <View style={[styles.chartCard, shadows.sm]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Activity</Text>
            <TouchableOpacity style={styles.periodBtn}>
              <Text style={styles.periodText}>This Week</Text>
              <Ionicons name="chevron-down" size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <SimpleBarChart
            data={weeklyData}
            color={colors.primary}
            height={130}
            valueSuffix="%"
          />
        </View>

        {/* Recent Reports */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {recentReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}

        {/* Notifications Preview */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        <View style={[styles.notifCard, shadows.sm]}>
          {mockNotifications.slice(0, 3).map((notif, index) => (
            <View
              key={notif.id}
              style={[
                styles.notifItem,
                index < 2 && styles.notifBorder,
                !notif.read && styles.notifUnread,
              ]}
            >
              <View
                style={[
                  styles.notifIcon,
                  {
                    backgroundColor:
                      notif.type === 'success'
                        ? '#D1FAE5'
                        : notif.type === 'warning'
                        ? '#FEF3C7'
                        : notif.type === 'error'
                        ? '#FEE2E2'
                        : '#DBEAFE',
                  },
                ]}
              >
                <Ionicons
                  name={
                    notif.type === 'success'
                      ? 'checkmark-circle'
                      : notif.type === 'warning'
                      ? 'warning'
                      : notif.type === 'error'
                      ? 'alert-circle'
                      : 'information-circle'
                  }
                  size={16}
                  color={
                    notif.type === 'success'
                      ? colors.success
                      : notif.type === 'warning'
                      ? colors.warning
                      : notif.type === 'error'
                      ? colors.danger
                      : colors.info
                  }
                />
              </View>
              <View style={styles.notifText}>
                <View style={styles.notifTitleRow}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  {!notif.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage} numberOfLines={1}>
                  {notif.message}
                </Text>
              </View>
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
          ))}
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
    backgroundColor: colors.background,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
  },
  scroll: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  bannerLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  bannerTitle: {
    ...typography.h3,
    color: colors.textInverse,
    marginBottom: 4,
  },
  bannerSub: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.7)',
  },
  bannerIcon: {
    opacity: 0.9,
  },
  bannerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  bannerStat: {
    flex: 1,
    alignItems: 'center',
  },
  bannerStatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 2,
  },
  bannerStatValue: {
    ...typography.h3,
    color: colors.textInverse,
  },
  bannerStatLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  seeAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricWrapper: {
    width: '48%',
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.h4,
    color: colors.text,
  },
  periodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  periodText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  notifCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  notifBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  notifUnread: {
    backgroundColor: '#F8F9FF',
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  notifMessage: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 1,
  },
  notifTime: {
    ...typography.caption,
    color: colors.textMuted,
  },
  bottomPad: {
    height: spacing.xl,
  },
});
