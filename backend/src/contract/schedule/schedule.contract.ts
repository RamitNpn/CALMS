import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllSchedulesSchema,
  getScheduleByIDSchema,
  createScheduleSchema,
  updateScheduleSchema,
  removeScheduleSchema,
} from "./schedule.schema";

const c = initContract();

export const scheduleContract = c.router({

    createSchedule: {
    method: "POST",
    path: "/schedules",
    body: createScheduleSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllSchedules: {
    method: "GET",
    path: "/schedules",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
    summary: "Get all schedules with pagination",
    responses: {
      200: z.object({
        data: getAllSchedulesSchema,
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

  getScheduleByID: {
    method: "GET",
    path: "/schedules/:scheduleID",
    pathParams: z.object({
      scheduleID: z.string().min(1),
    }),
    responses: {
      200: getScheduleByIDSchema,
      404: errorSchema,
    },
  },

  updateSchedule: {
    method: "PUT",
    path: "/schedules/:scheduleID",
    pathParams: z.object({
      scheduleID: z.string().min(1),
    }),
    body: updateScheduleSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeSchedule: {
    method: "DELETE",
    path: "/schedules/:scheduleID",
    body: removeScheduleSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});