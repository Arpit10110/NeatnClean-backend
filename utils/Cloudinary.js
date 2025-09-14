import cloudinary from "../config/Cloudinary_config.js";
import { configureCloudinary } from '../config/Cloudinary_config.js';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const UploadonCloudinary = async (file, maxRetries = 3) => {
  configureCloudinary();

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: "green-uploads",
      });
      return {
        success: true,
        result,
      }; // success
    } catch (error) {
      attempt++;
      console.error(`Cloudinary upload attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        return {
            success: false,
            message: "Failed to upload image",
        }
      }
      await delay(2 ** attempt * 1000);
    }
  }
};
