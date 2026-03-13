export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  summary: string;
  tags: string[];
  metrics: ReportMetric[];
}

export type ReportType =
  | 'performance'
  | 'engagement'
  | 'revenue'
  | 'activity'
  | 'compliance';

export type ReportStatus = 'draft' | 'published' | 'archived' | 'pending';

export interface ReportMetric {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}
