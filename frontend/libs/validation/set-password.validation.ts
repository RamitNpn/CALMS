import { z } from "zod";

export const setPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>;
