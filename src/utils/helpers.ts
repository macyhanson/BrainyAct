import { ReportStatus, ReportType } from '../types';

export const getStatusColor = (status: ReportStatus): string => {
  switch (status) {
    case 'published':
      return '#10B981';
    case 'draft':
      return '#F59E0B';
    case 'pending':
      return '#3B82F6';
    case 'archived':
      return '#6B7280';
    default:
      return '#6B7280';
  }
};

export const getStatusLabel = (status: ReportStatus): string => {
  switch (status) {
    case 'published':
      return 'Published';
    case 'draft':
      return 'Draft';
    case 'pending':
      return 'Pending';
    case 'archived':
      return 'Archived';
    default:
      return status;
  }
};

export const getTypeLabel = (type: ReportType): string => {
  switch (type) {
    case 'performance':
      return 'Performance';
    case 'engagement':
      return 'Engagement';
    case 'revenue':
      return 'Revenue';
    case 'activity':
      return 'Activity';
    case 'compliance':
      return 'Compliance';
    default:
      return type;
  }
};

export const getTypeIcon = (type: ReportType): string => {
  switch (type) {
    case 'performance':
      return 'trending-up';
    case 'engagement':
      return 'people';
    case 'revenue':
      return 'cash';
    case 'activity':
      return 'pulse';
    case 'compliance':
      return 'shield-checkmark';
    default:
      return 'document-text';
  }
};

export const getTypeColor = (type: ReportType): string => {
  switch (type) {
    case 'performance':
      return '#6366F1';
    case 'engagement':
      return '#10B981';
    case 'revenue':
      return '#F59E0B';
    case 'activity':
      return '#3B82F6';
    case 'compliance':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};
