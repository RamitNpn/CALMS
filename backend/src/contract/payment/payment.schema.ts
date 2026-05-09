import { z } from "zod";

export const paymentPackageEnum = z.enum(["starter", "growth", "enterprise"]);

export const paymentStatusEnum = z.enum(["paid", "partial", "pending"]);

export const createPaymentSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid business email"),
  package: paymentPackageEnum,
  startedAt: z.coerce.date(),
  endAt: z.coerce.date(),
  paidAmount: z
    .number({
      required_error: "Paid amount is required",
    })
    .min(0, "Paid amount cannot be negative"),
  dueAmount: z
    .number({
      required_error: "Due amount is required",
    })
    .min(0, "Due amount cannot be negative"),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean().optional(),
});

export const renewPaymentSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid business email"),
  package: paymentPackageEnum,
  startedAt: z.coerce.date(),
  endAt: z.coerce.date(),
  paidAmount: z
    .number({
      required_error: "Paid amount is required",
    })
    .min(0, "Paid amount cannot be negative"),
  dueAmount: z
    .number({
      required_error: "Due amount is required",
    })
    .min(0, "Due amount cannot be negative"),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean().optional(),
});

export const getPaymentByIdSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  businessName: z.string(),
  businessEmail: z.string().email(),
  package: paymentPackageEnum,
  startedAt: z.date(),
  endAt: z.date(),
  paidAmount: z.number(),
  dueAmount: z.number(),
  paymentStatus: paymentStatusEnum,
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllPaymentsSchema = z.array(getPaymentByIdSchema);

export const updatePaymentSchema = z.object({
  _id: z.string().min(1, "Payment ID is required"),
  package: paymentPackageEnum.optional(),
  startedAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
  paidAmount: z.number().min(0).optional(),
  dueAmount: z.number().min(0).optional(),
  paymentStatus: paymentStatusEnum.optional(),
  isActive: z.boolean().optional(),
});

export const removePaymentSchema = z.object({
  _id: z.string().min(1, "Payment ID is required"),
});
