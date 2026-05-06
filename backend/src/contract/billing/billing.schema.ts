import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be positive"),
  qty: z.number().min(1, "Quantity must be at least 1"),
});

export const billingStatusEnum = z.enum([
  "pending",
  "partial",
  "completed",
]);

export const createBillingSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  clientId: z.string().min(1, "Client ID is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  totalAmount: z.number().min(0),
  paidAmount: z.number().min(0).optional().default(0),
  status: billingStatusEnum.optional(),
  dueDate: z.coerce.date().optional(),
});

export const billingSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  clientId: z.string(),
  items: z.array(itemSchema),
  totalAmount: z.number(),
  paidAmount: z.number().optional(),
  status: billingStatusEnum,
  dueDate: z.coerce.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllBillingsSchema = z.array(billingSchema);

export const getBillingByIDSchema = billingSchema;

export const updateBillingSchema = z.object({
  _id: z.string().min(1, "Billing ID is required"),
  items: z.array(itemSchema).optional(),
  totalAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  status: billingStatusEnum.optional(),
  dueDate: z.coerce.date().optional(),
});


export const removeBillingSchema = z.object({
  _id: z.string().min(1, "Billing ID is required"),
});