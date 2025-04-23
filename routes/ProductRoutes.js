const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controllers/ProductController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");

const router = express.Router();

// router.post("/", authMiddleware, isAdmin, createProduct);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 5),  // <-- max 5 images, adjust as needed
  productImgResize,                // <-- if you want to resize before upload
  createProduct
);

router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  // uploadImages
);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

module.exports = router;