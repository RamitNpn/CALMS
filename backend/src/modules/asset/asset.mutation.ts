import { AppRouteMutationImplementation } from "@ts-rest/express";
import { assetContract } from "../../contract/asset/asset.contract";
import assetRepository from "../../repository/asset.repository";
import mongoose from "mongoose";
import activityLogRepository from "../../repository/activity-log.repository";
import businessRepository from "../../repository/business.repository";
import userRepository from "../../repository/user.repository";

export const createAsset: AppRouteMutationImplementation<
  typeof assetContract.createAsset
> = async ({ req }) => {
  try {
    const { business_id, name, type, customFields, status } = req.body;

    const asset = await assetRepository.create({
      business_id: new mongoose.Types.ObjectId(business_id),
      name,
      type,
      customFields,
      status,
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
        module: "Asset",
        action: "CREATE",
        userId: new mongoose.Types.ObjectId(business_id),
        role: account.role,
        title: name,
        description: `Asset created with name: ${name}`,
      });
    }

    return {
      status: 201,
      body: {
        success: true,
        message: "Asset created successfully",
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

export const updateAsset: AppRouteMutationImplementation<
  typeof assetContract.updateAsset
> = async ({ req }) => {
  try {
    const { assetID } = req.params;
    const { name, type, customFields, status } = req.body;

    console.log("UPDATING ASSET:", assetID);
    console.log("NAME:", name);
    console.log("TYPE:", type);
    console.log("STATUS:", status);
    console.log(
      "CUSTOM FIELDS RECEIVED:",
      JSON.stringify(customFields, null, 2),
    );
    console.log("FULL REQ BODY:", JSON.stringify(req.body, null, 2));

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (customFields !== undefined) {
      console.log(
        "SETTING CUSTOM FIELDS TO:",
        JSON.stringify(customFields, null, 2),
      );
      updateData.customFields = customFields;
    }

    console.log("FINAL UPDATE DATA:", JSON.stringify(updateData, null, 2));

    const updated = await assetRepository.update(assetID, updateData);

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset not found",
        },
      };
    }

    console.log(
      "ASSET UPDATED SUCCESSFULLY. NEW CUSTOM FIELDS:",
      JSON.stringify(updated.customFields, null, 2),
    );

    return {
      status: 200,
      body: {
        success: true,
        message: "Asset updated",
        data: updated,
      },
    };
  } catch (error) {
    console.error("Error while updating asset:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: (error as Error).message,
      },
    };
  }
};

export const removeAsset: AppRouteMutationImplementation<
  typeof assetContract.removeAsset
> = async ({ req }) => {
  try {
    const existing = await assetRepository.getByID(req.params.assetID);

    if (!existing) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset not found",
        },
      };
    }

    const deleted = await assetRepository.delete(req.params.assetID);

    if (!deleted) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset was not deleted",
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
        module: "Asset",
        action: "DELETE",
        userId: new mongoose.Types.ObjectId(existing.business_id),
        role: account.role,
        title: existing.name,
        description: `Asset deleted by ${userName}`,
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Asset deleted",
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

export const assetMutationHandler = {
  createAsset,
  updateAsset,
  removeAsset,
};
