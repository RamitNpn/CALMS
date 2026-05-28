import { apiClient } from "@/utils/api";
import type {
  TBusinessAssetStats,
  TBusinessAttendanceStats,
  TBusinessBillingStats,
  TBusinessDashboardStats,
  TBusinessUserStats,
} from "../types/stats.types";

const getBusinessDashboardStatsApi = async () => {
  const response = await apiClient.get("/stats/dashboard");
  return response.data.data as TBusinessDashboardStats;
};

const getBusinessAttendanceStatsApi = async () => {
  const response = await apiClient.get("/stats/attendance");
  return response.data.data as TBusinessAttendanceStats;
};

const getBusinessAssetStatsApi = async () => {
  const response = await apiClient.get("/stats/assets");
  return response.data.data as TBusinessAssetStats;
};

const getBusinessBillingStatsApi = async () => {
  const response = await apiClient.get("/stats/billing");
  return response.data.data as TBusinessBillingStats;
};

const getBusinessUserStatsApi = async () => {
  const response = await apiClient.get("/stats/users");
  return response.data.data as TBusinessUserStats;
};

export const statsApi = {
  getBusinessDashboardStatsApi,
  getBusinessAttendanceStatsApi,
  getBusinessAssetStatsApi,
  getBusinessBillingStatsApi,
  getBusinessUserStatsApi,
};