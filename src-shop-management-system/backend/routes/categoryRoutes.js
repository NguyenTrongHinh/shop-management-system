// routes/categoryRoutes.js
import express from "express";
import auth, { isAdmin } from "../middlewares/auth.js";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", auth, isAdmin, createCategory);
router.put("/:id", auth, isAdmin, updateCategory);
router.delete("/:id", auth, isAdmin, deleteCategory);

export default router;