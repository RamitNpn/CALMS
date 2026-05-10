import { AppRouteQueryImplementation } from "@ts-rest/express";
import { tokenContract } from "../../contract/token/token.contract";
import tokenRepository from "../../repository/token.repository";

export const getAllTokens: AppRouteQueryImplementation<
  typeof tokenContract.getAllTokens
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { data: tokens, total } = await tokenRepository.getAll(skip, limit);
    const totalPages = Math.ceil(total / limit);

    const formattedTokens = tokens.map((t) => ({
      _id: t._id.toString(),
      tenantId: t.tenantId.toString(),
      number: t.number,
      category: t.category,
      counter: t.counter,
      status: t.status,
      clientId: t.clientId ? t.clientId.toString() : undefined,
      calledAt: t.calledAt,
      createdAt: t.createdAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedTokens,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllTokens:", error);
    return {
      status: 500,
      body: { success: false, error: "Failed to get all tokens" },
    };
  }
};

export const getTokenByID: AppRouteQueryImplementation<
  typeof tokenContract.getTokenByID
> = async ({ req }) => {
  try {
    const { tokenID } = req.params;

    if (!tokenID) {
      return {
        status: 400,
        body: { success: false, error: "Token ID is required" },
      };
    }

    const token = await tokenRepository.getByID(tokenID);

    if (!token) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Token not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: token._id.toString(),
        tenantId: token.tenantId.toString(),
        number: token.number,
        category: token.category,
        counter: token.counter,
        status: token.status,
        clientId: token.clientId ? token.clientId.toString() : undefined,
        calledAt: token.calledAt,
        createdAt: token.createdAt,
      },
    };
  } catch (error) {
    console.error("Error in getTokenByID:", error);
    return {
      status: 500,
      body: { success: false, error: "Failed to get token by ID" },
    };
  }
};

export const tokenQueryHandler = {
  getAllTokens,
  getTokenByID,
};