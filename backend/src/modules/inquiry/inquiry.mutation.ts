import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";

import activityLogRepository from "../../repository/activity-log.repository";
import { inquiryContract } from "../../contract/inquiry/inquiry.contract";
import inquiryRepository from "../../repository/inquiry.repository";

export const createDrivingInquiry: AppRouteMutationImplementation<
  typeof inquiryContract.createInquiry
> = async ({ req }) => {
  try {
    let {
      fullName,
      email,
      phone,
      age,
      gender,
      state,
      district,
      street,
      occupation,
      inquiryType,
      licenseType,
      preferredVehicle,
      packageType,
      preferredSchedule,
      trainingShift,
      experienceLevel,
      referredBy,
      message,
      emergencyContact,
      document,
      documentType,
      agreeTerms,
    } = req.body;

    // Ensure JSON parsing (if sent via FormData)
    if (typeof emergencyContact === "string") {
      emergencyContact = JSON.parse(emergencyContact);
    }

    // Basic safety check
    if (!agreeTerms) {
      return {
        status: 400,
        body: {
          success: false,
          error: "You must agree to terms",
        },
      };
    }

    const files = req.files as {
      document?: Express.Multer.File[];
    };

    const documentUrl = files?.document?.[0]?.path || "";

    const inquiry = await inquiryRepository.create({
      fullName,
      email,
      phone,
      age,
      gender,
      state,
      district,
      street,
      occupation,
      inquiryType,
      licenseType,
      preferredVehicle,
      packageType,
      preferredSchedule,
      trainingShift,
      experienceLevel,
      referredBy,
      message,
      emergencyContact,
      document: documentUrl,
      documentType,
      agreeTerms,
    });

    // Optional: Activity Log
    await activityLogRepository.create({
      module: "Driving Inquiry",
      action: "CREATE",
      userId: new mongoose.Types.ObjectId(inquiry._id),
      title: fullName,
      role: "public",
      description: `New driving inquiry submitted by ${fullName}`,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Inquiry created successfully",
        data: inquiry,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: `Error creating inquiry: ${(error as Error).message}`,
      },
    };
  }
};

export const removeDrivingInquiry: AppRouteMutationImplementation<
  typeof inquiryContract.removeInquiry
> = async ({ req }) => {
  try {
    const { inquiryID } = req.params;

    const existing = await inquiryRepository.getByID(inquiryID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Inquiry not found",
        },
      };
    }

    const deleted = await inquiryRepository.delete(inquiryID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Failed to delete inquiry",
        },
      };
    }

    // Optional log
    await activityLogRepository.create({
      module: "Driving Inquiry",
      action: "DELETE",
      userId: new mongoose.Types.ObjectId(inquiryID),
      title: existing.fullName,
      role: "admin",
      description: `Inquiry deleted: ${existing.fullName}`,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Inquiry deleted successfully",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const inquiryMutationHandler = {
  createDrivingInquiry,
  removeDrivingInquiry,
};
