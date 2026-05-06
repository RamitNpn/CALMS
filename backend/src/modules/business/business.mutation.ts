import { AppRouteMutationImplementation } from "@ts-rest/express";
import { businessContract } from "../../contract/business/business.contract";
import businessRepository from "../../repository/business.repository";
import bcrypt from "bcryptjs";

import { Services } from "../../models/business.model"; // adjust path

export const createBusiness: AppRouteMutationImplementation<
  typeof businessContract.createBusiness
> = async ({ req }) => {
  try {
    const {
      businessName,
      operatorName,
      operatorEmail,
      operatorPassword,
      businessType,
      role = "business",
      teams = "",
      branch,
      package: pkg = "starter",
      services,
      payment_initiation,
    } = req.body;

    let normalizedServices: Services[] = ["asset_management"];

    if (services) {
      if (Array.isArray(services)) {
        normalizedServices = services as Services[];
      } else {
        normalizedServices = [services as Services];
      }
    }

    const hashedPassword = await bcrypt.hash(operatorPassword, 10);

    const business = await businessRepository.create({
      businessName,
      operatorName,
      operatorEmail,
      operatorPassword: hashedPassword,
      businessType,
      role,
      teams,
      branch,
      package: pkg,
      services: normalizedServices,
      payment_initiation,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Business created successfully",
        data: business,
      },
    };
  } catch (error: any) {
    if (error.code === 11000) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Email already exists",
        },
      };
    }

    return {
      status: 500,
      body: {
        success: false,
        error: error.message,
      },
    };
  }
};

export const updateBusiness: AppRouteMutationImplementation<
  typeof businessContract.updateBusiness
> = async ({ req }) => {
  try {
    const { businessID } = req.params;

    const { operatorPassword, package: pkg, ...rest } = req.body;

    const updateData: Record<string, any> = {};

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    if (updateData.role !== undefined) {
      updateData.team_role = updateData.role;
      delete updateData.role;
    }

    if (pkg !== undefined) {
      updateData.package = pkg;
    }

    if (operatorPassword) {
      updateData.operatorPassword = await bcrypt.hash(operatorPassword, 10);
    }

    const updatedBusiness = await businessRepository.update(
      businessID,
      updateData,
    );

    return {
      status: 200,
      body: {
        success: true,
        data: updatedBusiness,
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
export const removeBusiness: AppRouteMutationImplementation<
  typeof businessContract.removeBusiness
> = async ({ req }) => {
  try {
    const existing = await businessRepository.getByID(req.params.businessID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Business not found",
        },
      };
    }

    const deleted = await businessRepository.delete(req.params.businessID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Business was not deleted",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Business deleted",
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

export const businessMutationHandler = {
  createBusiness,
  updateBusiness,
  removeBusiness,
};
