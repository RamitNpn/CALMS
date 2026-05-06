import { initContract } from "@ts-rest/core";
import z from "zod";

import { errorSchema, successSchema } from "../common.schema";
import { createUserSchema, getAllUsersSchema, getUserByIDSchema, removeUserSchema, updateUserSchema } from "./user.schema";

const c = initContract();

export const userContract = c.router({
  createUser: {
    method: "POST",
    path: "/users",
    body: createUserSchema,
    responses: {
      201: successSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },

  getAllUsers: {
    method: "GET",
    path: "/users",
    summary: "Get all users",
    responses: {
      200: getAllUsersSchema,
      500: errorSchema,
    },
  },

  getUserByID: {
    method: "GET",
    path: "/users/:userID",
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
    path: "/users/:userID",
    pathParams: z.object({
      userID: z.string().min(1),
    }),
    body: updateUserSchema,
    responses: {
      200: successSchema,
      400: errorSchema,
      404: errorSchema,
    },
  },

  removeUser: {
    method: "DELETE",
    path: "/users/:userID",
    pathParams: z.object({
      userID: z.string().min(1),
    }),
    body: removeUserSchema,
    responses: {
      200: successSchema,
      404: errorSchema,
    },
  },
});
