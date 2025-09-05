import Cart from "../models/Cart.js";
import mongoose from "mongoose";
import Product from "../models/Product.js"; // Thêm để check product tồn tại

// Thêm sản phẩm vào giỏ (thêm check product tồn tại)
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "ID sản phẩm không hợp lệ" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {  // Fix: Check quantity là integer >0
      return res.status(400).json({ success: false, message: "Số lượng phải là số nguyên lớn hơn 0" });
    }

    // Check product tồn tại trước khi add
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      console.log(`Tạo mới cart cho user ${userId}`); // Logging để debug
    }

    const existingItem = cart.items.find(i => i.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();
    console.log(`Cart saved cho user ${userId}: ${cart.items.length} items`); // Logging

    cart = await cart.populate("items.productId"); // Populate sau save
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(`Add to cart error for user ${req.user._id}:`, error); // Logging error
    res.status(500).json({ success: false, message: "Lỗi khi thêm sản phẩm", error: error.message });
  }
};

// Lấy giỏ hàng (consistent response)
export const getCartContents = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [], userId: req.user._id } }); // Fix: Trả cart empty consistent
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(`Get cart error for user ${req.user._id}:`, error);
    res.status(500).json({ success: false, message: "Lỗi khi lấy giỏ hàng", error: error.message });
  }
};

// Xóa sản phẩm (thêm check item tồn tại)
export const removeItemFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });

    const itemIndex = cart.items.findIndex(i => i.productId.toString() === id);
    if (itemIndex === -1) return res.status(404).json({ success: false, message: "Sản phẩm không có trong giỏ" });

    cart.items.splice(itemIndex, 1); // Fix: Sử dụng splice để remove
    await cart.save();
    console.log(`Removed item ${id} from cart of user ${req.user._id}`);

    const populatedCart = await cart.populate("items.productId");
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(`Remove from cart error for user ${req.user._id}:`, error);
    res.status(500).json({ success: false, message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};

// Cập nhật số lượng (handle quantity=0 như remove)
export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params; // productId
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 0) { // Fix: Allow 0 để remove
      return res.status(400).json({ success: false, message: "Số lượng phải là số nguyên >= 0" });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Giỏ hàng không tồn tại" });

    const item = cart.items.find(i => i.productId.toString() === id);
    if (!item) return res.status(404).json({ success: false, message: "Sản phẩm không có trong giỏ" });

    if (quantity === 0) {
      cart.items = cart.items.filter(i => i.productId.toString() !== id);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    console.log(`Updated quantity for item ${id} in cart of user ${req.user._id} to ${quantity}`);

    const populatedCart = await cart.populate("items.productId");
    res.status(200).json({ success: true, cart: populatedCart });
  } catch (error) {
    console.error(`Update quantity error for user ${req.user._id}:`, error);
    res.status(500).json({ success: false, message: "Lỗi cập nhật số lượng", error: error.message });
  }
};