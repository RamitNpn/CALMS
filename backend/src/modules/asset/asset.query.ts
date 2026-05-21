import { AppRouteQueryImplementation } from "@ts-rest/express";
import { assetContract } from "../../contract/asset/asset.contract";
import assetRepository from "../../repository/asset.repository";

export const getAllAssets: AppRouteQueryImplementation<
  typeof assetContract.getAllAssets
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const business_id = req.query.business_id as string | undefined;
    const skip = (page - 1) * limit;

    const { data: assets, total } = await assetRepository.getAll(business_id, skip, limit);
    const totalPages = Math.ceil(total / limit);

    const formattedAssets = assets.map((a) => ({
      _id: a._id.toString(),
      business_id: a.business_id.toString(),
      name: a.name,
      type: a.type,
      customFields: a.customFields,
      status: a.status,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    }));

    return {
      status: 200,
      body: {
        data: formattedAssets,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error in getAllAssets:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all assets",
      },
    };
  }
};

export const getAssetByID: AppRouteQueryImplementation<
  typeof assetContract.getAssetByID
> = async ({ req }) => {
  const { assetID } = req.params;

  if (!assetID) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Asset ID is required",
      },
    };
  }

  try {
    const asset = await assetRepository.getByID(assetID);

    if (!asset) {
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
        _id: asset._id.toString(),
        business_id: asset.business_id.toString(),
        name: asset.name,
        type: asset.type,
        customFields: asset.customFields,
        status: asset.status,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
      },
    };
  } catch (error) {
    console.error("Error in getAssetByID:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get asset",
      },
    };
  }
};

export const assetQueryHandler = {
  getAllAssets,
  getAssetByID,
};