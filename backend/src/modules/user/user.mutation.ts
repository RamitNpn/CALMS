import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";
import userRepository from "../../repository/user.repository";
import { userContract } from "../../contract/user/user.contract";
import activityLogRepository from "../../repository/activity-log.repository";
import businessRepository from "../../repository/business.repository";

export const createUser: AppRouteMutationImplementation<
  typeof userContract.createUser
> = async ({ req }) => {
  try {
    const {
      business_id,
      userName,
      userEmail,
      userPhone,
      userPassword,
      gender,
      role,
    } = req.body;

    const files = req.files as {
      profile?: Express.Multer.File[];
      citizenship?: Express.Multer.File[];
      license?: Express.Multer.File[];
      certificate?: Express.Multer.File[];
    };

    // Cloudinary URLs
    const profileUrl = files?.profile?.[0]?.path;
    const citizenshipUrl = files?.citizenship?.[0]?.path;
    const licenseUrl = files?.license?.[0]?.path;
    const certificateUrl = files?.certificate?.[0]?.path;

    const created = await userRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      userName,
      userEmail,
      userPhone,
      userPassword,
      gender,
      profile: profileUrl,
      citizenship: citizenshipUrl,
      license: licenseUrl,
      certificate: certificateUrl,
      role,
    });

    const user = await businessRepository.getByID(business_id);
    const userRole = user?.role === "client" ? "Client" : "Staff";

    if (!user) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    if (user) {
      const createLogs = await activityLogRepository.create({
        module: userRole,
        action: "CREATE",
        userId: new mongoose.Types.ObjectId(business_id),
        title: user.businessName,
        role: user.role,
        description: `${userRole} added by business admin: ${user.operatorName}`,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        data: created,
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

export const updateUser: AppRouteMutationImplementation<
  typeof userContract.updateUser
> = async ({ req }) => {
  try {
    const { userID } = req.params;

    const { userName, userEmail, userPhone, userPassword, gender, role } =
      req.body;

    const files = req.files as {
      profile?: Express.Multer.File[];
      citizenship?: Express.Multer.File[];
      license?: Express.Multer.File[];
      certificate?: Express.Multer.File[];
    };

    // Cloudinary URLs
    const profileUrl = files?.profile?.[0]?.path;
    const citizenshipUrl = files?.citizenship?.[0]?.path;
    const licenseUrl = files?.license?.[0]?.path;
    const certificateUrl = files?.certificate?.[0]?.path;

    const updated = await userRepository.update(userID, {
      userName,
      userEmail,
      userPhone,
      userPassword,
      gender,
      profile: profileUrl,
      citizenship: citizenshipUrl,
      license: licenseUrl,
      certificate: certificateUrl,

      role,
    });

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "User updated",
        data: updated,
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

export const removeUser: AppRouteMutationImplementation<
  typeof userContract.removeUser
> = async ({ req }) => {
  try {
    const { userID } = req.params;

    const existing = await userRepository.getByID(userID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const deleted = await userRepository.delete(userID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User was not deleted",
        },
      };
    }

    const user = await businessRepository.getByID(existing.business_id.toString());
    const userRole = user?.role === "client" ? "Client" : "Staff";

    if (!user) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    if (user) {
      const createLogs = await activityLogRepository.create({
        module: userRole,
        action: "DELETE",
        userId: new mongoose.Types.ObjectId(existing.business_id.toString()),
        title: user.businessName,
        role: user.role,
        description: `${userRole} removed by business admin: ${user.operatorName}`,
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "User deleted",
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

export const userMutationHandler = {
  createUser,
  updateUser,
  removeUser,
};
