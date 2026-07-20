const express = require("express");
const router = express.Router();
const { uploadImages,deleteImage } = require("../controllers/uploadController");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");

router.post("/", uploadPhoto.array("images", 10), uploadImages);
router.delete("/delete-img/:id", deleteImage);

module.exports = router;
