import { z } from "zod";

export const paymentMethodEnum = z.enum([
  "cash",
  "bank_transfer",
  "esewa",
  "khalti",
  "card",
]);

export const transactionTypeEnum = z.enum([
  "income",
  "expense",
]);

export const objectTypeEnum = z.enum([
  "vehicle",
  "student",
  "staff",
  "office",
  "other",
]);

export const statusEnum = z.enum([
  "pending",
  "completed",
  "cancelled",
]);

export const createFinancialRecordSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  title: z.string().min(1, "Title is required"),
  type: transactionTypeEnum,
  category: z.string().min(1, "Category is required"),  
  amount: z.coerce.number().min(0),
  relatedTo: z.string().optional(),
  objectType: objectTypeEnum.optional(),
  objectId: z.string().optional(),
  paymentMethod: paymentMethodEnum.optional(),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  status: statusEnum.optional(),
  transactionDate: z.coerce.date(),
  createdBy: z.string().optional(),
});

export const getFinancialRecordByIDSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  title: z.string(),
  type: transactionTypeEnum,
  category: z.string(),
  amount: z.number(),
  relatedTo: z.string().optional(),
  objectType: objectTypeEnum.optional(),
  objectId: z.string().optional(),
  paymentMethod: paymentMethodEnum.optional(),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  status: statusEnum.optional(),
  transactionDate: z.date(),
  createdBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllFinancialRecordsSchema = z.array(
  getFinancialRecordByIDSchema
);

export const updateFinancialRecordSchema = z.object({
  _id: z
    .string()
    .min(1, "Financial Record ID is required"),
  title: z.string().min(1).optional(),
  type: transactionTypeEnum.optional(),
  category: z.string().min(1).optional(),
  amount: z
    .number()
    .min(0)
    .optional(),
  relatedTo: z.string().optional(),
  objectType: objectTypeEnum.optional(),
  objectId: z.string().optional(),
  paymentMethod: paymentMethodEnum.optional(),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  status: statusEnum.optional(),
  transactionDate: z.coerce
    .date()
    .optional(),
  createdBy: z.string().optional(),
});

export const removeFinancialRecordSchema =
  z.object({
    _id: z.string(),
  });