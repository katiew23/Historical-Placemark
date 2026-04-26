import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const imageStore = {

  getAllImages: async function () {
    const result = await cloudinary.api.resources();
    return result.resources;
  },

  uploadImage: async function (imagefile) {
  console.log("UPLOAD FUNCTION RUNNING");

  const response = await cloudinary.uploader.upload(imagefile.path);

  return {
    url: response.secure_url,
    public_id: response.public_id
  };
},

  deleteImage: async function (img) {
    await cloudinary.uploader.destroy(img);
  }
};
// keeps storage logic away from controller