import { initContract } from "@ts-rest/core";

import { errorSchema } from "../common.schema";
import { 
  loginResponseSchema, 
  loginSchema,
  verifySetupTokenSchema,
  verifySetupTokenResponseSchema,
  setPasswordSchema,
  setPasswordResponseSchema,
} from "./auth.schema";

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
  verifySetupToken: {
    method: "POST",
    path: "/auth/verify-setup-token",
    body: verifySetupTokenSchema,
    summary: "verify setup token and get account information",
    responses: {
      200: verifySetupTokenResponseSchema,
      400: errorSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
  setPassword: {
    method: "POST",
    path: "/auth/set-password",
    body: setPasswordSchema,
    summary: "set password for account using setup token",
    responses: {
      200: setPasswordResponseSchema,
      400: errorSchema,
      401: errorSchema,
      500: errorSchema,
    },
  },
});
