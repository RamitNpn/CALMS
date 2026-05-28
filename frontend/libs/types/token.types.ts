export type TokenStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export type VehicleCategory =
  | "bike"
  | "scooter"
  | "car"
  | "jeep"
  | "bus"
  | "truck"
  | "other";

export interface TToken {
  _id: string;
  businessId?: string;
  tokenNumber: string;
  roundNumber: number;
  perRoundCharge: number;
  totalAmount: number;
  participationDate: Date;

  fullName: string;
  email?: string;
  phone: string;

  vehicleCategory: VehicleCategory;
  trainingPackage?: string;
  preferredShift?: "morning" | "day" | "evening";

  status: TokenStatus;
  remarks?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateToken {
  businessId?: string;
  tokenNumber: string;
  roundNumber: number;
  perRoundCharge: number;
  participationDate: Date;

  fullName: string;
  email?: string;
  phone: string;

  vehicleCategory: VehicleCategory;
  trainingPackage?: string;
  preferredShift?: "morning" | "day" | "evening";

  status: TokenStatus;
  remarks?: string;
}

export interface TPrintableToken {
  token: {
    tokenNumber: string;
    fullName: string;
    phone: string;
    vehicleCategory: string;
    roundNumber: number;
    perRoundCharge: number;
    totalAmount: number;
    participationDate: string;
    status: string;
  };
}
