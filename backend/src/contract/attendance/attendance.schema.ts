import { z } from "zod";

export const methodEnum = z.enum(["QR", "Manual"]);

export const createAttendanceSchema = z.object({
  userIds: z
    .array(z.string().min(1))
    .min(1, "At least one user ID is required"),
  business_id: z.string().min(1, "Business ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100).optional(),
  clientEmail: z.string().email().optional(),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  status: z
    .enum(["Present", "Absent", "Leave", "Late"])
    .optional()
    .default("Absent"),
  date: z.coerce.date().default(() => new Date()),
  method: methodEnum.optional().default("Manual"),
});

export const mixAttendanceSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  userId: z.string().min(1, "User ID is required"),
  userType: z.string().min(1, "User type is required"),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: methodEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z
    .enum(["Present", "Absent", "Leave", "Late"])
    .optional()
    .default("Absent"),
});

export const todayAttendanceViewSchema = mixAttendanceSchema
  .omit({
    userId: true,
    business_id: true,
    method: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    userName: z.string(),
    userEmail: z.string(),
    role: z.enum(["client", "staff"]),
    attendanceId: z.string().optional(),
  });

  export const attendanceSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  userId: z.string().min(1, "User ID is required"),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: methodEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z
    .enum(["Present", "Absent", "Leave", "Late"])
    .optional()
    .default("Absent"),
});

export const getAllAttendanceSchema = z.array(attendanceSchema);

export const getAttendanceByIDSchema = attendanceSchema;

export const updateAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100).optional(),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: methodEnum.optional(),
  status: z.enum(["Present", "Absent", "Leave", "Late"]).optional(),
});

export const removeAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
});
