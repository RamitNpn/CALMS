export type TInquiryType =
  | "new_admission"
  | "license_trial"
  | "vehicle_training"
  | "renewal";

export type TLicenseType =
  | "bike"
  | "car"
  | "scooter"
  | "jeep"
  | "bus"
  | "truck";

export type TPackageType =
  | "basic"
  | "standard"
  | "premium";

export type TTrainingShift =
  | "morning"
  | "day"
  | "evening";

export type TExperienceLevel =
  | "beginner"
  | "intermediate"
  | "experienced";

export type TDocumentType =
  | "citizenship_copy"
  | "passport_photo"
  | "medical_report"
  | "previous_license_copy";

export type TDrivingInquiry = {
  _id: string;
  fullName: string;
  email?: string;
  phone: string;
  age?: number;
  gender?: string;
  state: string;
district: string;
street: string;
  occupation?: string;
  inquiryType: TInquiryType;
  licenseType: TLicenseType;
  preferredVehicle?: string;
  packageType?: TPackageType;
  preferredSchedule?: string;
  trainingShift?: TTrainingShift;
  experienceLevel?: TExperienceLevel;
  referredBy?: string;
  message?: string;
  emergencyContact: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  documents: TDocumentType[];
  agreeTerms: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TCreateDrivingInquiry = {
  fullName: string;
  email?: string;
  phone: string;
  age?: number;
  gender?: string;
  state: string;
  district: string;
  street: string;
  occupation?: string;
  inquiryType: TInquiryType;
  licenseType: TLicenseType;
  preferredVehicle?: string;
  packageType?: TPackageType;
  preferredSchedule?: string;
  trainingShift?: TTrainingShift;
  experienceLevel?: TExperienceLevel;
  referredBy?: string;
  message?: string;
  emergencyContact: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  documents: TDocumentType[];
  agreeTerms: boolean;
};