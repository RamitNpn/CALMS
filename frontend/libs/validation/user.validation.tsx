import z from "zod";

export const getAllUsersSchema = z.object({
  _id: z.string().optional(),
  business_id: z.string().min(1, "Business ID is required"),
  userName: z.string().min(1, "User name is required"),
  userEmail: z.string().email("Invalid email address"),
  userPhone: z
    .string()
    .min(10, "Invalid Number Format")
    .max(10, "Invalid Number Format"),
  gender: z.enum(["male", "female", "other"]).optional(),
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: z.string(),
  createdAt: z.string(),
});

export type TGetAllUsersSchema = z.infer<typeof getAllUsersSchema>;