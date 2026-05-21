import { initContract } from "@ts-rest/core";
import { z } from "zod";

import {
  createPaymentSchema,
  getAllPaymentsSchema,
  getPaymentByIdSchema,
  updatePaymentSchema,
  removePaymentSchema,
  renewPaymentSchema,
} from "./payment.schema";

import {
  errorSchema,
  successSchema,
} from "../common.schema";

const c = initContract();

export const paymentContract = c.router({
  createPayment: {
    method: "POST",
    path: "/payment",
    body: createPaymentSchema,
    summary: "Create payment/subscription",
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

    renewPayment: {
    method: "POST",
    path: "/payment/renew",
    body: renewPaymentSchema,
    summary: "Renew payment/subscription",
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllPayments: {
    method: "GET",
    path: "/payment",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
    summary: "Get all payments with pagination",
    responses: {
      200: z.object({
        data: getAllPaymentsSchema,
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: errorSchema,
    },
  },

  getPaymentById: {
    method: "GET",
    path: "/payment/:paymentID",
    pathParams: z.object({
      paymentID: z.string().min(1),
    }),
    summary: "Get payment by ID",
    responses: {
      200: getPaymentByIdSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updatePayment: {
    method: "PUT",
    path: "/payment/:paymentID",
    pathParams: z.object({
      paymentID: z.string().min(1),
    }),
    body: updatePaymentSchema,
    summary: "Update payment",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removePayment: {
    method: "DELETE",
    path: "/payment/:paymentID",
    pathParams: z.object({
      paymentID: z.string().min(1),
    }),
    body: z.object({}),
    summary: "Delete payment",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});