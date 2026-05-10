import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginResponseSchema = z.object({
  id: z.string(),
  userName: z.string(),
  userEmail: z.string().email(),
  token: z.string(),
  role: z.enum(["admin", "business", "staff", "client"]),
});

export const verifySetupTokenSchema = z.object({
  token: z.string(),
});

export const verifySetupTokenResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  accountEmail: z.string(),
});

export const setPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8).describe("Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const setPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
