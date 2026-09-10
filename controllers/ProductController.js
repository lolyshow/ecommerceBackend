const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createProduct = asyncHandler(async (req, res) => {
  const { title } = req.body;
  try {
    // Create product
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    throw new Error(error.message || "Product creation failed");
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const routeParam = req.params;
  validateMongoDbId(routeParam);
  try {
    const updateProduct = await Product.findOneAndUpdate(
      { _id: routeParam?.id },
      req.body,
      {
        new: true,
      },
    );

    if (!updateProduct) {
      console.log("No matching document found.");
    } else {
      console.log("Document updated successfully:", updateProduct);
    }

    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const routeParam = req.params;
  validateMongoDbId(routeParam);
  try {
    const deleteProduct = await Product.findOneAndDelete(routeParam.id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const findProduct = await Product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = "-createdAt",
      category,
      search,
      minPrice,
      maxPrice,
    } = req.query;

    const queryObj = {};

    if (category) {
      queryObj.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    if (search) {
      queryObj.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (minPrice || maxPrice) {
      queryObj.price = {};

      if (minPrice) {
        queryObj.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        queryObj.price.$lte = Number(maxPrice);
      }
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(queryObj)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .select("-__v");

    const totalProducts = await Product.countDocuments(queryObj);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});


const getProductsByCategory = asyncHandler(async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category: {
        $regex: `^${category}$`,
        $options: "i",
      },
    })
      .sort("-createdAt")
      .select("-__v");

    res.status(200).json({
      success: true,
      category,
      count: products.length,
      products,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyadded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        {
          new: true,
        },
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        },
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString(),
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        },
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        },
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true },
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
  getProductsByCategory
};
