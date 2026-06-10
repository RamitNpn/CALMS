import { z } from "zod";

export const createAttendanceSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1, "At least one user ID is required"),
  business_id: z.string().min(1, "Business ID is required"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(["Present", "Absent", "Leave", "Late"]),
  date: z.string().optional(),
  method: z.enum(["QR", "Manual"]).optional(),
});

export type TCreateAttendanceSchema = z.infer<typeof createAttendanceSchema>;

export const attendanceSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  userId: z.string().min(1, "User ID is required"),
  userName: z.string(),
  userEmail: z.string(),
  userPhone: z.string().optional(),
  userType: z.string().optional(),
  checkIn: z.coerce.date().optional(),
  checkOut: z.coerce.date().optional(),
  method: z.enum(["QR", "Manual"]).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.string(),
});

export const getAllAttendanceSchema = z.array(attendanceSchema);

export type TGetAllAttendanceSchema = z.infer<typeof getAllAttendanceSchema>;

export const getAttendanceByIDSchema = attendanceSchema;

export type TGetAttendanceByIdSchema = z.infer<typeof getAttendanceByIDSchema>;

export const updateAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
  userId: z.string().min(1, "User ID is required").optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(["Present", "Absent", "Leave", "Late"]).optional(),
  method: z.enum(["QR", "Manual"]).optional(),
});

export type TUpdateAttendanceSchema = z.infer<typeof updateAttendanceSchema>;

export const removeAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
});

export type TDeleteAttendanceSchema = z.infer<typeof removeAttendanceSchema>;
