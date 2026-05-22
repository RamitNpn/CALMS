import { AppRouteQueryImplementation } from "@ts-rest/express";
import inquiryRepository from "../../repository/inquiry.repository";
import { inquiryContract } from "../../contract/inquiry/inquiry.contract";

export const getAllDrivingInquiries: AppRouteQueryImplementation<
  typeof inquiryContract.getAllInquiries
> = async ({ req }) => {
  try {
    const page = (req.query.page as unknown as number) || 1;
    const limit = (req.query.limit as unknown as number) || 10;

    const skip = (page - 1) * limit;

    const { data: inquiries, total } = await inquiryRepository.getAll(
      skip,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    const formatted = inquiries.map((i: any) => ({
      _id: i._id.toString(),
      fullName: i.fullName,
      email: i.email,
      phone: i.phone,
      age: i.age,
      gender: i.gender,
      state: i.state,
      district: i.district,
      street: i.street,
      occupation: i.occupation,
      inquiryType: i.inquiryType,
      licenseType: i.licenseType,
      preferredVehicle: i.preferredVehicle,
      packageType: i.packageType,
      preferredSchedule: i.preferredSchedule,
      trainingShift: i.trainingShift,
      experienceLevel: i.experienceLevel,
      referredBy: i.referredBy,
      message: i.message,
      emergencyContact: i.emergencyContact,
      document: i.document,
      documentType: i.documentType,
      agreeTerms: i.agreeTerms,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formatted,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllDrivingInquiries:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch inquiries",
      },
    };
  }
};

export const getDrivingInquiryByID: AppRouteQueryImplementation<
  typeof inquiryContract.getInquiryByID
> = async ({ req }) => {
  try {
    const { inquiryID } = req.params;

    if (!inquiryID) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Inquiry ID is required",
        },
      };
    }

    const inquiry = await inquiryRepository.getByID(inquiryID);

    if (!inquiry) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Inquiry not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: inquiry._id.toString(),
        fullName: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone,
        age: inquiry.age,
        gender: inquiry.gender,
        state: inquiry.state,
        district: inquiry.district,
        street: inquiry.street,
        occupation: inquiry.occupation,
        inquiryType: inquiry.inquiryType,
        licenseType: inquiry.licenseType,
        preferredVehicle: inquiry.preferredVehicle,
        packageType: inquiry.packageType,
        preferredSchedule: inquiry.preferredSchedule,
        trainingShift: inquiry.trainingShift,
        experienceLevel: inquiry.experienceLevel,
        referredBy: inquiry.referredBy,
        message: inquiry.message,
        emergencyContact: inquiry.emergencyContact,
        document: inquiry.document,
        documentType: inquiry.documentType,
        agreeTerms: inquiry.agreeTerms,
        createdAt: inquiry.createdAt,
        updatedAt: inquiry.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in getDrivingInquiryByID:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch inquiry",
      },
    };
  }
};

export const inquiryQueryHandler = {
  getAllDrivingInquiries,
  getDrivingInquiryByID,
};
