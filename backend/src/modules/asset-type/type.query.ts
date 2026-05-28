import { AppRouteQueryImplementation } from "@ts-rest/express";
import assetRepository from "../../repository/asset.repository";
import { assetTypeContract } from "../../contract/asset-type/type.contract";
import typeRepository from "../../repository/type.repository";

export const getAllAssetTypes: AppRouteQueryImplementation<
  typeof assetTypeContract.getAllAssetTypes
> = async ({ req }) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const business_id = req.query.business_id as string | undefined;
    const skip = (page - 1) * limit;

    const { data: assets, total } = await typeRepository.getAll(
      business_id,
      skip,
      limit,
    );
    const totalPages = Math.ceil(total / limit);

    const formattedAssets = assets.map((a) => ({
      _id: a._id.toString(),
      business_id: a.business_id.toString(),
      typeName: a.typeName,
      description: a.description,
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
    console.error("Error in getAllAssetTypes:", error);
    return {
      status: 500,
      body: {
        success: false,
        error: "Failed to get all asset types",
      },
    };
  }
};

export const getAssetTypeByID: AppRouteQueryImplementation<
  typeof assetTypeContract.getAssetTypeByID
> = async ({ req }) => {
  const { assetTypeID } = req.params;

  if (!assetTypeID) {
    return {
      status: 400,
      body: {
        success: false,
        error: "Asset Type ID is required",
      },
    };
  }

  try {
    const asset = await typeRepository.getByID(assetTypeID);

    if (!asset) {
      return {
        status: 404,
        body: {
          success: false,
          error: "Asset Type not found",
        },
      };
    }

    return {
      status: 200,
      body: {
        _id: asset._id.toString(),
        business_id: asset.business_id.toString(),
        typeName: asset.typeName,
        description: asset.description,
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
        error: "Failed to get asset type",
      },
    };
  }
};

export const assetTypeQueryHandler = {
  getAllAssetTypes,
  getAssetTypeByID,
};
