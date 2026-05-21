import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  price: z.number().min(0, "Price must be positive"),
  qty: z.number().min(1, "Quantity must be at least 1"),
});

export const billingStatusEnum = z.enum([
  "pending",
  "partial",
  "paid",
]);

export const billingPaymentMethodEnum = z.enum(["cash", "online"]);

export const createBillingSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100),
  clientEmail: z.string().email("Invalid email format"),
  title: z.string().min(1, "Title is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  totalAmount: z.number().min(0),
  paidAmount: z.number().optional(),
  paymentMethod: billingPaymentMethodEnum.optional(),
  recipt: z.any().optional(),
  status: billingStatusEnum.optional(),
  dueDate: z.string().optional(),
});

export type TCreateBillingSchema = z.infer<typeof createBillingSchema>;

export const getBillingByIdSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  clientId: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  title: z.string().min(1, "Title is required"),
  items: z.array(itemSchema),
  totalAmount: z.number(),
  paidAmount: z.number(),
  paymentMethod: billingPaymentMethodEnum.optional(),
  recipt: z.any().optional(),
  status: billingStatusEnum,
  dueDate: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetBillingByIDSchema = z.infer<typeof getBillingByIdSchema>;

export const getAllBillingSchema = z.array(getBillingByIdSchema);

export type TGetAllBillingsSchema = z.infer<typeof getAllBillingSchema>;

export const updateBillingSchema = z.object({
  _id: z.string().min(1, "Billing ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100).optional(),
  title: z.string().min(1, "Title is required").optional(),
  items: z.array(itemSchema).optional(),
  totalAmount: z.number().min(0).optional(),
  paidAmount: z.number().min(0).optional(),
  paymentMethod: billingPaymentMethodEnum.optional(),
  recipt: z.any().optional().nullable(),
  status: billingStatusEnum.optional(),
  dueDate: z.string().optional(),
});

export type TUpdateBillingSchema = z.infer<typeof updateBillingSchema>;

export const removeBillingSchema = z.object({
  _id: z.string().min(1, "Billing ID is required"),
});

export type TDeleteBillingSchema = z.infer<typeof removeBillingSchema>;