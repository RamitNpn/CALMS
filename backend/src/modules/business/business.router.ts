import { initServer } from "@ts-rest/express";
import { businessContract } from "../../contract/business/business.contract";
import { businessQueryHandler } from "./business.query";
import { businessMutationHandler } from "./business.mutation";


const s = initServer();

export const businessRouter = s.router(businessContract, {
  getAllBusinesses: businessQueryHandler.getAllBusinesses,
  getBusinessById : businessQueryHandler.getBusinessById,

  createBusiness: businessMutationHandler.createBusiness,
  updateBusiness: businessMutationHandler.updateBusiness,
  removeBusiness: businessMutationHandler.removeBusiness,
});