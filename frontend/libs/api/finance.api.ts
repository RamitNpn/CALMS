import { apiClient } from "@/utils/api";
import { TCreateFinanceSchema, TDeleteFinanceSchema, TGetFinanceByIDSchema, TUpdateFinanceSchema } from "../validation/finance.validation";

const createFinance = async (data: TCreateFinanceSchema) => {
  const response = await apiClient.post("/finance", data);
  return response.data;
};

const getAllFinancesApi = async (  page = 1,
  limit = 10) => {
  const response = await apiClient.get("/finance", {
    params: { page, limit }
  });
  return response.data;
};

const getFinanceByIdApi = async (
  financeId: TGetFinanceByIDSchema["_id"],
) => {
  const response = await apiClient.get(`/finance/${financeId}`);
  return response.data;
};

const updateFinanceApi = async (
  financeId: string,
  data: Omit<Partial<TUpdateFinanceSchema>, "_id">,
) => {
  const response = await apiClient.put(`/finance/${financeId}`, data);
  return response.data;
};

const deleteFinanceApi = async (financeId: TDeleteFinanceSchema["_id"]) => {
  const response = await apiClient.delete(`/finance/${financeId}`);
  return response.data;
};

export const financeApi = {
  createFinance,
  getAllFinancesApi,
  getFinanceByIdApi,
  updateFinanceApi,
  deleteFinanceApi,
};
