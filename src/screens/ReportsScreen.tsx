import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ReportCard from '../components/ReportCard';
import { mockReports } from '../data/mockData';
import { Report, ReportType, ReportStatus } from '../types';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';
import { getTypeColor, getTypeLabel } from '../utils/helpers';

const REPORT_TYPES: (ReportType | 'all')[] = [
  'all',
  'performance',
  'engagement',
  'revenue',
  'activity',
  'compliance',
];

const STATUS_FILTERS: (ReportStatus | 'all')[] = [
  'all',
  'published',
  'draft',
  'pending',
  'archived',
];

export default function ReportsScreen() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'type'>('recent');
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockReports];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q))
      );
    }

    if (selectedType !== 'all') {
      result = result.filter((r) => r.type === selectedType);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((r) => r.status === selectedStatus);
    }

    switch (sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'type':
        result.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        result.sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }

    return result;
  }, [search, selectedType, selectedStatus, sortBy]);

  const activeFilters =
    (selectedType !== 'all' ? 1 : 0) + (selectedStatus !== 'all' ? 1 : 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Reports</Text>
          <Text style={styles.subtitle}>{filtered.length} reports found</Text>
        </View>
        <TouchableOpacity style={[styles.newBtn, shadows.sm]}>
          <Ionicons name="add" size={20} color={colors.textInverse} />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search + Filter Bar */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, shadows.sm]}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, shadows.sm, activeFilters > 0 && styles.filterBtnActive]}
          onPress={() => setShowFilter(true)}
        >
          <Ionicons
            name="options"
            size={20}
            color={activeFilters > 0 ? colors.textInverse : colors.text}
          />
          {activeFilters > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Type Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}
      >
        {REPORT_TYPES.map((type) => {
          const active = selectedType === type;
          const typeColor = type === 'all' ? colors.primary : getTypeColor(type);
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.pill,
                active && { backgroundColor: typeColor },
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text
                style={[
                  styles.pillText,
                  active ? styles.pillTextActive : { color: typeColor },
                ]}
              >
                {type === 'all' ? 'All Types' : getTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sort Row */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['recent', 'title', 'type'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
            onPress={() => setSortBy(s)}
          >
            <Text
              style={[
                styles.sortBtnText,
                sortBy === s && styles.sortBtnTextActive,
              ]}
            >
              {s === 'recent' ? 'Recent' : s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Report List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReportCard report={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No reports found</Text>
            <Text style={styles.emptyMsg}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={showFilter} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
              >
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterGroupTitle}>Status</Text>
            <View style={styles.filterOptions}>
              {STATUS_FILTERS.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOption,
                    selectedStatus === status && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedStatus === status && styles.filterOptionTextActive,
                    ]}
                  >
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterGroupTitle}>Report Type</Text>
            <View style={styles.filterOptions}>
              {REPORT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    selectedType === type && styles.filterOptionActive,
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedType === type && styles.filterOptionTextActive,
                    ]}
                  >
                    {type === 'all' ? 'All Types' : getTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  newBtnText: {
    ...typography.body,
    color: colors.textInverse,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    height: 44,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  filterBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: colors.textInverse,
    fontSize: 9,
    fontWeight: '700',
  },
  pills: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  pillTextActive: {
    color: colors.textInverse,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  sortLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginRight: 4,
  },
  sortBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  sortBtnActive: {
    backgroundColor: colors.primaryLight,
  },
  sortBtnText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sortBtnTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textSecondary,
  },
  emptyMsg: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  clearText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '600',
  },
  filterGroupTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  filterOption: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  applyBtnText: {
    ...typography.h4,
    color: colors.textInverse,
  },
});
