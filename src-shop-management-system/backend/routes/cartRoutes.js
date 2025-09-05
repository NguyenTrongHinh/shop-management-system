import express from "express";
import auth from "../middlewares/auth.js";
import { addItemToCart, getCartContents, removeItemFromCart, updateQuantity } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", auth, getCartContents);
router.post("/", auth, addItemToCart);
router.put("/:id", auth, updateQuantity);
router.delete("/:id", auth, removeItemFromCart);

export default router;
