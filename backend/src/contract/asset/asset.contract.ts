import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllAssetsSchema,
  getAssetByIDSchema,
  createAssetSchema,
  updateAssetBodySchema,
} from "./asset.schema";

const c = initContract();

export const assetContract = c.router({
  createAsset: {
    method: "POST",
    path: "/assets",
    body: createAssetSchema,
    summary: "Create new asset",
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllAssets: {
    method: "GET",
    path: "/assets",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
      business_id: z.string().optional(),
    }),
    summary: "Get all assets with pagination",
    responses: {
      200: z.object({
        data: getAllAssetsSchema,
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

  getAssetByID: {
    method: "GET",
    path: "/assets/:assetID",
    pathParams: z.object({
      assetID: z.string().min(1, "Asset ID is required"),
    }),
    summary: "Get asset details by ID",
    responses: {
      200: getAssetByIDSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updateAsset: {
    method: "PUT",
    path: "/assets/:assetID",
    pathParams: z.object({
      assetID: z.string().min(1, "Asset ID is required"),
    }),
    body: updateAssetBodySchema,
    summary: "Update asset details",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeAsset: {
    method: "DELETE",
    path: "/assets/:assetID",
    pathParams: z.object({
      assetID: z.string(),
    }),
    body: z.object({}),
    summary: "Delete asset",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});
