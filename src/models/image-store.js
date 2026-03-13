import * as cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const credentials = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

cloudinary.config(credentials);

export const imageStore = {

  getAllImages: async function () {
    const result = await cloudinary.v2.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
    console.log("UPLOAD FUNCTION RUNNING");
    const response = await cloudinary.v2.uploader.upload(imagefile.path);
    return response.url;
  },

  deleteImage: async function (img) {
    await cloudinary.v2.uploader.destroy(img, {});
  }
};

// keeps storage logic away from controller