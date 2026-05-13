"use client";

import { useToast } from "@/components/ui/toast";

/**
 * Utility hook to handle API responses and display toast notifications
 * Extracts error messages from various error formats
 */
export function useApiResponse() {
  const toast = useToast.getState();

  const showSuccess = (message: string = "Operation completed successfully") => {
    toast.show({
      message,
      type: "success",
    });
  };

  const showError = (error: any) => {
    let errorMessage = "An error occurred";

    if (typeof error === "string") {
      errorMessage = error;
    } else if (error?.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    toast.show({
      message: errorMessage,
      type: "error",
    });
  };

  return { showSuccess, showError };
}
