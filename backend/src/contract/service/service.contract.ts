import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllServicesSchema,
  getServiceByIDSchema,
  initializeServiceSchema,
  updateServiceSchema,
} from "./service.schema";

const c = initContract();

export const serviceContract = c.router({
  initializeService: {
    method: "POST",
    path: "/services/initialize",
    summary: "Initialize default system services",
    body: z.object({}),
    responses: {
      200: z.object({
        success: z.boolean(),
        message: z.string(),
        data: getAllServicesSchema.optional(),
      }),
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllServices: {
    method: "GET",
    path: "/services",
    summary: "Get all system services",
    body: z.object({}),
    responses: {
      200: getAllServicesSchema,
      500: errorSchema,
      404: errorSchema,
    },
  },

  getServiceByID: {
    method: "GET",
    path: "/services/:serviceID",
    pathParams: z.object({
      serviceID: z.string().min(
        1,
        "Service ID is required"
      ),
    }),
    summary: "Get service details by ID",
    responses: {
      200: getServiceByIDSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updateService: {
    method: "PUT",
    path: "/services/:serviceID",
    pathParams: z.object({
      serviceID: z.string().min(
        1,
        "Service ID is required"
      ),
    }),
    body: updateServiceSchema,
    summary: "Update system service details",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  removeService: {
    method: "DELETE",
    path: "/services/:serviceID",
    pathParams: z.object({
      serviceID: z.string().min(
        1,
        "Service ID is required"
      ),
    }),
    body: z.object({}),
    summary: "Delete system service",
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
});