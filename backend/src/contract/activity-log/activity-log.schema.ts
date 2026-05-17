import { z } from "zod";

export const getActivityLogsSchema = z.object({
  userId: z.string().optional(),
  module: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
});

export const clearActivityLogsSchema = z.object({
  _id: z.string(),
  userId: z.string().min(1, "User ID is required"),
});
