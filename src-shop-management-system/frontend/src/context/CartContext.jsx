// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import CartAPI from "../api/CartAPI";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CartAPI.getCart();
      console.log("Cart API Response:", res);

      // SỬA LẠI PHẦN NÀY - CHỈ XỬ LÝ res.cart.items
      if (res.success && res.cart) {
        const items = Array.isArray(res.cart.items) 
          ? res.cart.items.filter(item => item.productId && item.productId._id) 
          : [];
        setCartItems(items);
        console.log("Filtered cart items:", items);
      } else {
        setCartItems([]);
        setError(res.message || "Không thể tải giỏ hàng");
      }
    } catch (error) {
      console.error("Load cart error:", error);
      setCartItems([]);
      setError(error.message || "Lỗi khi tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await CartAPI.addToCart(productId, quantity);
      await loadCart(); // Reload cart after adding
      setError(null);
      return res;
    } catch (error) {
      console.error("Add to cart error:", error);
      setError(error.message || "Lỗi khi thêm sản phẩm vào giỏ");
      throw error;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await CartAPI.updateQuantity(productId, quantity);
      await loadCart(); // Reload cart after updating
      setError(null);
      return res;
    } catch (error) {
      console.error("Update quantity error:", error);
      setError(error.message || "Lỗi khi cập nhật số lượng");
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await CartAPI.removeFromCart(productId);
      await loadCart(); // Reload cart after removing
      setError(null);
      return res;
    } catch (error) {
      console.error("Remove from cart error:", error);
      setError(error.message || "Lỗi khi xóa sản phẩm");
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      // Nếu có API clear cart
      await CartAPI.clearCart();
      setCartItems([]);
      setError(null);
    } catch (error) {
      console.error("Clear cart error:", error);
      setError(error.message || "Lỗi khi xóa giỏ hàng");
      throw error;
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const product = item.productId; // Backend trả về productId đã được populate
      if (!product) return total;
      
      const price = product.price || 0;
      const discount = product.discount || 0;
      const salePrice = price * (1 - discount / 100);
      
      return total + (salePrice * item.quantity);
    }, 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotalItems,
      getTotalPrice,
      reloadCart: loadCart
    }}>
      {children}
    </CartContext.Provider>
  );
};