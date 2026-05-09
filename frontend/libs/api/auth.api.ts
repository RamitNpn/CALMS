import { apiClient } from "@/utils/api";
import { LoginFormValues } from "../validation/login.validation";

export const loginUser = async (loginPayload: LoginFormValues) => {
  const response = await apiClient.post("/auth/login", loginPayload);
  console.log("response from login api : ", response.data);
  return response.data;
};
