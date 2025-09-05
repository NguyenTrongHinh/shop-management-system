// src/pages/CheckoutPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/products"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/orders"
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}