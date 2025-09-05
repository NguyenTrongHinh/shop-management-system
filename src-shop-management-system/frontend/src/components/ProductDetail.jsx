import { useState } from "react";
import CartAPI from "../api/CartAPI";

export default function ProductDetail({ product, onAdded }) {
  const [quantity, setQuantity] = useState(1);
  if (!product) return null;

  const salePrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAdd = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập! Không thể thêm vào giỏ.");
      console.warn("No token found in localStorage!");
      return;
    }

    console.log("Adding to cart (detail):", { productId: product._id, quantity, token });

    try {
      await CartAPI.addToCart(product._id, quantity);
      console.log("Added to cart:", product.name);
      onAdded?.(product);
      setQuantity(1);
    } catch (e) {
      console.error("Add to cart error (detail):", e);
      alert(e?.message || "Không thể thêm vào giỏ.");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.countInStock) setQuantity(newQuantity);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Image */}
      <div className="space-y-4">
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-500/15 to-blue-500/10 aspect-square grid place-items-center">
          {product.images && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl font-extrabold text-white/80">
              {product.name?.split(" ").map(w => w[0]).join("").slice(0,3)}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white mb-2">{product.name}</h1>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">Số lượng:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.countInStock}
                className="w-8 h-8 rounded-full bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="text-white/60 text-sm">{product.countInStock} sản phẩm có sẵn</span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.countInStock === 0}
            className={`px-6 py-3 rounded-2xl font-bold w-full ${
              product.countInStock === 0
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-slate-900"
            }`}
          >
            {product.countInStock === 0 ? "Hết hàng" : `Thêm vào giỏ - ${(salePrice * quantity).toLocaleString("vi-VN")}đ`}
          </button>
        </div>
      </div>
    </div>
  );
}
