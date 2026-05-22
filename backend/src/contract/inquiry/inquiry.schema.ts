import { z } from "zod";

export const createDrivingInquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  street: z.string().min(2, "Street is required"),
  occupation: z.string().optional(),
  inquiryType: z.enum([
    "new_admission",
    "license_trial",
    "vehicle_training",
    "renewal",
  ]),
  licenseType: z.enum(["bike", "car", "scooter", "jeep", "bus", "truck"]),
  preferredVehicle: z.string().optional(),
  packageType: z.enum(["basic", "standard", "premium"]).optional(),
  preferredSchedule: z.string().optional(),
  trainingShift: z.enum(["morning", "day", "evening"]).optional(),
  experienceLevel: z
    .enum(["beginner", "intermediate", "experienced"])
    .optional(),
  referredBy: z.string().optional(),
  message: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }),
  document: z.string().optional(),
  documentType: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to terms",
  }),
});

export type TCreateDrivingInquirySchema = z.infer<
  typeof createDrivingInquirySchema
>;

export const getDrivingInquiryByIdSchema = z.object({
  _id: z.string(),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  age: z.number().optional(),
  gender: z.string().optional(),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  street: z.string().min(2, "Street is required"),
  occupation: z.string().optional(),
  inquiryType: z.enum([
    "new_admission",
    "license_trial",
    "vehicle_training",
    "renewal",
  ]),
  licenseType: z.enum(["bike", "car", "scooter", "jeep", "bus", "truck"]),
  preferredVehicle: z.string().optional(),
  packageType: z.enum(["basic", "standard", "premium"]).optional(),
  preferredSchedule: z.string().optional(),
  trainingShift: z.enum(["morning", "day", "evening"]).optional(),
  experienceLevel: z
    .enum(["beginner", "intermediate", "experienced"])
    .optional(),
  referredBy: z.string().optional(),
  message: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relation: z.string().optional(),
  }),
  document: z.string().optional(),
  documentType: z.string().optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to terms",
  }),
  createdAt: z.date().optional(),
});

export const getAllDrivingInquirySchema = z.array(getDrivingInquiryByIdSchema);

export const deleteDrivingInquirySchema = z.object({
  _id: z.string(),
});

