import { initServer } from "@ts-rest/express";
import { assetContract } from "../../contract/asset/asset.contract";

import { assetMutationHandler } from "./asset.mutation";
import { assetQueryHandler } from "./asset.query";
import { userUploadFields } from "../../middleware/upload-fields";

const s = initServer();

export const assetRouter = s.router(assetContract, {
  getAllAssets: assetQueryHandler.getAllAssets,
  getAssetByID: assetQueryHandler.getAssetByID,

  createAsset: {
    middleware: [userUploadFields],
    handler: assetMutationHandler.createAsset,
  },
  updateAsset: {
    middleware: [userUploadFields],
    handler: assetMutationHandler.updateAsset,
  },
  removeAsset: assetMutationHandler.removeAsset,
});
