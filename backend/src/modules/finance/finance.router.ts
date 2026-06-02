import { initServer } from "@ts-rest/express";
import { financeContract } from "../../contract/finance/finance.contract";
import { financeQueryHandler } from "./finance.query";
import { financeMutationHandler } from "./finance.mutation";


const s = initServer();

export const financeRouter = s.router(financeContract, {
  getAllFinance: financeQueryHandler.getAllFinance,
  getFinanceByID: financeQueryHandler.getFinanceByID,

  createFinance: financeMutationHandler.createFinance,
  updateFinance: financeMutationHandler.updateFinance,
  removeFinance: financeMutationHandler.removeFinance,
});