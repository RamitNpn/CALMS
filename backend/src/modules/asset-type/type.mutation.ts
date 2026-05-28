import { AppRouteMutationImplementation } from "@ts-rest/express";
import mongoose from "mongoose";
import activityLogRepository from "../../repository/activity-log.repository";
import businessRepository from "../../repository/business.repository";
import userRepository from "../../repository/user.repository";
import { assetTypeContract } from "../../contract/asset-type/type.contract";
import typeRepository from "../../repository/type.repository";

export const createAssetType: AppRouteMutationImplementation<
  typeof assetTypeContract.createAssetType
> = async ({ req }) => {
  try {
    const { business_id, typeName, description } = req.body;

    const asset = await typeRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      typeName,
      description,
    });

    const businessUser = await businessRepository.getByID(business_id);
    const user = await userRepository.getByID(business_id);
    const account = businessUser || user;

    if (!account) {
      return {
        status: 404,
        body: { success: false, error: "User not found" },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    if (asset) {
      const createLogs = await activityLogRepository.create({
        module: "Type",
        action: "CREATE",
        userId: new mongoose.Types.ObjectId(business_id),
        role: account.role,
        title: typeName,
        description: `Type created with name: ${userName}`,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Type created successfully",
        data: asset,
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


export const updateAssetType: AppRouteMutationImplementation<
  typeof assetTypeContract.updateAssetType
> = async ({ req }) => {
  try {
    const { assetTypeID } = req.params;
    const { typeName, description } = req.body;

    const updated = await typeRepository.update(assetTypeID, { typeName, description });

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset type not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Asset type updated",
        data: updated,
      },
    };
  } catch (error) {
    console.error("Error while updating asset type:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeAssetType: AppRouteMutationImplementation<
  typeof assetTypeContract.removeAssetType
> = async ({ req }) => {
  try {
    const existing = await typeRepository.getByID(req.params.assetTypeID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset type not found",
        },
      };
    }

    const deleted = await typeRepository.delete(req.params.assetTypeID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset type was not deleted",
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
        body: { success: false, error: "User not found" },
      };
    }

    const isBusiness = "operatorPassword" in account;

    const userName = isBusiness ? account.operatorName : account.userName;

    if (deleted) {
      const createLogs = await activityLogRepository.create({
        module: "Type",
        action: "DELETE",
        userId: new mongoose.Types.ObjectId(existing.business_id),
        role: account.role,
        title: existing.typeName,
        description: `Asset type deleted by ${userName}`,
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Asset type deleted",
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

export const assetTypeMutationHandler = {
  createAssetType,
  updateAssetType,
  removeAssetType,
};
