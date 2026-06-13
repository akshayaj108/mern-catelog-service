import config from "config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryFileData, FileData, FileStorage } from "../types";

export class CloudinaryStorage implements FileStorage {
  //cloudinary config same will add config in another file class for aws s3 storage implementation
  constructor() {
    cloudinary.config({
      cloud_name: config.get("storage.cloudinary.cloudName"),
      api_key: config.get("storage.cloudinary.cloudApiKey"),
      api_secret: config.get("storage.cloudinary.cloudSecretKry"),
    });
  }

  async upload(data: FileData | CloudinaryFileData): Promise<string> {
    const base64String = Buffer.from(data.fileData as Buffer).toString(
      "base64",
    );

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64String}`,
      {
        public_id: data.fileName,
      },
    );

    return result.secure_url;
  }
  async delete(fileName: string): Promise<void> {
    await cloudinary.uploader.destroy(fileName);
  }

  getObjectUri(fileName: string): string {
    const cloudName = config.get<string>("storage.cloudinary.cloudName");

    return `https://res.cloudinary.com/${cloudName}/image/upload/${fileName}`;
  }
}
