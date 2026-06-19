import { initServer } from "@ts-rest/express";
import { serviceContract } from "../../contract/service/service.contract";
import { serviceMutationHandler } from "./service.mutation";
import { getServiceByBusinessID, serviceQueryHandler } from "./service.query";

const s = initServer();

export const serviceRouter = s.router(serviceContract, {
  getAllServices: serviceQueryHandler.getAllServices,
  getServiceByID: serviceQueryHandler.getServiceByID,
  updateService: serviceMutationHandler.updateService,
  removeService: serviceMutationHandler.removeService,
  getServiceByBusinessID: serviceQueryHandler.getServiceByBusinessID,
});
