import { initServer } from "@ts-rest/express";
import { assetTypeContract } from "../../contract/asset-type/type.contract";
import { assetTypeMutationHandler } from "./type.mutation";
import { assetTypeQueryHandler } from "./type.query";

const s = initServer();

export const assetTypeRouter = s.router(assetTypeContract, {
    createAssetType: assetTypeMutationHandler.createAssetType,
    updateAssetType: assetTypeMutationHandler.updateAssetType,
    removeAssetType: assetTypeMutationHandler.removeAssetType,

    getAllAssetTypes: assetTypeQueryHandler.getAllAssetTypes,
    getAssetTypeByID: assetTypeQueryHandler.getAssetTypeByID,
});