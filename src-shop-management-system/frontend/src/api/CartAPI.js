// src/api/CartAPI.js
import axiosClient from "./axiosClient";

const CartAPI = {
  getCart: () => axiosClient.get("/cart"),
  addToCart: (productId, quantity) => axiosClient.post("/cart", { productId, quantity }),
  updateQuantity: (productId, quantity) => axiosClient.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => axiosClient.delete(`/cart/${productId}`),
  clearCart: () => axiosClient.delete("/cart/clear"),
};

export default CartAPI;