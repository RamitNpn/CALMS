import { bucket } from "../config/firebaseAdmin";
import {
  UploadFile,
  UploadOptions,
  UploadResult,
} from "../uploads/upload.types";

export class FirebaseProvider {
  async upload(
    file: UploadFile,
    options?: UploadOptions,
  ): Promise<UploadResult> {
    const fileName = `${options?.folder || "uploads"}/${Date.now()}-${file.originalName}`;

    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimeType,
      },
    });

    await fileUpload.makePublic();

    const [url] = await fileUpload.getSignedUrl({
  action: "read",
  expires: "03-01-2030",
});

    return {
      url,
      fileName,
      provider: "firebase",
    };
  }

  async delete(fileName: string) {
    await bucket.file(fileName).delete();
  }
}
