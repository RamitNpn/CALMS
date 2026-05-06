import { initServer } from "@ts-rest/express";
import { tokenContract } from "../../contract/token/token.contract";

import { tokenMutationHandler } from "./token.mutation";
import { tokenQueryHandler } from "./token.query";

const s = initServer();

export const tokenRouter = s.router(tokenContract, {
  getAllTokens: tokenQueryHandler.getAllTokens,
  getTokenByID: tokenQueryHandler.getTokenByID,

  createToken: tokenMutationHandler.createToken,
  updateToken: tokenMutationHandler.updateToken,
  removeToken: tokenMutationHandler.removeToken,
});