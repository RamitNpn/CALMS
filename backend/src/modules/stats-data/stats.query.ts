import { AppRouteQueryImplementation } from "@ts-rest/express";
import userRepository from "../../repository/user.repository";
import assetRepository from "../../repository/asset.repository";
import attendanceRepository from "../../repository/attendance.repository";
import { statsContract } from "../../contract/stats/stats.contract";
import billingRepository from "../../repository/billing.repository";
import {
  currentMonthStart,
  previousMonthEnd,
  previousMonthStart,
} from "../date";

const getBusinessDashboardStats: AppRouteQueryImplementation<
  typeof statsContract.getBusinessDashboardStats
> = async () => {
  try {
    const [
      totalStaff,
      totalClients,
      totalAssets,
      totalAttendance,

      currentMonthStaff,
      previousMonthStaff,

      currentMonthClients,
      previousMonthClients,

      currentMonthAssets,
      previousMonthAssets,
    ] = await Promise.all([
      userRepository.count({ role: "staff" }),
      userRepository.count({ role: "client" }),
      assetRepository.getAll(),
      attendanceRepository.getAllAttendance(),

      userRepository.count({
        role: "staff",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      userRepository.count({
        role: "staff",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      userRepository.count({
        role: "client",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      userRepository.count({
        role: "client",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      assetRepository.count({
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      assetRepository.count({
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),
    ]);

    const calculateRate = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const formattedData = {
      totalStaff: totalStaff,
      staffRate: calculateRate(currentMonthStaff, previousMonthStaff),
      totalClients: totalClients,
      clientRate: calculateRate(currentMonthClients, previousMonthClients),
      
      totalAssets: totalAssets.total ?? 0,
      assetRate: calculateRate(currentMonthAssets, previousMonthAssets),
      totalAttendance: totalAttendance.total ?? 0,
    };

    return {
      status: 200,
      body: {
        data: formattedData,
      },
    };
  } catch (error) {
    console.error("Error in getBusinessDashboardStats:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get business dashboard stats",
      },
    };
  }
};

const getBusinessAssetStats: AppRouteQueryImplementation<
  typeof statsContract.getBusinessAssetStats
> = async () => {
  try {
    const [
      totalAssets,
      totalActiveAssets,
      totalInactiveAssets,

      currentMonthAssets,
      previousMonthAssets,

      currentMonthAssetValue,
      previousMonthAssetValue,
    ] = await Promise.all([
      assetRepository.count({}),

      assetRepository.count({
        status: "active",
      }),

      assetRepository.count({
        status: "inactive",
      }),

      assetRepository.count({
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      assetRepository.count({
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      assetRepository.aggregate([
        {
          $match: {
            createdAt: {
              $gte: currentMonthStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$assetValue",
            },
          },
        },
      ]),

      assetRepository.aggregate([
        {
          $match: {
            createdAt: {
              $gte: previousMonthStart,
              $lte: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$assetValue",
            },
          },
        },
      ]),
    ]);

    const calculateRate = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const currentAssetValue = currentMonthAssetValue?.[0]?.total ?? 0;

    const previousAssetValue = previousMonthAssetValue?.[0]?.total ?? 0;

    const totalAssetValueAggregation = await assetRepository.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$assetValue",
          },
        },
      },
    ]);

    const totalAssetValue = totalAssetValueAggregation?.[0]?.total ?? 0;

    const formattedData = {
      totalAssets: totalAssets ?? 0,
      assetRate: calculateRate(currentMonthAssets, previousMonthAssets),
      totalAssetValue,
      assetValueRate: calculateRate(currentAssetValue, previousAssetValue),
      totalActiveAssets: totalActiveAssets ?? 0,
      totalInactiveAssets: totalInactiveAssets ?? 0,
    };

    return {
      status: 200,
      body: {
        data: formattedData,
      },
    };
  } catch (error) {
    console.error("Error in getBusinessAssetStats:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get business asset stats",
      },
    };
  }
};

const getBusinessBillingStats: AppRouteQueryImplementation<
  typeof statsContract.getBusinessBillingStats
> = async () => {
  try {
    const [
      totalRevenueAggregation,
      totalOutstandingAggregation,
      totalOverdueAggregation,

      currentMonthRevenueAggregation,
      previousMonthRevenueAggregation,

      currentMonthOutstandingAggregation,
      previousMonthOutstandingAggregation,

      currentMonthOverdueAggregation,
      previousMonthOverdueAggregation,
    ] = await Promise.all([
      billingRepository.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "overdue",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: {
              $gte: currentMonthStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: {
              $gte: previousMonthStart,
              $lte: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "pending",
            createdAt: {
              $gte: currentMonthStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "pending",
            createdAt: {
              $gte: previousMonthStart,
              $lte: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "overdue",
            createdAt: {
              $gte: currentMonthStart,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      billingRepository.aggregate([
        {
          $match: {
            status: "overdue",
            createdAt: {
              $gte: previousMonthStart,
              $lte: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const calculateRate = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const totalRevenue = totalRevenueAggregation?.[0]?.total ?? 0;

    const totalOutstanding = totalOutstandingAggregation?.[0]?.total ?? 0;

    const totalOverdue = totalOverdueAggregation?.[0]?.total ?? 0;

    const currentRevenue = currentMonthRevenueAggregation?.[0]?.total ?? 0;

    const previousRevenue = previousMonthRevenueAggregation?.[0]?.total ?? 0;

    const currentOutstanding =
      currentMonthOutstandingAggregation?.[0]?.total ?? 0;

    const previousOutstanding =
      previousMonthOutstandingAggregation?.[0]?.total ?? 0;

    const currentOverdue = currentMonthOverdueAggregation?.[0]?.total ?? 0;

    const previousOverdue = previousMonthOverdueAggregation?.[0]?.total ?? 0;

    const formattedData = {
      totalRevenue,
      revenueRate: calculateRate(currentRevenue, previousRevenue),
      totalOutstanding,
      outstandingRate: calculateRate(currentOutstanding, previousOutstanding),
      totalOverdue,
      overdueRate: calculateRate(currentOverdue, previousOverdue),
    };

    return {
      status: 200,
      body: {
        data: formattedData,
      },
    };
  } catch (error) {
    console.error("Error in getBusinessBillingStats:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get business billing stats",
      },
    };
  }
};

const getBusinessAttendanceStats: AppRouteQueryImplementation<
  typeof statsContract.getBusinessAttendanceStats
> = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalAttendance,
      totalAbsent,
      totalOnLeave,
      lateToday,

      currentMonthAttendance,
      previousMonthAttendance,

      currentMonthAbsent,
      previousMonthAbsent,

      currentMonthOnLeave,
      previousMonthOnLeave,

      currentMonthLate,
      previousMonthLate,
    ] = await Promise.all([
      attendanceRepository.count({
        status: "present",
      }),

      attendanceRepository.count({
        status: "absent",
      }),

      attendanceRepository.count({
        status: "leave",
      }),

      attendanceRepository.count({
        isLate: true,
        createdAt: {
          $gte: todayStart,
          $lte: todayEnd,
        },
      }),

      attendanceRepository.count({
        status: "present",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      attendanceRepository.count({
        status: "present",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      attendanceRepository.count({
        status: "absent",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      attendanceRepository.count({
        status: "absent",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      attendanceRepository.count({
        status: "leave",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      attendanceRepository.count({
        status: "leave",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      attendanceRepository.count({
        isLate: true,
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      attendanceRepository.count({
        isLate: true,
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),
    ]);

    const calculateRate = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const formattedData = {
      totalAttendance,
      attendanceRate: calculateRate(
        currentMonthAttendance,
        previousMonthAttendance,
      ),
      totalAbsent,
      absentRate: calculateRate(currentMonthAbsent, previousMonthAbsent),
      totalOnLeave,
      onLeaveRate: calculateRate(currentMonthOnLeave, previousMonthOnLeave),
      lateToday,
      lateRate: calculateRate(currentMonthLate, previousMonthLate),
    };

    return {
      status: 200,
      body: {
        data: formattedData,
      },
    };
  } catch (error) {
    console.error("Error in getBusinessAttendanceStats:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get business attendance stats",
      },
    };
  }
};

const getBusinessUserStats: AppRouteQueryImplementation<
  typeof statsContract.getBusinessUserStats
> = async () => {
  try {
    const [
      totalClients,
      totalActiveClients,
      totalInactiveClients,
      currentMonthClients,
      previousMonthClients,

      totalStaff,
      totalActiveStaff,
      totalInactiveStaff,
      currentMonthStaff,
      previousMonthStaff,
    ] = await Promise.all([
      userRepository.count({
        role: "client",
      }),

      userRepository.count({
        role: "client",
        status: "active",
      }),

      userRepository.count({
        role: "client",
        status: "inactive",
      }),

      userRepository.count({
        role: "client",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      userRepository.count({
        role: "client",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),

      userRepository.count({
        role: "staff",
      }),

      userRepository.count({
        role: "staff",
        status: "active",
      }),

      userRepository.count({
        role: "staff",
        status: "inactive",
      }),

      userRepository.count({
        role: "staff",
        createdAt: {
          $gte: currentMonthStart,
        },
      }),

      userRepository.count({
        role: "staff",
        createdAt: {
          $gte: previousMonthStart,
          $lte: previousMonthEnd,
        },
      }),
    ]);

    const calculateRate = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }

      return Number((((current - previous) / previous) * 100).toFixed(2));
    };

    const averageActiveClients =
      totalClients > 0
        ? Number(((totalActiveClients / totalClients) * 100).toFixed(2))
        : 0;

    const averageActiveStaff =
      totalStaff > 0
        ? Number(((totalActiveStaff / totalStaff) * 100).toFixed(2))
        : 0;

    const formattedData = {
      totalClients,
      clientRate: calculateRate(currentMonthClients, previousMonthClients),
      totalActiveClients,
      totalInactiveClients,
      averageActiveClients,

      totalStaff,
      staffRate: calculateRate(currentMonthStaff, previousMonthStaff),
      totalActiveStaff,
      totalInactiveStaff,
      averageActiveStaff,
    };

    return {
      status: 200,
      body: {
        data: formattedData,
      },
    };
  } catch (error) {
    console.error("Error in getBusinessUserStats:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get business user stats",
      },
    };
  }
};

export const statsQueryHandler = {
  getBusinessDashboardStats,
  getBusinessAssetStats,
  getBusinessBillingStats,
  getBusinessAttendanceStats,
  getBusinessUserStats,
};
