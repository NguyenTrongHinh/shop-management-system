import React from "react";
import { Link } from "react-router-dom";

export default function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClose }) {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-96 max-w-sm">
          <div className="text-center">
            <div className="text-4xl mb-4">🛒</div>
            <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-4">Hãy thêm sản phẩm vào giỏ hàng!</p>
            <Link
              to="/products"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 max-w-sm max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Giỏ hàng</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

<div className="space-y-3">
  {cartItems.map((item) => {
    if (!item.product || !item.product._id) return null; // Bỏ qua item không hợp lệ
    return (
      <div key={item.product._id} className="flex items-center gap-3 p-2 border rounded-lg">
        <img
          src={item.product.images?.[0] || "/placeholder.jpg"}
          alt={item.product.name}
          className="w-12 h-12 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-medium text-sm">{item.product.name || "Tên sản phẩm không xác định"}</h3>
          <p className="text-emerald-600 font-bold">
            {(item.product.price || 0).toLocaleString("vi-VN")}đ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.product._id, item.quantity - 1)}
            className="w-6 h-6 rounded bg-gray-200"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.product._id, item.quantity + 1)}
            disabled={item.quantity >= (item.product.countInStock || 0)}
            className="w-6 h-6 rounded bg-gray-200 disabled:opacity-50"
          >
            +
          </button>
        </div>
        <button
          onClick={() => onRemoveItem(item.product._id)}
          className="text-red-500 hover:text-red-700"
        >
          🗑️
        </button>
      </div>
    );
  })}
</div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Tổng cộng:</span>
            <span className="text-emerald-600 font-bold text-xl">
              {calculateTotal().toLocaleString("vi-VN")}đ
            </span>
          </div>
          
          <Link
            to="/cart"
            onClick={onClose}
            className="block w-full bg-emerald-500 text-white text-center py-3 rounded-lg font-bold hover:bg-emerald-600"
          >
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
}