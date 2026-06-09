export function toUploadFile(file: Express.Multer.File) {
  return {
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
}