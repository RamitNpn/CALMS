export interface TBusinessDashboardStats {
  totalStaff: number;
  staffRate: number;
  totalClients: number;
  clientRate: number;
  totalAssets: number;
  assetRate: number;
  totalAttendance: number;
}

export interface TBusinessAttendanceStats {
  totalAttendance: number;
  attendanceRate: number;
  totalAbsent: number;
  absentRate: number;
  totalOnLeave: number;
  onLeaveRate: number;
  lateToday: number;
  lateRate: number;
}

export interface TBusinessAssetStats {
  totalAssets: number;
  assetRate: number;
  totalAssetValue: number;
  assetValueRate: number;
  totalActiveAssets: number;
  totalInactiveAssets: number;
}

export interface TBusinessBillingStats {
  totalRevenue: number;
  revenueRate: number;
  totalOutstanding: number;
  outstandingRate: number;
  totalOverdue: number;
  overdueRate: number;
}

export interface TBusinessUserStats {
  totalClients: number;
  clientRate: number;
  totalActiveClients: number;
  totalInactiveClients: number;
  averageActiveClients: number;
  totalStaff: number;
  staffRate: number;
  totalActiveStaff: number;
  totalInactiveStaff: number;
  averageActiveStaff: number;
}

export interface TChartPoint {
  label: string;
  value: number;
}

export interface TDistributionPoint {
  name: string;
  value: number;
  percentage: number;
}

export interface TBusinessAnalyticsBundle {
  dashboard: TBusinessDashboardStats;
  attendance: TBusinessAttendanceStats;
  assets: TBusinessAssetStats;
  billing: TBusinessBillingStats;
  users: TBusinessUserStats;
}