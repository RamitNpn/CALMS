import { z } from "zod";

export const createScheduleSchema = z.object({
  tenantId: z.string().min(1),
  title: z.string().optional(),
  staffId: z.string().optional(),
  clientId: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
});

export const scheduleSchema = z.object({
  _id: z.string(),
  tenantId: z.string().min(1, "Tenant ID is required"),
  title: z.string().optional(),
  staffId: z.string().optional(),
  clientId: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  createdAt: z.date(),
});

export const getAllSchedulesSchema = z.array(scheduleSchema);

export const getScheduleByIDSchema = scheduleSchema;

export const updateScheduleSchema = z.object({
  _id: z.string().min(1, "Schedule ID is required"),
  title: z.string().optional(),
  staffId: z.string().optional(),
  clientId: z.string().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
});

export const removeScheduleSchema = z.object({
  _id: z.string().min(1, "Schedule ID is required"),
});