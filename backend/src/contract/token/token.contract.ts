import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllTokensSchema,
  getTokenByIDSchema,
  createTokenSchema,
  updateTokenSchema,
  removeTokenSchema,
} from "./token.schema";

const c = initContract();

export const tokenContract = c.router({

    createToken: {
    method: "POST",
    path: "/tokens",
    body: createTokenSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllTokens: {
    method: "GET",
    path: "/tokens",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
    summary: "Get all tokens with pagination",
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
    path: "/tokens/:tokenID",
    pathParams: z.object({
      tokenID: z.string().min(1),
    }),
    responses: {
      200: getTokenByIDSchema,
      404: errorSchema,
    },
  },

  updateToken: {
    method: "PUT",
    path: "/tokens/:tokenID",
    pathParams: z.object({
      tokenID: z.string().min(1),
    }),
    body: updateTokenSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeToken: {
    method: "DELETE",
    path: "/tokens/:tokenID",
    body: removeTokenSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});