import { initServer } from "@ts-rest/express";
import { statsQueryHandler } from "./stats.query";
import { statsContract } from "../../contract/stats/stats.contract";

const s = initServer();

export const statsRouter = s.router(statsContract, {
    getBusinessDashboardStats: statsQueryHandler.getBusinessDashboardStats,
    getBusinessAttendanceStats: statsQueryHandler.getBusinessAttendanceStats,
    getBusinessAssetStats: statsQueryHandler.getBusinessAssetStats,
    getBusinessBillingStats: statsQueryHandler.getBusinessBillingStats,
    getBusinessUserStats: statsQueryHandler.getBusinessUserStats,
});