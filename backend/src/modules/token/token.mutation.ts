import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";

import activityLogRepository from "../../repository/activity-log.repository";
import { tokenContract } from "../../contract/token/token.contract";
import tokenRepository from "../../repository/token.repository";


export const createToken: AppRouteMutationImplementation<
  typeof tokenContract.createToken
> = async ({ req }) => {
  try {
    const {
      businessId,
      tokenNumber,
      roundNumber,
      perRoundCharge,
      participationDate,

      fullName,
      email,
      phone,

      vehicleCategory,
      preferredShift,

      status,
      remarks,
    } = req.body;

    // Check duplicate token number
    const existingToken =
      await tokenRepository.getByTokenNumber(
        tokenNumber,
      );

    if (existingToken) {
      return {
        status: 409,
        body: {
          success: false,
          error: "Token number already exists",
        },
      };
    }

    // Calculate total amount
    const totalAmount =
      Number(roundNumber) * Number(perRoundCharge);

    // Create token
    const token =
      await tokenRepository.create({
        businessId,
        tokenNumber,
        roundNumber,
        perRoundCharge,
        totalAmount,
        participationDate,

        fullName,
        email,
        phone,

        vehicleCategory,
        preferredShift,

        status,
        remarks,
      });

    // Activity log
    await activityLogRepository.create({
      module: "Driving Institute Token",
      action: "CREATE",
      userId: new mongoose.Types.ObjectId(token._id),
      title: fullName,
      role: "admin",
      description: `Driving token created for ${fullName}`,
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Driving institute token created successfully",
        data: token,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: `Error creating token: ${
          (error as Error).message
        }`,
      },
    };
  }
};

export const updateToken: AppRouteMutationImplementation<
  typeof tokenContract.updateToken
> = async ({ req }) => {
  try {
    const { tokenID } = req.params;

    const existing =
      await tokenRepository.getByID(
        tokenID,
      );

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Token not found",
        },
      };
    }

    const updateData = req.body;

    if (
      updateData.roundNumber ||
      updateData.perRoundCharge
    ) {
      const roundNumber =
        updateData.roundNumber ??
        existing.roundNumber;

      const perRoundCharge =
        updateData.perRoundCharge ??
        existing.perRoundCharge;

      updateData.totalAmount =
        Number(roundNumber) *
        Number(perRoundCharge);
    }

    // Prevent duplicate token number
    if (
      updateData.tokenNumber &&
      updateData.tokenNumber !== existing.tokenNumber
    ) {
      const duplicate =
        await tokenRepository.getByTokenNumber(
          updateData.tokenNumber,
        );

      if (duplicate) {
        return {
          status: 409,
          body: {
            success: false,
            error: "Token number already exists",
          },
        };
      }
    }

    const updated =
      await tokenRepository.update(
        tokenID,
        updateData,
      );

    // Activity log
    await activityLogRepository.create({
      module: "Driving Institute Token",
      action: "UPDATE",
      userId: new mongoose.Types.ObjectId(tokenID),
      title: updated?.fullName || existing.fullName,
      role: "admin",
      description: `Driving token updated for ${
        updated?.fullName || existing.fullName
      }`,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Driving institute token updated successfully",
        data: updated,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: {
        success: false,
        error: `Error updating token: ${
          (error as Error).message
        }`,
      },
    };
  }
};

export const removeToken: AppRouteMutationImplementation<
  typeof tokenContract.removeToken
> = async ({ req }) => {
  try {
    const { tokenID } = req.params;

    const existing =
      await tokenRepository.getByID(
        tokenID,
      );

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Token not found",
        },
      };
    }

    const deleted =
      await tokenRepository.delete(
        tokenID,
      );

    if (!deleted) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Failed to delete token",
        },
      };
    }

    // Activity log
    await activityLogRepository.create({
      module: "Driving Institute Token",
      action: "DELETE",
      userId: new mongoose.Types.ObjectId(tokenID),
      title: existing.fullName,
      role: "admin",
      description: `Driving token deleted for ${existing.fullName}`,
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Driving institute token deleted successfully",
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

export const TokenMutationHandler = {
  createToken,
  updateToken,
  removeToken,
};