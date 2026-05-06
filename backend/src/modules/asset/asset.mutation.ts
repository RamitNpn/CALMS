import { AppRouteMutationImplementation } from "@ts-rest/express";
import { assetContract } from "../../contract/asset/asset.contract";
import assetRepository from "../../repository/asset.repository";
import mongoose from "mongoose";

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

    const updated = await assetRepository.update(assetID,{
      name,
      type,
      customFields,
      status,
    });

    if (!updated) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Asset updated",
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