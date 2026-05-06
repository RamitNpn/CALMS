import { z } from "zod";

export const userTypeEnum = z.enum(["STAFF", "CLIENT"]);
export const methodEnum = z.enum(["QR", "Manual"]);

export const createAttendanceSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  userType: userTypeEnum,
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: methodEnum.optional().default("Manual"),
});

export const attendanceSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  clientId: z.string(),
  userType: userTypeEnum,
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: methodEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllAttendanceSchema = z.array(attendanceSchema);

export const getAttendanceByIDSchema = attendanceSchema;

export const updateAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: methodEnum.optional(),
});

export const removeAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
});