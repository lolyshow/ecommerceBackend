const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryUploadImage = (fileToUpload) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload,
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      }
    );
  });
};

const cloudinaryDeleteImg = async (fileToDelete) => {
  return new Promise((resolve, reject) => {

    cloudinary.uploader.destroy(
      fileToDelete,
      {
        resource_type: "image"
      },
      (error, result) => {

        if(error){
          reject(error);
        }

        resolve(result);

      }
    );

  });
};

// module.exports = cloudinaryUploadImage;
module.exports = { cloudinaryUploadImage, cloudinaryDeleteImg };
