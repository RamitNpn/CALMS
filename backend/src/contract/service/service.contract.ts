import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllServicesSchema,
  getServiceByBusinessIDSchema,
  getServiceByIDSchema,
  initializeServiceSchema,
  updateServiceSchema,
} from "./service.schema";
import { getServiceByBusinessID } from "../../modules/service/service.query";

const c = initContract();

export const serviceContract = c.router({
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
      serviceID: z.string().min(1, "Service ID is required"),
    }),
    summary: "Get service details by ID",
    responses: {
      200: getServiceByIDSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  getServiceByBusinessID: {
    method: "GET",
    path: "/services/business/:businessID",
    pathParams: z.object({
      businessID: z.string().min(1, "Business ID is required"),
    }),
    summary: "Get service details by business ID",
    responses: {
      200: getServiceByBusinessIDSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  updateService: {
    method: "PUT",
    path: "/services/:serviceID",
    pathParams: z.object({
      serviceID: z.string().min(1, "Service ID is required"),
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
      serviceID: z.string().min(1, "Service ID is required"),
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
