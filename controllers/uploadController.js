const asyncHandler = require("express-async-handler");
const fs = require("fs");
const cloudinaryUploadImage = require("../utils/cloudinary");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await cloudinaryUploadImage(path, "images");

    const files = req.files;
    const urls = [];

    for (const file of files) {
      const path = file.path;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path); // delete temp file after upload
    }

    res.json(urls);
  } catch (error) {
    console.log(error);
    throw new Error("Image upload failed");
  }
});

module.exports = { uploadImages };
