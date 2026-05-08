import { upload } from "./multer";

export const userUploadFields = upload.fields([
  { name: "profile", maxCount: 1 },
  { name: "citizenship", maxCount: 1 },
  { name: "license", maxCount: 1 },
  { name: "certificate", maxCount: 1 },
]);