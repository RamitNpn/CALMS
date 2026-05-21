export type ApiError = {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
};