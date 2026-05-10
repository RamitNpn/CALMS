import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  getAllAttendanceSchema,
  getAttendanceByIDSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
  removeAttendanceSchema,
} from "./attendance.schema";

const c = initContract();

export const attendanceContract = c.router({

    createAttendance: {
    method: "POST",
    path: "/attendance",
    body: createAttendanceSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },
  
  getAllAttendance: {
    method: "GET",
    path: "/attendance",
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
    summary: "Get all attendance records with pagination",
    responses: {
      200: z.object({
        data: getAllAttendanceSchema,
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

  getAttendanceByID: {
    method: "GET",
    path: "/attendance/:attendanceID",
    pathParams: z.object({
      attendanceID: z.string().min(1),
    }),
    responses: {
      200: getAttendanceByIDSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  updateAttendance: {
    method: "PUT",
    path: "/attendance/:attendanceID",
    pathParams: z.object({
      attendanceID: z.string().min(1),
    }),
    body: updateAttendanceSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeAttendance: {
    method: "DELETE",
    path: "/attendance/:attendanceID",
    body: removeAttendanceSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});