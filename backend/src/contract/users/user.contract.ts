import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import {
  createUserSchema,
  getAllUsersSchema,
  getUserByIDSchema,
  removeUserSchema,
  updateUserSchema,
} from "./user.schema";

const c = initContract();

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/user",
    body: createUserSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllUsers: {
    method: "GET",
    path: "/user",
    summary: "Get all users",
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      role: z.enum(["admin", "business", "staff", "client"]).optional(),
    }),
    responses: {
      200: getAllUsersSchema,
      500: errorSchema,
    },
  },

  getUserByID: {
    method: "GET",
    path: "/user/:userID",
    pathParams: z.object({
      userID: z.string().min(1),
    }),
    responses: {
      200: getUserByIDSchema,
      404: errorSchema,
    },
  },

  updateUser: {
    method: "PUT",
    path: "/user/:userID",
    pathParams: z.object({
      userID: z.string().min(1),
    }),
    body: z.any(),
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeUser: {
    method: "DELETE",
    path: "/user/:userID",
    pathParams: z.object({
      userID: z.string(),
    }),
    body: removeUserSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
