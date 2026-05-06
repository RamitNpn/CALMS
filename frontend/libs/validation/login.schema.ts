import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginResponseSchema = z.object({
  id: z.string(),
  business_id: z.string(),
  userName: z.string(),
  userEmail: z.string().email(),
  services: z.record(z.string(), z.string()),
  token: z.string(),
  role: z.enum(["admin", "business", "staff", "client"]),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
