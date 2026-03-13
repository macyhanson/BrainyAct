import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { mockUser, mockNotifications, mockReports } from '../data/mockData';
import { colors, spacing, typography, borderRadius, shadows } from '../utils/theme';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
  danger?: boolean;
  iconColor?: string;
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  toggle,
  toggleValue,
  onToggle,
  danger,
  iconColor,
}: SettingRowProps) {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={toggle ? 1 : 0.7}
      disabled={toggle}
    >
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor || colors.primary}18` }]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={danger ? colors.danger : iconColor || colors.primary}
        />
      </View>
      <Text style={[styles.settingLabel, danger && { color: colors.danger }]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {toggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: `${colors.primary}60` }}
            thumbColor={toggleValue ? colors.primary : colors.textMuted}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={16}
            color={danger ? colors.danger : colors.textMuted}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.settingGroup}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={[styles.groupCard, shadows.sm]}>{children}</View>
    </View>
  );
}

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const publishedCount = mockReports.filter((r) => r.status === 'published').length;
  const draftCount = mockReports.filter((r) => r.status === 'draft').length;
  const unreadNotifs = mockNotifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Profile Card */}
        <View style={[styles.profileCard, shadows.md]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {mockUser.name.split(' ').map((n) => n[0]).join('')}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userRole}>{mockUser.role}</Text>
          <Text style={styles.userDept}>{mockUser.department}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{publishedCount}</Text>
              <Text style={styles.statLabel}>Published</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{draftCount}</Text>
              <Text style={styles.statLabel}>Drafts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{unreadNotifs}</Text>
              <Text style={styles.statLabel}>Alerts</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <SettingGroup title="Account">
          <SettingRow
            icon="person-outline"
            label="Edit Profile"
            iconColor="#6366F1"
            onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="mail-outline"
            label="Email"
            value={mockUser.email.split('@')[0] + '...'}
            iconColor="#10B981"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="lock-closed-outline"
            label="Change Password"
            iconColor="#F59E0B"
            onPress={() => Alert.alert('Change Password', 'Password reset email sent.')}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="finger-print"
            label="Biometric Login"
            toggle
            toggleValue={biometrics}
            onToggle={setBiometrics}
            iconColor="#8B5CF6"
          />
        </SettingGroup>

        {/* Preferences */}
        <SettingGroup title="Preferences">
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
            iconColor="#3B82F6"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            toggle
            toggleValue={darkMode}
            onToggle={setDarkMode}
            iconColor="#6366F1"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="sync-outline"
            label="Auto-sync Data"
            toggle
            toggleValue={autoSync}
            onToggle={setAutoSync}
            iconColor="#10B981"
          />
          <View style={styles.divider} />
          <SettingRow
            icon="language-outline"
            label="Language"
            value="English"
            iconColor="#F59E0B"
            onPress={() => {}}
          />
        </SettingGroup>

        {/* Reports Settings */}
        <SettingGroup title="Reports">
          <SettingRow
            icon="download-outline"
            label="Download Format"
            value="PDF"
            iconColor="#6366F1"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="calendar-outline"
            label="Default Period"
            value="Last 30 Days"
            iconColor="#10B981"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="bookmark-outline"
            label="Saved Reports"
            value={`${mockReports.length}`}
            iconColor="#F59E0B"
            onPress={() => {}}
          />
        </SettingGroup>

        {/* Support */}
        <SettingGroup title="Support">
          <SettingRow
            icon="help-circle-outline"
            label="Help Center"
            iconColor="#3B82F6"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="chatbubble-outline"
            label="Contact Support"
            iconColor="#10B981"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="star-outline"
            label="Rate the App"
            iconColor="#F59E0B"
            onPress={() => {}}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="information-circle-outline"
            label="App Version"
            value="v1.0.0"
            iconColor="#6B7280"
            onPress={() => {}}
          />
        </SettingGroup>

        {/* Sign Out */}
        <SettingGroup title="">
          <SettingRow
            icon="log-out-outline"
            label="Sign Out"
            danger
            onPress={() =>
              Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive' },
              ])
            }
          />
        </SettingGroup>

        <View style={styles.footer}>
          <Text style={styles.footerText}>BrainyAct Reporting v1.0.0</Text>
          <Text style={styles.footerSub}>© 2026 BrainyAct Inc.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.md,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textInverse,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 2,
  },
  userRole: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  userDept: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  settingGroup: {
    marginBottom: spacing.md,
  },
  groupTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValue: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 58,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: 4,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  footerSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
