import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";
import activityLogRepository from "../../repository/activity-log.repository";
import businessRepository from "../../repository/business.repository";
import userRepository from "../../repository/user.repository";
import { financeContract } from "../../contract/finance/finance.contract";
import financeRepository from "../../repository/finance.repository";

export const createFinance: AppRouteMutationImplementation<
  typeof financeContract.createFinance
> = async ({ req }) => {
  try {
    let {
      business_id,
      title,
      type,
      category,
      amount,
      relatedTo,
      objectType,
      objectId,
      paymentMethod,                                
      referenceNumber,
      description,
      status,
      transactionDate,
      createdBy,
    } = req.body;

    amount = Number(amount);

    const financialRecord = await financeRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      title,
      type,
      category,
      amount: amount,
      relatedTo,
      objectType,
      objectId,
      paymentMethod,
      referenceNumber,
      description,
      status,
      transactionDate,
      createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : undefined,
    });

    const businessUser = await businessRepository.getByID(business_id);

    const user = await userRepository.getByID(business_id);

    const account = businessUser || user;

    if (!account) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    if (financialRecord) {
      await activityLogRepository.create({
        module: "Financial",

        action: "CREATE",

        userId: new mongoose.Types.ObjectId(business_id),

        role: account.role,

        title,

        description: `Financial record created: ${title} (${type}) by ${userName}`,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Financial record created successfully",
        data: financialRecord,
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

export const updateFinance: AppRouteMutationImplementation<
  typeof financeContract.updateFinance
> = async ({ req }) => {
  try {
    const { financeID } = req.params;

    const {
      title,
      type,
      category,
      amount,
      relatedTo,
      objectType,
      objectId,
      paymentMethod,
      referenceNumber,
      description,
      status,
      transactionDate,
      createdBy,
    } = req.body;

    const updateData: any = {};

    if (title !== undefined) updateData.title = title;

    if (type !== undefined) updateData.type = type;

    if (category !== undefined) updateData.category = category;

    if (amount !== undefined) updateData.amount = amount;

    if (relatedTo !== undefined) updateData.relatedTo = relatedTo;

    if (objectType !== undefined) updateData.objectType = objectType;

    if (objectId !== undefined) updateData.objectId = objectId;

    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

    if (referenceNumber !== undefined)
      updateData.referenceNumber = referenceNumber;

    if (description !== undefined) updateData.description = description;

    if (status !== undefined) updateData.status = status;

    if (transactionDate !== undefined)
      updateData.transactionDate = transactionDate;

    if (createdBy !== undefined) updateData.createdBy = createdBy;

    const updated = await financeRepository.update(financeID, updateData);

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Financial record not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Financial record updated",
        data: updated,
      },
    };
  } catch (error) {
    console.error("Error updating financial record:", error);

    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeFinance: AppRouteMutationImplementation<
  typeof financeContract.removeFinance
> = async ({ req }) => {
  try {
    const existing = await financeRepository.getByID(req.params.financeID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Financial record not found",
        },
      };
    }

    const deleted = await financeRepository.delete(req.params.financeID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Financial record was not deleted",
        },
      };
    }

    const businessUser = await businessRepository.getByID(
      existing.business_id.toString(),
    );

    const user = await userRepository.getByID(existing.business_id.toString());

    const account = businessUser || user;

    if (!account) {
      return {
        status: 404,
        body: {
          success: false,
          error: "User not found",
        },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    if (deleted) {
      await activityLogRepository.create({
        module: "Financial",

        action: "DELETE",

        userId: new mongoose.Types.ObjectId(existing.business_id),

        role: account.role,

        title: existing.title,

        description: `Financial record deleted by ${userName}`,
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Financial record deleted",
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

export const financeMutationHandler = {
  createFinance,
  updateFinance,
  removeFinance,
};
