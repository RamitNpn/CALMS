import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import { createFinancialRecordSchema, getAllFinancialRecordsSchema, getFinancialRecordByIDSchema, updateFinancialRecordSchema } from "./finance.schema";

const c = initContract();

export const financeContract = c.router({
  createFinance: {
    method: "POST",
    path: "/finance",
    body: createFinancialRecordSchema,
    summary: "Create new finance record",
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllFinance: {
    method: "GET",
    path: "/finance",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      business_id: z.string().optional(),
    }),
    summary: "Get all financial records with pagination",
    responses: {
      200: z.object({
        data: getAllFinancialRecordsSchema,
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      500: errorSchema,
      404: errorSchema,
    },
  },

  getFinanceByID: {
    method: "GET",
    path: "/finance/:financeID",
    pathParams: z.object({
      financeID: z.string().min(1, "Financial ID is required"),
    }),
    summary: "Get financial record details by ID",
    responses: {
      200: getFinancialRecordByIDSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updateFinance: {
    method: "PUT",
    path: "/finance/:financeID",
    pathParams: z.object({
      financeID: z.string().min(1, "Financial ID is required"),
    }),
    body: updateFinancialRecordSchema,
    summary: "Update financial record details",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeFinance: {
    method: "DELETE",
    path: "/finance/:financeID",
    pathParams: z.object({
      financeID: z.string(),
    }),
    body: z.object({}),
    summary: "Delete financial record",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});
