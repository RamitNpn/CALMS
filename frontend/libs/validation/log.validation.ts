import { z } from "zod";

export const getActivityLogsSchema = z.object({
  _id: z.string(),
  business_id: z.string().min(1, "Business ID is required"),
  module: z.string().min(1, "Module is required"),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
  recordId: z.string().optional(),
});

export const clearActivityLogsSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  module: z.string().min(1, "Module is required"),
});

export type TGetActivityLogsSchema = z.infer<typeof getActivityLogsSchema>;
export type TClearActivityLogsSchema = z.infer<typeof clearActivityLogsSchema>;
