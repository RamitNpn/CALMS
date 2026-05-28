import { apiClient } from "@/utils/api";
import {
  TCreateDrivingInquirySchema,
  TDeleteDrivingInquirySchema,
} from "../validation/inquery.validation";

const createInquiry = async (data: TCreateDrivingInquirySchema) => {
  const response = await apiClient.post("/inquiry", data);

  return response.data;
};

const getAllInquiries = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/inquiry", {
    params: { page, limit },
  });

  return response.data;
};

const getInquiryById = async (id: string) => {
  const response = await apiClient.get(`/inquiry/${id}`);

  return response.data;
};

const deleteInquiry = async (inquiryId: TDeleteDrivingInquirySchema['_id']) => {
  const response = await apiClient.delete(`/inquiry/${inquiryId}`);

  return response.data;
};

export const inquiryApi = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry,
};
