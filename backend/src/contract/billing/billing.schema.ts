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
  items: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return JSON.parse(val);
      }
      return val;
    },
    z.array(itemSchema).min(1, "At least one item is required")
  ),
  totalAmount: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).default(0),
  paymentMethod: billingPaymentMethodEnum.optional(),
  recipt: z.any().optional(),
  status: billingStatusEnum.optional(),
  dueDate: z.coerce.date().optional(),
});

export const billingSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  title: z.string().min(1, "Title is required"),
  items: z.array(itemSchema),
  totalAmount: z.number(),
  paidAmount: z.number().default(0),
  paymentMethod: billingPaymentMethodEnum.optional(),
  recipt: z.any().optional(),
  status: billingStatusEnum,
  dueDate: z.coerce.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllBillingsSchema = z.array(billingSchema);

export const getBillingByIDSchema = billingSchema;

export const updateBillingSchema = z.object({
  _id: z.string().min(1, "Billing ID is required"),
  clientName: z.string().min(2, "Client name is required").max(100).optional(),
  clientEmail: z.string().email().optional(),
  title: z.string().min(1, "Title is required").optional(),
  items: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        return JSON.parse(val);
      }
      return val;
    },
    z.array(itemSchema).optional()
  ),
  totalAmount: z.coerce.number().min(0).optional(),
  paidAmount: z.coerce.number().min(0).optional(),
  paymentMethod: billingPaymentMethodEnum.optional(),
  recipt: z.any().optional(),
  status: billingStatusEnum.optional(),
  dueDate: z.coerce.date().optional(),
});


export const removeBillingSchema = z.object({
  _id: z.string().min(1, "Billing ID is required"),
});