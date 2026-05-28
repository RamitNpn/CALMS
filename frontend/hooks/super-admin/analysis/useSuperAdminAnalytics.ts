"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/libs/api/business.api";
import { paymentApi } from "@/libs/api/payment.api";
import { logApi } from "@/libs/api/log.api";
import type { TBusiness } from "@/libs/types/business.types";
import type { TPayment } from "@/libs/types/payment.types";
import type { TLogEntry } from "@/libs/types/log.types";

type TrendPoint = {
  label: string;
  businesses: number;
  payments: number;
};

type DistributionPoint = {
  name: string;
  value: number;
  percentage: number;
};

type AnalyticsPayload = {
  businesses: TBusiness[];
  payments: TPayment[];
  recentLogs: TLogEntry[];
};

const normalizeCollection = <T>(response: { data?: T[] } | T[] | undefined): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  return response?.data ?? [];
};

const buildPercentage = (value: number, total: number) =>
  total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0;

const getMonthKey = (input: string | Date) => {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (key: string) => {
  if (key === "Unknown") {
    return key;
  }

  const [year, month] = key.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

export function useSuperAdminAnalytics() {
  const analyticsQuery = useQuery<AnalyticsPayload>({
    queryKey: ["super-admin-analytics"],
    queryFn: async () => {
      const [businessResponse, paymentResponse, logsResponse] = await Promise.all([
        businessApi.getAllBusinessApi(1, 500),
        paymentApi.getAllPaymentsApi(1, 500),
        logApi.getActivityLogsApi(1, 5),
      ]);

      return {
        businesses: normalizeCollection<TBusiness>(businessResponse),
        payments: normalizeCollection<TPayment>(paymentResponse),
        recentLogs: normalizeCollection<TLogEntry>(logsResponse),
      };
    },
    staleTime: 60000,
  });

  const summary = analyticsQuery.data;

  const monthlyTrend = useMemo<TrendPoint[]>(() => {
    if (!summary) {
      return [];
    }

    const businessByMonth = new Map<string, number>();
    const paymentByMonth = new Map<string, number>();

    summary.businesses.forEach((business) => {
      const key = getMonthKey(business.createdAt);
      businessByMonth.set(key, (businessByMonth.get(key) ?? 0) + 1);
    });

    summary.payments.forEach((payment) => {
      const key = getMonthKey(payment.createdAt);
      paymentByMonth.set(key, (paymentByMonth.get(key) ?? 0) + payment.paidAmount);
    });

    const monthKeys = Array.from(new Set([...businessByMonth.keys(), ...paymentByMonth.keys()]))
      .filter((key) => key !== "Unknown")
      .sort();

    return monthKeys.map((key) => ({
      label: getMonthLabel(key),
      businesses: businessByMonth.get(key) ?? 0,
      payments: paymentByMonth.get(key) ?? 0,
    }));
  }, [summary]);

  const packageDistribution: DistributionPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const counts = summary.businesses.reduce<Record<string, number>>((acc, business) => {
      acc[business.package] = (acc[business.package] ?? 0) + 1;
      return acc;
    }, {});

    const total = summary.businesses.length;

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: buildPercentage(value, total),
    }));
  }, [summary]);

  const paymentStatusDistribution: DistributionPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const counts = summary.payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.paymentStatus] = (acc[payment.paymentStatus] ?? 0) + 1;
      return acc;
    }, {});

    const total = summary.payments.length;

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: buildPercentage(value, total),
    }));
  }, [summary]);

  const businessStatusDistribution: DistributionPoint[] = useMemo(() => {
    if (!summary) {
      return [];
    }

    const activeBusinesses = summary.businesses.filter((business) => business.status).length;
    const inactiveBusinesses = summary.businesses.length - activeBusinesses;

    return [
      {
        name: "Active",
        value: activeBusinesses,
        percentage: buildPercentage(activeBusinesses, summary.businesses.length),
      },
      {
        name: "Inactive",
        value: inactiveBusinesses,
        percentage: buildPercentage(inactiveBusinesses, summary.businesses.length),
      },
    ];
  }, [summary]);

  const summaryCards = summary
    ? {
        totalBusinesses: summary.businesses.length,
        activeBusinesses: summary.businesses.filter((business) => business.status).length,
        totalPayments: summary.payments.length,
        totalRevenue: summary.payments.reduce((sum, payment) => sum + payment.paidAmount, 0),
      }
    : null;

  return {
    summaryCards,
    monthlyTrend,
    packageDistribution,
    paymentStatusDistribution,
    businessStatusDistribution,
    recentLogs: summary?.recentLogs ?? [],
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
  };
}