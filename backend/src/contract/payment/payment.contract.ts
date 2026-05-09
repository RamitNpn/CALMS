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
    summary: "Get all payments",
    responses: {
      200: getAllPaymentsSchema,
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
    body: removePaymentSchema,
    summary: "Delete payment",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});