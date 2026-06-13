import { Request } from "express";
export interface AuthRequest extends Request {
  auth: {
    sub: string;
    role: string;
    id?: string;
  };
}

//files storage
//for aws s3
export interface FileData {
  fileName: string;
  fileData: ArrayBuffer;
}

//for cloudinary
export interface CloudinaryFileData {
  fileName: string;
  fileData: Buffer;
}

//common class types for (Deendency Inversion Principle)
export interface FileStorage {
  upload(data: FileData | CloudinaryFileData): Promise<string>;
  delete(fileName: string): Promise<void>;
  getObjectUri(fileName: string): string;
}
