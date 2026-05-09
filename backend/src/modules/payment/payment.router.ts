import { initServer } from "@ts-rest/express";
import { paymentContract } from "../../contract/payment/payment.contract";
import { paymentQueryHandler } from "./payment.query";
import { paymentMutationHandler } from "./payment.mutation";
const s = initServer();

export const paymentRouter = s.router(paymentContract, {
  getAllPayments: paymentQueryHandler.getAllPayments,
  getPaymentById: paymentQueryHandler.getPaymentById,
  createPayment: paymentMutationHandler.createPayment,
  updatePayment: paymentMutationHandler.updatePayment,
    renewPayment: paymentMutationHandler.renewPayment,
  removePayment: paymentMutationHandler.removePayment,
});