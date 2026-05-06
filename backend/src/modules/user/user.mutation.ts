import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";
import { userContract } from "../../contract/users/user.contract";
import userRepository from "../../repository/user.repository";

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
      profile,
      citizenship,
      liscence,
      certificate,
      role,
    } = req.body;

    const client = await userRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      userName,
      userEmail,
      userPhone,
      userPassword,
      gender,
      profile,
      citizenship,
      liscence,
      certificate,
      role,
    });

    return {
      status: 201,
      body: {
        success: true,
        data: client,
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

     const {
      userName,
      userEmail,
      userPhone,
      userPassword,
      gender,
      profile,
      citizenship,
      liscence,
      certificate,
      role,
    } = req.body;

    const updated = await userRepository.update(userID, {
      userName,
      userEmail,
      userPhone,
      userPassword,
      gender,
      profile,
      citizenship,
      liscence,
      certificate,
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