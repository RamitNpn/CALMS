import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import {
  createBillingSchema,
  getAllBillingsSchema,
  getBillingByIDSchema,
  removeBillingSchema,
  updateBillingSchema,
} from "./billing.schema";

const c = initContract();

export const billingContract = c.router({
  createBilling: {
    method: "POST",
    path: "/billings",
    body: createBillingSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllBillings: {
    method: "GET",
    path: "/billings",
    summary: "Get all billings",
    responses: {
      200: getAllBillingsSchema,
      500: errorSchema,
    },
  },

  getBillingByID: {
    method: "GET",
    path: "/billings/:billingID",
    pathParams: z.object({
      billingID: z.string().min(1, "Billing ID is required"),
    }),
    responses: {
      200: getBillingByIDSchema,
      404: errorSchema,
    },
  },

  updateBilling: {
    method: "PUT",
    path: "/billings/:billingID",
    pathParams: z.object({
      billingID: z.string().min(1, "Billing ID is required"),
    }),
    body: updateBillingSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeBilling: {
    method: "DELETE",
    path: "/billings/:billingID",
    pathParams: z.object({
      billingID: z.string().min(1, "Billing ID is required"),
    }),
    body: removeBillingSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});
