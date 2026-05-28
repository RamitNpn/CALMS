import { initServer } from "@ts-rest/express";
import { tokenContract } from "../../contract/token/token.contract";
import { TokenMutationHandler } from "./token.mutation";
import { tokenQueryHandler } from "./token.query";

const s = initServer();

export const tokenRouter = s.router(tokenContract, {
  createToken: TokenMutationHandler.createToken,
  updateToken: TokenMutationHandler.updateToken,
  removeToken: TokenMutationHandler.removeToken,

  getAllTokens: tokenQueryHandler.getAlltokens,
  getTokenByID: tokenQueryHandler.gettokenByID,
  getLatestDailyToken: tokenQueryHandler.getLatestDailyToken,
});
