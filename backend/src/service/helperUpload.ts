import { uploadService } from "../uploads/upload.service";
import { toUploadFile } from "../uploads/upload.utils";

export async function uploadSingleImage(
  file?: Express.Multer.File,
  folder = "uploads",
) {
  if (!file) return "";

  const uploaded = await uploadService.upload(toUploadFile(file), {
    folder,
    isPublic: true,
  });

  return uploaded.url;
}
