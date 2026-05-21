import { AppRouteMutationImplementation } from "@ts-rest/express";
import { businessContract } from "../../contract/business/business.contract";
import businessRepository from "../../repository/business.repository";
import bcrypt from "bcryptjs";

import { welcomeTemplate } from "../../template/welcome.template";
import { sendMail } from "../../utils/sendMail";
import env from "../../config/env";
import { authRepository } from "../../repository/auth.repository";
import serviceRepository from "../../repository/service.repository";
import businessServiceConfigRepository from "../../repository/business-service-config.repository";
import activityLogRepository from "../../repository/activity-log.repository";
import mongoose from "mongoose";

const MOCK_SERVICES = [
  {
    service_key: "asset_management",
    default_name: "Asset Management",
  },
  {
    service_key: "attendance_management",
    default_name: "Attendance Management",
  },
  {
    service_key: "billing_management",
    default_name: "Billing and Payments",
  },
  {
    service_key: "business_management",
    default_name: "Business Management",
  },
  {
    service_key: "client_management",
    default_name: "Client Management",
  },
  {
    service_key: "staff_management",
    default_name: "Staff Management",
  },
];

async function ensureServicesInitialized() {
  try {
    const existingCount = await serviceRepository.count();
    console.log("Checking master services - Count:", existingCount);

    if (existingCount === 0) {
      console.log("Master services not found. Initializing...");
      for (const serviceData of MOCK_SERVICES) {
        console.log("Creating master service:", serviceData.service_key);
        await serviceRepository.create(serviceData);
      }
      console.log("Master services initialized successfully");
    } else {
      console.log("Master services already exist");
    }
  } catch (error) {
    console.error("Error initializing master services:", error);
    throw error;
  }
}

export const createBusiness: AppRouteMutationImplementation<
  typeof businessContract.createBusiness
> = async ({ req }) => {
  try {
    const {
      businessName,
      operatorName,
      operatorEmail,
      businessType,
      role = "business",
      teams = "",
      branch,
      package: pkg = "starter",
      services,
      payment_initiation,
    } = req.body;

    const existing = await businessRepository.getByEmail(operatorEmail);

    if (existing) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Email already exists",
        },
      };
    }

    const business = await businessRepository.create({
      businessName,
      operatorName,
      operatorEmail,
      operatorPassword: "",
      businessType,
      role,
      teams,
      branch,
      package: pkg,
      payment_initiation,
    });

    if (business) {
      const setupToken = authRepository.createSetupToken(
        {
          accountId: business._id.toString(),
          setupToken: true,
        },
        env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const setupLink = `${env.frontend_url}/pages/welcome?token=${setupToken}`;

      try {
        await sendMail({
          to: operatorEmail,
          subject: "Complete Your FlowDesk Account Setup",
          html: welcomeTemplate({
            businessName,
            operatorName,
            operatorEmail,
            setupLink,
          }),
        });
        console.log(`Welcome email sent successfully to ${operatorEmail}`);
      } catch (emailError) {
        console.error(
          `Failed to send welcome email to ${operatorEmail}:`,
          emailError,
        );
      }
    }

    let normalizedServices: string[] = ["asset_management"];

    if (services) {
      if (Array.isArray(services)) {
        normalizedServices = services;
      } else {
        normalizedServices = [services];
      }
    }

    console.log("Fetching master services for business creation...");

    await ensureServicesInitialized();

    const masterServices = await serviceRepository.getAll();
    console.log("Master services fetched:", masterServices.length);

    const enabledServices = masterServices.filter((service) =>
      normalizedServices.includes(service.service_key),
    );

    await businessServiceConfigRepository.create({
      business_id: business._id,
      services: enabledServices.map((service) => ({
        service_key: service.service_key,
        default_name: service.default_name,
        custom_name: null,
        enabled: true,
        permissions: {
          create: true,
          edit: true,
          delete: false,
          view: true,
        },
      })),
    });

    const createLogs = await activityLogRepository.create({
      module: "Business",
      action: "CREATE",
      userId: new mongoose.Types.ObjectId(business._id),
      title: business.businessName,
      role: "admin",
      description: `Business created by Admin`,
    });

    return {
      status: 201,
      body: {
        success: true,
        message:
          "Business created successfully. Welcome email sent with setup link.",
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

    const files = req.files as {
      profile?: Express.Multer.File[];
    };

    const profileUrl = files?.profile?.[0]?.path || "";

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

    if (profileUrl) {
      updateData.profile = profileUrl;
    }

    if (updateData.branch) {
      updateData.branch = JSON.parse(updateData.branch);
    }

    if (updateData.services) {
      updateData.services = JSON.parse(updateData.services);
    }

    if (updateData.status !== undefined) {
      updateData.status = updateData.status === "true";
    }

    if (updateData.payment_status !== undefined) {
      updateData.payment_status = updateData.payment_status === "true";
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

    const createLogs = await activityLogRepository.create({
      module: "Business",
      action: "DELETE",
      userId: new mongoose.Types.ObjectId(req.params.businessID),
      title: existing.businessName,
      role: existing.role,
      description: `Business account removed by Admin`,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Business account deleted successfully",
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
