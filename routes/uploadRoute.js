const express = require("express");
const router = express.Router();
const { uploadImages } = require("../controllers/uploadController");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");

router.post("/", uploadPhoto.array("images", 10), uploadImages);

module.exports = router;
