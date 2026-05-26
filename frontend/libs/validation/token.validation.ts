import { z } from "zod";

export const tokenStatusEnum = z.enum([
  "pending",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "failed",
]);

export const vehicleCategoryEnum = z.enum([
  "bike",
  "scooter",
  "car",
  "jeep",
  "bus",
  "truck",
  "other",
]);

export const preferredShiftEnum = z.enum(["morning", "day", "evening"]);

export const createTokenSchema = z.object({
  businessId: z.string().optional(),
  tokenNumber: z.string().trim().min(1, "Token number is required"),
  roundNumber: z
    .number()
    .min(1, "Round number must be at least 1"),

  perRoundCharge: z
    .number()
    .min(0, "Per round charge cannot be negative"),

  participationDate: z.coerce.date().optional(),

  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address").optional(),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),

  vehicleCategory: vehicleCategoryEnum,
  preferredShift: preferredShiftEnum.optional().nullable(),
  status: tokenStatusEnum.optional(),
  remarks: z
    .string()
    .trim()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

export type TCreateTokenSchema = z.infer<
  typeof createTokenSchema
>;

export const getTokenByIdSchema = z.object({
  _id: z.string().min(1, "Token ID is required"),
  businessId: z.string().optional(),
  tokenNumber: z.string().trim().min(1, "Token number is required"),
  roundNumber: z
    .number()
    .min(1, "Round number must be at least 1"),

  perRoundCharge: z
    .number()
    .min(0, "Per round charge cannot be negative"),

  totalAmount: z
    .number()
    .min(0, "Total amount cannot be negative"),

  participationDate: z.coerce.date().optional(),

  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address").optional(),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),

  vehicleCategory: vehicleCategoryEnum,
  trainingPackage: z.string().trim().optional(),
  preferredShift: preferredShiftEnum.optional(),
  status: tokenStatusEnum.optional(),
  remarks: z
    .string()
    .trim()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

export type TGetTokenByIdSchema = z.infer<
  typeof getTokenByIdSchema
>;

export const getAllTokensSchema = z.array(
  getTokenByIdSchema,
);

export type TGetAllTokensSchema = z.infer<
  typeof getAllTokensSchema
>;

export const updateTokenSchema = z.object({
  _id: z.string().min(1, "Token ID is required"),
  businessId: z.string().optional(),
  tokenNumber: z.string().trim().min(1, "Token number is required"),
  roundNumber: z
    .number()
    .min(1, "Round number must be at least 1"),

  perRoundCharge: z
    .number()
    .min(0, "Per round charge cannot be negative"),

  totalAmount: z
    .number()
    .min(0, "Total amount cannot be negative"),

  participationDate: z.coerce.date().optional(),

  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address").optional(),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),

  vehicleCategory: vehicleCategoryEnum,
  trainingPackage: z.string().trim().optional(),
  preferredShift: preferredShiftEnum.optional(),
  status: tokenStatusEnum.default("pending"),
  remarks: z
    .string()
    .trim()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

export type TUpdateTokenSchema = z.infer<
  typeof updateTokenSchema
>;

export const deleteTokenSchema = z.object({
  _id: z.string().min(1, "Token ID is required"),
});

export type TDeleteTokenSchema = z.infer<
  typeof deleteTokenSchema
>;

