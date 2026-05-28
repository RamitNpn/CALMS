"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/libs/api/stats.api";
import { useActivityLogs } from "@/hooks/shared/useLogs";
import type {
  TBusinessAnalyticsBundle,
  TChartPoint,
  TDistributionPoint,
} from "@/libs/types/stats.types";

const buildPercentage = (value: number, total: number) =>
  total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;

export function useBusinessAnalytics() {
  const analyticsQuery = useQuery<TBusinessAnalyticsBundle>({
    queryKey: ["business-analytics"],
    queryFn: async () => {
      const [dashboard, attendance, assets, billing, users] = await Promise.all([
        statsApi.getBusinessDashboardStatsApi(),
        statsApi.getBusinessAttendanceStatsApi(),
        statsApi.getBusinessAssetStatsApi(),
        statsApi.getBusinessBillingStatsApi(),
        statsApi.getBusinessUserStatsApi(),
      ]);

      return {
        dashboard,
        attendance,
        assets,
        billing,
        users,
      };
    },
    staleTime: 60000,
  });

  const logsQuery = useActivityLogs(1, 5);

  const summary = analyticsQuery.data;

  const growthTrend: TChartPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      { label: "Staff", value: summary.dashboard.staffRate },
      { label: "Clients", value: summary.dashboard.clientRate },
      { label: "Assets", value: summary.dashboard.assetRate },
      { label: "Attendance", value: summary.attendance.attendanceRate },
    ];
  }, [summary]);

  const attendanceBreakdown: TChartPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      { label: "Present", value: summary.attendance.totalAttendance },
      { label: "Absent", value: summary.attendance.totalAbsent },
      { label: "On Leave", value: summary.attendance.totalOnLeave },
      { label: "Late", value: summary.attendance.lateToday },
    ];
  }, [summary]);

  const assetHealth: TDistributionPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const totalAssets = summary.assets.totalActiveAssets + summary.assets.totalInactiveAssets;

    return [
      {
        name: "Active",
        value: summary.assets.totalActiveAssets,
        percentage: buildPercentage(summary.assets.totalActiveAssets, totalAssets),
      },
      {
        name: "Inactive",
        value: summary.assets.totalInactiveAssets,
        percentage: buildPercentage(summary.assets.totalInactiveAssets, totalAssets),
      },
    ];
  }, [summary]);

  const billingMix: TDistributionPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const totalBilling =
      summary.billing.totalRevenue +
      summary.billing.totalOutstanding +
      summary.billing.totalOverdue;

    return [
      {
        name: "Revenue",
        value: summary.billing.totalRevenue,
        percentage: buildPercentage(summary.billing.totalRevenue, totalBilling),
      },
      {
        name: "Outstanding",
        value: summary.billing.totalOutstanding,
        percentage: buildPercentage(summary.billing.totalOutstanding, totalBilling),
      },
      {
        name: "Overdue",
        value: summary.billing.totalOverdue,
        percentage: buildPercentage(summary.billing.totalOverdue, totalBilling),
      },
    ];
  }, [summary]);

  const userMix: TDistributionPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const totalUsers =
      summary.users.totalActiveClients +
      summary.users.totalInactiveClients +
      summary.users.totalActiveStaff +
      summary.users.totalInactiveStaff;

    return [
      {
        name: "Active Clients",
        value: summary.users.totalActiveClients,
        percentage: buildPercentage(summary.users.totalActiveClients, totalUsers),
      },
      {
        name: "Inactive Clients",
        value: summary.users.totalInactiveClients,
        percentage: buildPercentage(summary.users.totalInactiveClients, totalUsers),
      },
      {
        name: "Active Staff",
        value: summary.users.totalActiveStaff,
        percentage: buildPercentage(summary.users.totalActiveStaff, totalUsers),
      },
      {
        name: "Inactive Staff",
        value: summary.users.totalInactiveStaff,
        percentage: buildPercentage(summary.users.totalInactiveStaff, totalUsers),
      },
    ];
  }, [summary]);

  return {
    summary,
    growthTrend,
    attendanceBreakdown,
    assetHealth,
    billingMix,
    userMix,
    recentLogs: logsQuery.data?.data ?? [],
    isLoading: analyticsQuery.isLoading || logsQuery.isLoading,
    isError: analyticsQuery.isError || logsQuery.isError,
  };
}