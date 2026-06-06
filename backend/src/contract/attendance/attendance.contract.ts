import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";

import {
  createAttendanceSchema,
  updateAttendanceSchema,
  getAllAttendanceSchema,
  getAttendanceByIDSchema,
  todayAttendanceViewSchema,
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

  getTodayAttendance: {
    method: "GET",
    path: "/today",
    query: z.object({
      business_id: z.string().min(1, "Business ID is required"),
      page: z.string().optional(),
      limit: z.string().optional(),
      search: z.string().optional(),
      role: z.string().optional(),
    }),
    summary: "Get all  current day attendance records with pagination",
    responses: {
      200: z.object({
        success: z.boolean(),
        data: z.array(todayAttendanceViewSchema),

        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
    },
  },

  getAllAttendance: {
    method: "GET",
    path: "/attendance",
    query: z.object({
      business_id: z.string().optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      dateFilter: z.string().optional(),
    }),
    summary: "Get all attendance records with pagination",
    responses: {
      200: z.object({
        data: getAllAttendanceSchema,
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

  getAttendanceByUserId: {
  method: "GET",
  path: "/attendance/user/:userId",
  pathParams: z.object({
    userId: z.string().min(1),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
  responses: {
    200: z.object({
      data: z.array(
        z.object({
          _id: z.string(),
          userId: z.string(),
          userName: z.string(),
          userEmail: z.string(),
          role: z.string(),
          status: z.string(),
          checkIn: z.date().nullable(),
          checkOut: z.date().nullable(),
          createdAt: z.date(),
        }),
      ),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    }),
    404: errorSchema,
    500: errorSchema,
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
    pathParams: z.object({
      attendanceID: z.string(),
    }),
    body: z.object({}),
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
