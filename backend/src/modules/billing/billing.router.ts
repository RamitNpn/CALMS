import { initServer } from "@ts-rest/express";
import { billingContract } from "../../contract/billing/billing.contract";
import { billingMutationHandler } from "./billing.mutation";
import { billingQueryHandler } from "./billing.query";

const s = initServer();

export const billingRouter = s.router(billingContract, {
  getAllBillings : billingQueryHandler.getAllBillings,
  getBillingByID: billingQueryHandler.getBillingByID,

  createBilling: billingMutationHandler.createBilling,
  updateBilling: billingMutationHandler.updateBilling,
  removeBilling: billingMutationHandler.removeBilling,
});