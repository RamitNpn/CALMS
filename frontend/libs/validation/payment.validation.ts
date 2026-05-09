import { z } from "zod";

export const paymentPackageEnum = z.enum(["starter", "growth", "enterprise"]);

export const paymentStatusEnum = z.enum(["paid", "partial", "pending"]);

export const createPaymentSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid business email"),
  package: paymentPackageEnum,
  startedAt: z.string(),
  endAt: z.string(),
  paidAmount: z
    .number("Paid amount is required")
    .min(0, "Paid amount cannot be negative"),
  dueAmount: z
    .number("Due amount is required")
    .min(0, "Due amount cannot be negative"),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean().optional(),
});

export type TCreatePaymentSchema = z.infer<typeof createPaymentSchema>;

export const renewPaymentSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid business email"),
  package: paymentPackageEnum,
  startedAt: z.string(),
  endAt: z.string(),
  paidAmount: z
    .number("Paid amount is required")
    .min(0, "Paid amount cannot be negative"),
  dueAmount: z
    .number("Due amount is required")
    .min(0, "Due amount cannot be negative"),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean().optional(),
});

export type TRenewPaymentSchema = z.infer<typeof renewPaymentSchema>;

export const getPaymentByIdSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  businessName: z.string(),
  businessEmail: z.string().email(),
  package: paymentPackageEnum,
  duration: z.number(),
  startedAt: z.string(),
  endAt: z.string(),
  paidAmount: z.number(),
  dueAmount: z.number(),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetPaymentByIdSchema = z.infer<typeof getPaymentByIdSchema>;

export const getAllPaymentsSchema = z.array(getPaymentByIdSchema);

export type TGetAllPaymentsSchema = z.infer<typeof getAllPaymentsSchema>;

export const updatePaymentSchema = z.object({
  _id: z.string().min(1, "Payment ID is required"),
  package: paymentPackageEnum.optional(),
  startedAt: z.string(),
  endAt: z.string(),
  paidAmount: z.number().min(0).optional(),
  dueAmount: z.number().min(0).optional(),
  paymentStatus: paymentStatusEnum.optional(),
  isActive: z.boolean().optional(),
});

export type TUpdatePaymentSchema = z.infer<typeof updatePaymentSchema>;

export const removePaymentSchema = z.object({
  _id: z.string().min(1, "Payment ID is required"),
});

export type TRemovePaymentSchema = z.infer<typeof removePaymentSchema>;
