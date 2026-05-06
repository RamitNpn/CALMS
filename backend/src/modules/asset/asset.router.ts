import { initServer } from "@ts-rest/express";
import { assetContract } from "../../contract/asset/asset.contract";

import { assetMutationHandler } from "./asset.mutation";
import { assetQueryHandler } from "./asset.query";

const s = initServer();

export const assetRouter = s.router(assetContract, {
  getAllAssets: assetQueryHandler.getAllAssets,
  getAssetByID: assetQueryHandler.getAssetByID,

  createAsset: assetMutationHandler.createAsset,
  updateAsset: assetMutationHandler.updateAsset,
  removeAsset: assetMutationHandler.removeAsset,
});