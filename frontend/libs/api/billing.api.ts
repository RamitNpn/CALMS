import { apiClient } from "@/utils/api";
import {
  TDeleteBillingSchema,
  TGetBillingByIDSchema,
  TUpdateBillingSchema,
} from "../validation/billing.validation";

const createBilling = async (data: FormData) => {
  const res = await apiClient.post("/billing", data);
  return res.data;
};

const getAllBillingsApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/billing", {
    params: { page, limit },
  });
  return response.data;
};

const getBillingByIdApi = async (billingId: TGetBillingByIDSchema["_id"]) => {
  const response = await apiClient.get(`/billing/${billingId}`);
  return response.data;
};

const updateBillingApi = async (
  billingId: string,
  data: Partial<TUpdateBillingSchema> | FormData,
) => {
  const response = await apiClient.put(`/billing/${billingId}`, data);
  return response.data;
};

const deleteBillingApi = async (billingId: TDeleteBillingSchema["_id"]) => {
  const response = await apiClient.delete(`/billing/${billingId}`);
  return response.data;
};

export const billingApi = {
  createBilling,
  getAllBillingsApi,
  getBillingByIdApi,
  updateBillingApi,
  deleteBillingApi,
};
