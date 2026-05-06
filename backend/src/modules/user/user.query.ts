import { AppRouteQueryImplementation } from "@ts-rest/express";
import { userContract } from "../../contract/users/user.contract";
import userRepository from "../../repository/user.repository";

export const getAllUsers: AppRouteQueryImplementation<
  typeof userContract.getAllUsers
> = async () => {
  try {
    const users = await userRepository.getAll();

    const formattedUsers = users.map((u) => ({
      _id: u._id.toString(),
      business_id: u.business_id.toString(),
      userName: u.userName,
      userEmail: u.userEmail,
      userPhone: u.userPhone,
      gender: u.gender,
      profile: u.profile,
      citizenship: u.citizenship,
      liscence: u.liscence,
      certificate: u.certificate,
      role: u.role,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    return {
      status: 200,
      body: formattedUsers,
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

    return {
      status: 200,
      body: {
        _id: user._id.toString(),
        business_id: user.business_id.toString(),
        userName: user.userName,
        userEmail: user.userEmail,
        userPhone: user.userPhone,
        gender: user.gender,
        profile: user.profile,
        citizenship: user.citizenship,
        liscence: user.liscence,
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