import { z } from "zod";

export const getActivityLogsSchema = z.object({
  userId: z.string().optional(),
  module: z.string().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).optional().default(10),
});

export const clearActivityLogsSchema = z.object({
  _id: z.string(),
  userId: z.string().min(1, "User ID is required"),
});
