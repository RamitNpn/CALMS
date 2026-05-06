import z from "zod";

export const successSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const errorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
});
