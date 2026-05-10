import { AppRouteQueryImplementation } from "@ts-rest/express";
import { userContract } from "../../contract/users/user.contract";
import userRepository from "../../repository/user.repository";
import businessRepository from "../../repository/business.repository";

export const getAllUsers: AppRouteQueryImplementation<
  typeof userContract.getAllUsers
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string | undefined;
    const skip = (page - 1) * limit;

    const { data: users, total } = await userRepository.getAll(skip, limit, role);
    const totalPages = Math.ceil(total / limit);

    const formattedUsers = users.map((u) => ({
      _id: u._id.toString(),
      business_id: u.business_id.toString(),
      userName: u.userName,
      userEmail: u.userEmail,
      userPhone: u.userPhone,
      gender: u.gender,
      profile: u.profile,
      citizenship: u.citizenship,
      license: u.license,
      certificate: u.certificate,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all users",
      },
    };
  }
};

export const getUserByID: AppRouteQueryImplementation<
  typeof userContract.getUserByID
> = async ({ req }) => {
  const { userID } = req.params;

  if (!userID) {
    return {
      status: 400,
      body: {
        success: false,
        error: "User ID is required",
      },
    };
  }

  try {
    const user = await userRepository.getByID(userID);

    if (!user) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const businessName = await businessRepository.getByID(user.business_id.toString());

    return {
      status: 200,
      body: {
        _id: user._id.toString(),
        business_id: user.business_id.toString(),
        businessName: businessName?.businessName || "N/A",
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        gender: user.gender,
        profile: user.profile,
        citizenship: user.citizenship,
        license: user.license,
        certificate: user.certificate,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in getUserByID:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get user",
      },
    };
  }
};

export const userQueryHandler = {
  getAllUsers,
  getUserByID,
};