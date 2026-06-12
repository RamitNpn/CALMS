import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://flowdesk-backend-786k.onrender.com",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let errorMessage = "Something went wrong. Please try again.";

    if (error.response?.data && typeof error.response.data === "object") {
      const data = error.response.data as any;
      errorMessage = data.message || data.error || errorMessage;
    } else if (error.message === "Network Error") {
      errorMessage =
        "Network error. Please check your connection and CORS settings.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    const customError = new Error(errorMessage);
    return Promise.reject(customError);
  }
);
