import { initServer } from "@ts-rest/express";
import { billingContract } from "../../contract/billing/billing.contract";
import { billingMutationHandler } from "./billing.mutation";
import { billingQueryHandler } from "./billing.query";
import { userUploadFields } from "../../middleware/upload-fields";

const s = initServer();

export const billingRouter = s.router(billingContract, {
  getAllBillings : billingQueryHandler.getAllBillings,
  getBillingByID: billingQueryHandler.getBillingByID,

  createBilling: {
    middleware: [userUploadFields],
    handler: billingMutationHandler.createBilling,
  },
  updateBilling: {
    middleware: [userUploadFields],
    handler: billingMutationHandler.updateBilling,
  },
  removeBilling: billingMutationHandler.removeBilling,
});