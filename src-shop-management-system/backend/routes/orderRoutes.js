import express from "express";
import auth from "../middlewares/auth.js";
import { addItemToCart, getCartContents, removeItemFromCart, updateQuantity } from "../controllers/cartController.js";
import { cartItemValidation, updateQuantityValidation, handleValidationErrors } from "../middlewares/validation.js"; 

const router = express.Router();

router.get("/", auth, getCartContents);
router.post("/", auth, cartItemValidation, handleValidationErrors, addItemToCart); 
router.put("/:id", auth, updateQuantityValidation, handleValidationErrors, updateQuantity);
router.delete("/:id", auth, removeItemFromCart);

export default router;