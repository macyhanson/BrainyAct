import {
  Report,
  MetricCard,
  ChartDataPoint,
  NotificationItem,
  UserProfile,
} from '../types';

export const mockUser: UserProfile = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@brainyact.com',
  role: 'Analytics Manager',
  department: 'Business Intelligence',
};

export const mockMetrics: MetricCard[] = [
  {
    id: '1',
    title: 'Total Reports',
    value: '1,284',
    change: '+12.5%',
    trend: 'up',
    icon: 'document-text',
    color: '#6366F1',
  },
  {
    id: '2',
    title: 'Active Users',
    value: '3,472',
    change: '+8.2%',
    trend: 'up',
    icon: 'people',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Revenue',
    value: '$94.2K',
    change: '-2.1%',
    trend: 'down',
    icon: 'trending-up',
    color: '#F59E0B',
  },
  {
    id: '4',
    title: 'Compliance Score',
    value: '96.4%',
    change: '+1.3%',
    trend: 'up',
    icon: 'shield-checkmark',
    color: '#3B82F6',
  },
];

export const weeklyData: ChartDataPoint[] = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 78 },
  { label: 'Wed', value: 90 },
  { label: 'Thu', value: 81 },
  { label: 'Fri', value: 95 },
  { label: 'Sat', value: 47 },
  { label: 'Sun', value: 38 },
];

export const monthlyRevenue: ChartDataPoint[] = [
  { label: 'Jan', value: 72000 },
  { label: 'Feb', value: 81000 },
  { label: 'Mar', value: 78000 },
  { label: 'Apr', value: 89000 },
  { label: 'May', value: 94000 },
  { label: 'Jun', value: 88000 },
  { label: 'Jul', value: 102000 },
  { label: 'Aug', value: 98000 },
  { label: 'Sep', value: 110000 },
  { label: 'Oct', value: 105000 },
  { label: 'Nov', value: 118000 },
  { label: 'Dec', value: 94200 },
];

export const engagementBreakdown: ChartDataPoint[] = [
  { label: 'Mobile', value: 42 },
  { label: 'Desktop', value: 35 },
  { label: 'Tablet', value: 15 },
  { label: 'Other', value: 8 },
];

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q4 2025 Performance Review',
    type: 'performance',
    status: 'published',
    createdAt: '2025-12-31',
    updatedAt: '2026-01-05',
    author: 'Sarah Johnson',
    summary:
      'Comprehensive review of Q4 2025 performance metrics across all departments.',
    tags: ['quarterly', 'performance', 'KPI'],
    metrics: [
      {
        label: 'Overall Score',
        value: 87,
        unit: '%',
        change: 5.2,
        trend: 'up',
      },
      {
        label: 'Team Efficiency',
        value: 91,
        unit: '%',
        change: 3.1,
        trend: 'up',
      },
    ],
  },
  {
    id: '2',
    title: 'User Engagement Report - Feb 2026',
    type: 'engagement',
    status: 'published',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-05',
    author: 'Mike Chen',
    summary: 'Monthly analysis of user engagement patterns and behavior.',
    tags: ['monthly', 'engagement', 'users'],
    metrics: [
      {
        label: 'Active Users',
        value: 3472,
        unit: '',
        change: 8.2,
        trend: 'up',
      },
      {
        label: 'Session Duration',
        value: 4.7,
        unit: 'min',
        change: -0.3,
        trend: 'down',
      },
    ],
  },
  {
    id: '3',
    title: 'Revenue Dashboard - March 2026',
    type: 'revenue',
    status: 'draft',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-12',
    author: 'Lisa Park',
    summary:
      'Real-time revenue tracking and projections for current month.',
    tags: ['revenue', 'finance', 'projections'],
    metrics: [
      {
        label: 'Monthly Revenue',
        value: 94200,
        unit: '$',
        change: -2.1,
        trend: 'down',
      },
      {
        label: 'MRR Growth',
        value: 6.4,
        unit: '%',
        change: 1.1,
        trend: 'up',
      },
    ],
  },
  {
    id: '4',
    title: 'Activity Log - Week 10',
    type: 'activity',
    status: 'published',
    createdAt: '2026-03-07',
    updatedAt: '2026-03-13',
    author: 'James Rodriguez',
    summary: 'Weekly activity summary including all tracked user actions.',
    tags: ['weekly', 'activity', 'audit'],
    metrics: [
      {
        label: 'Total Actions',
        value: 18420,
        unit: '',
        change: 12.5,
        trend: 'up',
      },
      {
        label: 'Error Rate',
        value: 0.3,
        unit: '%',
        change: -0.1,
        trend: 'up',
      },
    ],
  },
  {
    id: '5',
    title: 'Compliance Audit Report',
    type: 'compliance',
    status: 'pending',
    createdAt: '2026-03-11',
    updatedAt: '2026-03-12',
    author: 'Emily Torres',
    summary:
      'Annual compliance audit results and recommendations.',
    tags: ['compliance', 'audit', 'annual'],
    metrics: [
      {
        label: 'Compliance Score',
        value: 96.4,
        unit: '%',
        change: 1.3,
        trend: 'up',
      },
      {
        label: 'Open Issues',
        value: 3,
        unit: '',
        change: -2,
        trend: 'up',
      },
    ],
  },
  {
    id: '6',
    title: 'Marketing Performance Q1 2026',
    type: 'performance',
    status: 'draft',
    createdAt: '2026-03-09',
    updatedAt: '2026-03-13',
    author: 'David Kim',
    summary:
      'Q1 marketing campaign performance and ROI analysis.',
    tags: ['marketing', 'campaigns', 'ROI'],
    metrics: [
      {
        label: 'Campaign ROI',
        value: 234,
        unit: '%',
        change: 18.5,
        trend: 'up',
      },
      { label: 'Leads Generated', value: 842, unit: '', change: 22, trend: 'up' },
    ],
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'New Report Available',
    message: 'Q4 2025 Performance Review has been published.',
    time: '2 min ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Revenue Alert',
    message: 'Monthly revenue is 2.1% below target.',
    time: '1 hr ago',
    read: false,
    type: 'warning',
  },
  {
    id: '3',
    title: 'Report Pending Review',
    message: 'Compliance Audit Report needs your approval.',
    time: '3 hr ago',
    read: true,
    type: 'info',
  },
  {
    id: '4',
    title: 'System Update',
    message: 'BrainyAct platform updated to v3.2.1.',
    time: '1 day ago',
    read: true,
    type: 'info',
  },
];
