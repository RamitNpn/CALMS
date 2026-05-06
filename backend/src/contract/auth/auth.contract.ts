import { initContract } from "@ts-rest/core";

import { errorSchema } from "../common.schema";
import { loginResponseSchema, loginSchema } from "./auth.schema";

const c = initContract();

export const authContract = c.router({
  login: {
    method: "POST",
    path: "/auth/login",
    body: loginSchema,
    summary: "login user",
    responses: {
      200: loginResponseSchema,
      404: errorSchema,
      401: errorSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },
});
