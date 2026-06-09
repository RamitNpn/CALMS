export type UploadProvider = "firebase";

export interface UploadFile {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
}

export interface UploadOptions {
  folder?: string;
  isPublic?: boolean;
}

export interface UploadResult {
  url: string;
  fileName: string;
  provider: UploadProvider;
}