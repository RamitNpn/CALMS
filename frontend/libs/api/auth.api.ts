import { apiClient } from "@/utils/api";
import { LoginFormValues } from "../validation/login.validation";

export const loginUser = async (loginPayload: LoginFormValues) => {
  const response = await apiClient.post("/auth/login", loginPayload);
  console.log("response from login api : ", response.data);
  return response.data;
};

export const verifySetupToken = async (token: string) => {
  const response = await apiClient.post("/auth/verify-setup-token", { token });
  return response.data;
};

export const setPassword = async (token: string, password: string, confirmPassword: string) => {
  const response = await apiClient.post("/auth/set-password", {
    token,
    password,
    confirmPassword,
  });
  return response.data;
};
