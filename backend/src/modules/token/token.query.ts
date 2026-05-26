import { AppRouteQueryImplementation } from "@ts-rest/express";
import { tokenContract } from "../../contract/token/token.contract";
import tokenRepository from "../../repository/token.repository";



export const getAlltokens: AppRouteQueryImplementation<
  typeof tokenContract.getAllTokens
> = async ({ req }) => {
  try {
    const page =
      (req.query.page as unknown as number) || 1;

    const limit =
      (req.query.limit as unknown as number) || 10;

    const skip = (page - 1) * limit;

    const {
      data: tokens,
      total,
    } = await tokenRepository.getAll(
      skip,
      limit,
    );

    const totalPages = Math.ceil(total / limit);

    const formatted = tokens.map((token: any) => ({
      _id: token._id.toString(),

      businessId: token.businessId,

      tokenNumber: token.tokenNumber,
      roundNumber: token.roundNumber,
      perRoundCharge: token.perRoundCharge,
      totalAmount: token.totalAmount,
      participationDate: token.participationDate,

      fullName: token.fullName,
      email: token.email,
      phone: token.phone,

      vehicleCategory: token.vehicleCategory,
      preferredShift: token.preferredShift,

      status: token.status,
      remarks: token.remarks,

      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
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
    console.error(
      "Error in getAlltokens:",
      error,
    );

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch driving institute tokens",
      },
    };
  }
};

export const gettokenByID: AppRouteQueryImplementation<
  typeof tokenContract.getTokenByID
> = async ({ req }) => {
  try {
    const { tokenID } = req.params;

    if (!tokenID) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Token ID is required",
        },
      };
    }

    const token =
      await tokenRepository.getByID(
        tokenID,
      );

    if (!token) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Driving institute token not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: token._id.toString(),

        businessId: token.businessId,

        tokenNumber: token.tokenNumber,
        roundNumber: token.roundNumber,
        perRoundCharge: token.perRoundCharge,
        totalAmount: token.totalAmount,
        participationDate: token.participationDate,

        fullName: token.fullName,
        email: token.email,
        phone: token.phone,

        vehicleCategory: token.vehicleCategory,
        preferredShift: token.preferredShift,

        status: token.status,
        remarks: token.remarks,

        createdAt: token.createdAt,
        updatedAt: token.updatedAt,
      },
    };
  } catch (error) {
    console.error(
      "Error in gettokenByID:",
      error,
    );

    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to fetch driving institute token",
      },
    };
  }
};

export const getLatestDailyToken: AppRouteQueryImplementation<
  typeof tokenContract.getLatestDailyToken
> = async ({ req }) => {
  try {
    const { date } = req.query;

    if (!date) {
      return {
        status: 400,
        body: {
          success: false,
          error: "Date is required",
        },
      };
    }

    const latest =
      await tokenRepository.getLatestDailyToken(
        String(date),
      );

    return {
      status: 200,
      body: {
        success: true,
        data: latest,
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

export const tokenQueryHandler = {
  getAlltokens,
  gettokenByID,
  getLatestDailyToken,
};