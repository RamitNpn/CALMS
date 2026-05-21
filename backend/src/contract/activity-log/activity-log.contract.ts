import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getActivityLogsSchema,
  clearActivityLogsSchema,
} from "./activity-log.schema";

const c = initContract();

export const activityLogContract = c.router({

  getActivityLogs: {
    method: "GET",
    path: "/logs",
    query: getActivityLogsSchema,
    summary: "Get activity logs",
    responses: {
      200: z.object({
        success: z.boolean(),
        data: z.array(z.record(z.any())),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: errorSchema,
      404: errorSchema,
    },
  },

  removeLogs: {
    method: "DELETE",
    path: "/logs",
    body: clearActivityLogsSchema,
    summary: "Remove activity logs",
    responses: {
      200: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },
});
