import { AppRouteMutationImplementation } from "@ts-rest/express";
import { tokenContract } from "../../contract/token/token.contract";
import tokenRepository from "../../repository/token.repository";
import mongoose from "mongoose";

export const createToken: AppRouteMutationImplementation<
  typeof tokenContract.createToken
> = async ({ req }) => {
  try {
    const { number, tenantId, calledAt, category, clientId, status } = req.body;

    const asset = await tokenRepository.create({
      number,
      tenantId: new mongoose.Types.ObjectId(tenantId),
      calledAt,
      category,
      clientId: new mongoose.Types.ObjectId(clientId),
      status,
    });
    return {
      status: 201,
      body: {
        success: true,
        message: "Token created successfully",
        data: asset,
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const updateToken: AppRouteMutationImplementation<
  typeof tokenContract.updateToken
> = async ({ req }) => {
  const { tokenID } = req.params;
  try {
    const { counter, calledAt, clientId, status } = req.body;

    const updated = await tokenRepository.update(tokenID, {
      counter,
      calledAt,
      clientId: new mongoose.Types.ObjectId(clientId),
      status,
    });
    if (!updated) {
      return {
        status: 404,
        body: { success: false, error: "Token not found" },
      };
    }

    return {
      status: 200,
      body: { success: true, message: "Token updated", data: updated },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const removeToken: AppRouteMutationImplementation<
  typeof tokenContract.removeToken
> = async ({ req }) => {
  try {
    const search = await tokenRepository.getByID(req.params.tokenID);

    if (!search) {
      return {
        status: 404,
        body: { success: false, error: "Token not found" },
      };
    }

    const deleted = await tokenRepository.delete(req.params.tokenID);

    if (!deleted) {
      return {
        status: 404,
        body: { success: false, error: "Token was not deleted" },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Token deleted",
      },
    };
  } catch (error) {
    return {
      status: 500,
      body: { success: false, error: (error as Error).message },
    };
  }
};

export const tokenMutationHandler = {
  createToken,
  updateToken,
  removeToken,
};
