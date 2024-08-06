import {v2 as cloudinary} from "cloudinary";

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  }); 
  return cloudinary
}
export const uploadFileToHost = async ({ file, folder = "General", publicId }) => {
  if (!file) {
    return next(
      new ErrorClass("Please upload an image", 400, "Please upload an image")
    );
  }

  let options = { folder };
  if (publicId) {
    options.public_id = publicId;
  }

  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    file,
    options
  );

  return { secure_url, public_id };
};
