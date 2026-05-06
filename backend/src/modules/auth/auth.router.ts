import { initServer } from "@ts-rest/express";
import { authContract } from "../../contract/auth/auth.contract";
import { authMutationHandler } from "./auth.mutation";

const s = initServer();

export const authRouter = s.router(authContract, {

  login: authMutationHandler.authLogin,
});