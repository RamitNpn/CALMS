import { initServer } from "@ts-rest/express";
import { businessContract } from "../../contract/business/business.contract";
import { businessQueryHandler } from "./business.query";
import { businessMutationHandler } from "./business.mutation";
import { userUploadFields } from "../../middleware/upload-fields";


const s = initServer();

export const businessRouter = s.router(businessContract, {
  getAllBusinesses: businessQueryHandler.getAllBusinesses,
  getBusinessById : businessQueryHandler.getBusinessById,

  createBusiness: businessMutationHandler.createBusiness,
  updateBusiness: {
    middleware: [userUploadFields],
    handler: businessMutationHandler.updateBusiness,
  },
  removeBusiness: businessMutationHandler.removeBusiness,
});