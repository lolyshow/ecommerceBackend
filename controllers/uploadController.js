const asyncHandler = require("express-async-handler");
const fs = require("fs");
const sharp = require("sharp");
const {
  cloudinaryUploadImage,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");

const path = require("path");

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = async (filePath) =>
      await cloudinaryUploadImage(filePath, "products");

    const urls = [];

    for (const file of req.files) {
      // Check image dimensions
      const metadata = await sharp(file.path).metadata();

      if (metadata.width < 800 || metadata.height < 800) {
        fs.unlinkSync(file.path);

        return res.status(400).json({
          success: false,
          message: `${file.originalname} is too small. Minimum size is 800 × 800 pixels.`,
        });
      }

      // Create processed image
      const processedPath = path.join(
        __dirname,
        "../public/images",
        `processed-${file.filename}`,
      );

      await sharp(file.path)
        .resize(1000, 1000, {
          fit: "contain",
          background: "#b6b2b1"
          ,
        })
        .jpeg({ quality: 90 })
        .toFile(processedPath);

      // Upload resized image
      const result = await uploader(processedPath);

      urls.push(result);

      // Delete temporary files
      fs.unlinkSync(file.path);
      fs.unlinkSync(processedPath);
    }

    res.status(200).json(urls);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
});

// const deleteImage = asyncHandler(async (req,res)=>{

//   const { id } = req.params;

//   try {

//     const result = await cloudinaryDeleteImg(id);

//     res.status(200).json(result);

//   } catch(error){

//     res.status(500).json({
//       message:error.message
//     });

//   }

// });

const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await cloudinaryDeleteImg(id);

  res.status(200).json({
    public_id: id,
  });
});

module.exports = { uploadImages, deleteImage };
