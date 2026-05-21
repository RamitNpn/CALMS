import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import {
  getBusinessAssetStatsSchema,
  getBusinessAttendanceStatsSchema,
  getBusinessBillingStatsSchema,
  getBusinessDashboardStatsSchema,
  getBusinessUserStatsSchema,
} from "./stats.schema";

const c = initContract();

export const statsContract = c.router({
  getBusinessDashboardStats: {
    method: "GET",
    path: "/stats/dashboard",
    summary: "Get business dashboard statistics",
    responses: {
      200: z.object({
        data: getBusinessDashboardStatsSchema,
      }),
      500: errorSchema,
    },
  },

  getBusinessAttendanceStats: {
    method: "GET",
    path: "/stats/attendance",
    summary: "Get business attendance statistics",
    responses: {
      200: z.object({
        data: getBusinessAttendanceStatsSchema,
      }),
      500: errorSchema,
    },
  },

  getBusinessAssetStats: {
    method: "GET",
    path: "/stats/assets",
    summary: "Get business asset statistics",
    responses: {
      200: z.object({
        data: getBusinessAssetStatsSchema,
      }),
      500: errorSchema,
    },
  },

  getBusinessBillingStats: {
    method: "GET",
    path: "/stats/billing",
    summary: "Get business billing statistics",
    responses: {
      200: z.object({
        data: getBusinessBillingStatsSchema,
      }),
      500: errorSchema,
    },
  },

    getBusinessUserStats: {
    method: "GET",
    path: "/stats/users",
    summary: "Get business staff and client statistics",
    responses: {
      200: z.object({
        data: getBusinessUserStatsSchema,
      }),
      500: errorSchema,
    },
  },
});
