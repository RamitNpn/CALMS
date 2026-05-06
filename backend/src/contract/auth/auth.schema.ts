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
