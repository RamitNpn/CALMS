import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllBusinessesSchema,
  getBusinessByIdSchema,
  createBusinessSchema,
  updateBusinessSchema,
  removeBusinessSchema,
} from "./business.schema";

const c = initContract();

export const businessContract = c.router({
  createBusiness: {
    method: "POST",
    path: "/business",
    body: createBusinessSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllBusinesses: {
    method: "GET",
    path: "/business",
    summary: "Get all businesses",
    responses: {
      200: getAllBusinessesSchema,
      500: errorSchema,
    },
  },

  getBusinessById: {
    method: "GET",
    path: "/business/:businessID",
    pathParams: z.object({
      businessID: z.string().min(1),
    }),
    responses: {
      200: getBusinessByIdSchema,
      404: errorSchema,
    },
  },

  updateBusiness: {
    method: "PUT",
    path: "/business/:businessID",
    pathParams: z.object({
      businessID: z.string().min(1),
    }),
    body: updateBusinessSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeBusiness: {
    method: "DELETE",
    path: "/business/:businessID",
    pathParams: z.object({
      assetID: z.string(),
    }),
    summary: "Delete business",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});
