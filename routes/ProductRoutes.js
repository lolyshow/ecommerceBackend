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

const {
  isAdmin,
  authMiddleware,
} = require("../middlewares/authMiddleware");

const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImage");

const router = express.Router();

// Create product
router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  createProduct
);

// Wishlist
router.put("/wishlist", authMiddleware, addToWishlist);

// Rating
router.put("/rating", authMiddleware, rating);

// Get all products / filtered products
router.get("/", getAllProduct);

// Get single product
router.get("/:id", getaProduct);

// Update product
router.put("/:id", authMiddleware, isAdmin, updateProduct);

// Delete product
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = router;