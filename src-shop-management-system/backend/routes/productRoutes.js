import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getFeaturedProducts,
  updateProductRating
} from "../controllers/productController.js";
import auth, { isAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

// Protected routes - Cần đăng nhập
router.post("/:id/rating", auth, updateProductRating);

// Admin routes - Chỉ admin
router.post("/", auth, isAdmin, createProduct);
router.put("/:id", auth, isAdmin, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

export default router;