// src/pages/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { 
    cartItems, 
    loading, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice,
    getTotalItems 
  } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow mb-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft size={20} className="mr-2" />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng của bạn</h1>
          <span className="text-gray-600">
            {getTotalItems()} sản phẩm
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Danh sách sản phẩm */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item) => {
                  const product = item.productId;
                      if (!product) return null;

                  const salePrice = product.price * (1 - (product.discount || 0) / 100);
  
                      return (
       <div key={item._id || product._id} className="flex items-center gap-4 p-6 border-b last:border-b-0">
         <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
         />
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.brand}</p>
        <p className="text-green-600 font-bold">
          {salePrice.toLocaleString("vi-VN")}đ
          {product.discount > 0 && (
            <span className="text-gray-400 line-through text-sm ml-2">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
          <button
            onClick={() => updateQuantity(product._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(product._id, item.quantity + 1)}
            disabled={item.quantity >= (product.countInStock || 0)}
            className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          onClick={() => removeFromCart(product._id)}
          className="p-2 text-red-500 hover:bg-red-50 rounded"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="text-right min-w-20">
        <p className="font-bold text-lg">
          {(salePrice * item.quantity).toLocaleString("vi-VN")}đ
        </p>
      </div>
    </div>
  );
})}
            </div>
          </div>

          {/* Thanh toán */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Tổng cộng</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Tổng tiền:</span>
                  <span className="text-green-600">{getTotalPrice().toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center"
              >
                <ShoppingBag size={20} className="mr-2" />
                Tiến hành thanh toán
              </Link>

              <Link
                to="/products"
                className="w-full text-center mt-3 text-blue-600 hover:text-blue-800 transition"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}