import { apiClient } from "@/utils/api";
import {
  TCreateDrivingInquirySchema,
  TDeleteDrivingInquirySchema,
} from "../validation/inquery.validation";

const createInquiry = async (data: TCreateDrivingInquirySchema) => {
  const response = await apiClient.post("/inquiry", data);

  return response.data;
};

const getAllInquiries = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  dateFilter?: string;
}) => {
  const res = await apiClient.get("/inquiry", {
    params,
  });

  return res.data;
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
