import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import { createDrivingInquirySchema, getAllDrivingInquirySchema, getDrivingInquiryByIdSchema } from "./inquiry.schema";

const c = initContract();

export const inquiryContract = c.router({
  createInquiry: {
    method: "POST",
    path: "/inquiry",
    body: createDrivingInquirySchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllInquiries: {
    method: "GET",
    path: "/inquiry",
    summary: "Get all inquiries with pagination",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllDrivingInquirySchema,
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

  getInquiryByID: {
    method: "GET",
    path: "/inquiry/:inquiryID",
    pathParams: z.object({
      inquiryID: z.string().min(1),
    }),
    responses: {
      200: getDrivingInquiryByIdSchema,
      404: errorSchema,
    },
  },

  removeInquiry: {
    method: "DELETE",
    path: "/inquiry/:inquiryID",
    pathParams: z.object({
      inquiryID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
