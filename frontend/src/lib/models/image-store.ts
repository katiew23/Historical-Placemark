import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} from "$env/static/private";

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

export const imageStore = {
  async uploadImage(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (error, response) => {
          if (error) {
            reject(error);
            return;
          }

          if (!response) {
            reject(new Error("Cloudinary upload failed: no response returned"));
            return;
          }

          resolve({
            url: response.secure_url,
            public_id: response.public_id
          });
        })
        .end(buffer);
    });
  },

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
};