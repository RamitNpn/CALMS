import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import {
  createAssetTypeSchema,
  getAllAssetTypesSchema,
  getAssetTypeByIdSchema,
  updateAssetTypeSchema,
} from "./type.schema";

const c = initContract();

export const assetTypeContract = c.router({
  createAssetType: {
    method: "POST",
    path: "/atype",
    body: createAssetTypeSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllAssetTypes: {
    method: "GET",
    path: "/atype",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      business_id: z.string().optional(),
    }),
    summary: "Get all asset types with pagination",
    responses: {
      200: z.object({
        data: getAllAssetTypesSchema,
      }),
      500: errorSchema,
    },
  },

  getAssetTypeByID: {
    method: "GET",
    path: "/atype/:assetTypeID",
    pathParams: z.object({
      assetTypeID: z.string().min(1),
    }),
    responses: {
      200: getAssetTypeByIdSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  updateAssetType: {
    method: "PUT",
    path: "/atype/:assetTypeID",
    pathParams: z.object({
      assetTypeID: z.string().min(1),
    }),
    body: updateAssetTypeSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeAssetType: {
    method: "DELETE",
    path: "/atype/:assetTypeID",
    pathParams: z.object({
      assetTypeID: z.string().min(1),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
