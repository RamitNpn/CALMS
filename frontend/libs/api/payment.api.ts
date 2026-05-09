import { apiClient } from "@/utils/api";
import {
  TCreatePaymentSchema,
  TRemovePaymentSchema,
  TUpdatePaymentSchema,
  TGetPaymentByIdSchema,
  TRenewPaymentSchema,
} from "../validation/payment.validation";

const createPayment = async (data: TCreatePaymentSchema) => {
  const res = await apiClient.post("/payment", data);
  return res.data;
};

const renewPayment = async (data: TRenewPaymentSchema) => {
  const res = await apiClient.post("/payment/renew", data);
  return res.data;
};

const getAllPaymentsApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/payment", {
    params: { page, limit },
  });
  return response.data;
};

const getPaymentByIdApi = async (
  paymentId: TGetPaymentByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/payment/${paymentId}`);
  return response.data;
};

const updatePaymentApi = async (
  paymentId: string,
  data: Partial<TUpdatePaymentSchema>,
) => {
  const response = await apiClient.put(`/payment/${paymentId}`, data);
  return response.data;
};

const deletePaymentApi = async (paymentId: TRemovePaymentSchema["_id"]) => {
  const response = await apiClient.delete(`/payment/${paymentId}`);
  return response.data;
};

export const paymentApi = {
  createPayment,
  renewPayment,
  getAllPaymentsApi,
  getPaymentByIdApi,
  updatePaymentApi,
  deletePaymentApi,
};
