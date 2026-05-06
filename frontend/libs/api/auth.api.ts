import { apiClient } from "@/utils/api";
import { LoginFormValues } from "../validation/login.schema";

export const loginUser = async (loginPayload: LoginFormValues) => {
  const response = await apiClient.post("/auth/login", loginPayload);
  console.log("response from login api : ", response.data);
  return response.data;
};
