import { z } from "zod";

export const createAttendanceSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100),
  clientEmail: z.string().email(),
  userType: z.string().min(1, "User type is required"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  method: z.enum(["QR", "Manual"]).optional(),
});

export type TCreateAttendanceSchema = z.infer<typeof createAttendanceSchema>;

export const attendanceSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  userType: z.string().min(1, "User type is required"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  method: z.enum(["QR", "Manual"]).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllAttendanceSchema = z.array(attendanceSchema);

export type TGetAllAttendanceSchema = z.infer<typeof getAllAttendanceSchema>;

export const getAttendanceByIDSchema = attendanceSchema;

export type TGetAttendanceByIdSchema = z.infer<typeof getAttendanceByIDSchema>;

export const updateAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100).optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  method: z.enum(["QR", "Manual"]).optional(),
});

export type TUpdateAttendanceSchema = z.infer<typeof updateAttendanceSchema>;

export const removeAttendanceSchema = z.object({
  _id: z.string().min(1, "Attendance ID is required"),
});

export type TDeleteAttendanceSchema = z.infer<typeof removeAttendanceSchema>;
