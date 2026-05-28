import { z } from "zod";

export const getBusinessDashboardStatsSchema = z.object({
    totalStaff: z.number(),
    staffRate: z.number(),
    totalClients: z.number(),
    clientRate: z.number(),
    totalAssets: z.number(),
    assetRate: z.number(),
    totalAttendance: z.number(),
})

export const getBusinessAttendanceStatsSchema = z.object({
    totalAttendance: z.number(),
    attendanceRate: z.number(),
    totalAbsent: z.number(),
    absentRate: z.number(),
    totalOnLeave: z.number(),
    onLeaveRate: z.number(),
    lateToday: z.number(),
    lateRate: z.number(),
})

export const getBusinessAssetStatsSchema = z.object({
    totalAssets: z.number(),
    assetRate: z.number(),
    totalAssetValue: z.number(),
    assetValueRate: z.number(),
    totalActiveAssets: z.number(),
    totalInactiveAssets: z.number(),
})

export const getBusinessBillingStatsSchema = z.object({
    totalRevenue: z.number(),
    revenueRate: z.number(),
    totalOutstanding: z.number(),
    outstandingRate: z.number(),
    totalOverdue: z.number(),
    overdueRate: z.number(),
})

export const getBusinessUserStatsSchema = z.object({
  // Client
  totalClients: z.number(),
  clientRate: z.number(),
  totalActiveClients: z.number(),
  totalInactiveClients: z.number(),
  averageActiveClients: z.number(),

  // Staff
  totalStaff: z.number(),
  staffRate: z.number(),
  totalActiveStaff: z.number(),
  totalInactiveStaff: z.number(),
  averageActiveStaff: z.number(),
});



