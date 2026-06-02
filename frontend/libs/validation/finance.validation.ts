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

export const createFinanceSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  title: z.string().min(1, "Title is required"),
  type: transactionTypeEnum,
  category: z.string().min(1, "Category is required"),
  amount: z
    .number()
    .min(0, "Amount must be greater than or equal to 0"),
  relatedTo: z.string().optional(),
  objectType: objectTypeEnum.optional(),
  objectId: z.string().optional(),
  paymentMethod: paymentMethodEnum.optional(),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  status: statusEnum.optional(),
  transactionDate: z.string().optional(),
  createdBy: z.string().optional(),
});

export type TCreateFinanceSchema = z.infer<typeof createFinanceSchema>;

export const getFinanceByIDSchema = z.object({
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
  transactionDate: z.string().optional(),
  createdBy: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetFinanceByIDSchema = z.infer<typeof getFinanceByIDSchema>;

export const getAllFinanceSchema = z.array(
  getFinanceByIDSchema
);

export type TGetAllFinanceSchema = z.infer<typeof getAllFinanceSchema>;

export const updateFinanceSchema = z.object({
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
  transactionDate: z.string().optional(),
  createdBy: z.string().optional(),
});

export type TUpdateFinanceSchema = z.infer<typeof updateFinanceSchema>;

export const deleteFinanceSchema =
  z.object({
    _id: z.string(),
  });

export type TDeleteFinanceSchema = z.infer<typeof deleteFinanceSchema>;