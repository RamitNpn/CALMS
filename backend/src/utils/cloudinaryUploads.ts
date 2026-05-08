import cloudinary from "../config/cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "flowdesk-users",
      resource_type: "image",
    });

    // remove local file after upload
    fs.unlinkSync(filePath);

    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary upload failed");
  }
};