import { FirebaseProvider } from "../provider/firebase.provider";
import { UploadFile, UploadOptions, UploadResult } from "./upload.types";


class UploadService {
  private firebase = new FirebaseProvider();

  async upload(file: UploadFile, options?: UploadOptions): Promise<UploadResult> {
    return this.firebase.upload(file, options);
  }

  async delete(fileName: string) {
    return this.firebase.delete(fileName);
  }
}

export const uploadService = new UploadService();