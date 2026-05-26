import { initContract } from "@ts-rest/core";
import z, { object } from "zod";

import { errorSchema, successSchema } from "../common.schema";
import {
  createTokenSchema,
  getAllTokensSchema,
  getTokenByIdSchema,
} from "./token.schema";

const c = initContract();

export const tokenContract = c.router({
  createToken: {
    method: "POST",
    path: "/token",
    summary: "Create a new token",
    body: createTokenSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllTokens: {
    method: "GET",
    path: "/token",
    summary: "Get all tokens with pagination",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    }),
    responses: {
      200: z.object({
        data: getAllTokensSchema,
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

  getTokenByID: {
    method: "GET",
    path: "/token/:tokenID",
    pathParams: z.object({
      tokenID: z.string().min(1),
    }),
    responses: {
      200: getTokenByIdSchema,
      404: errorSchema,
    },
  },

  getLatestDailyToken: {
    method: "GET",
    path: "/token/:date",
    pathParams: z.object({
      date: z.string(),
    }),
    responses: {
      200: z.object({
        success: z.boolean(),
        data: z.any().nullable(),
      }),
    },
  },

  updateToken: {
    method: "PUT",
    path: "/token/:tokenID",
    pathParams: z.object({
      tokenID: z.string().min(1),
    }),
    body: z.any(),
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeToken: {
    method: "DELETE",
    path: "/token/:tokenID",
    pathParams: z.object({
      tokenID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
