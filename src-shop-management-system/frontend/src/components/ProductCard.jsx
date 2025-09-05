import React from "react";
import { Link } from "react-router-dom";
import CartAPI from "../api/CartAPI";

export default function ProductCard({ product, onAdded }) {
  if (!product) return <article className="rounded-2xl bg-white/5 animate-pulse h-64" />;

  const id = product._id ?? product.id ?? "";
  const salePrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAdd = async () => {
    if (!id) return alert("ID sản phẩm không hợp lệ");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập! Không thể thêm vào giỏ.");
      console.warn("No token found in localStorage!");
      return;
    }

    console.log("Adding to cart:", { productId: id, quantity: 1, token });

    try {
      await CartAPI.addToCart(id, 1);
      console.log("Added successfully:", product.name);
      onAdded?.(product);
    } catch (e) {
      console.error("Add to cart error:", e);
      alert(e?.message || "Không thể thêm vào giỏ.");
    }
  };

  return (
    <article className="bg-slate-900/60 border border-white/6 rounded-2xl shadow transition overflow-hidden hover:shadow-lg">
      <Link to={id ? `/products/${id}` : "#"} className="block">
        <div className="aspect-[4/3] bg-gradient-to-br from-emerald-500/12 to-blue-500/6 grid place-items-center relative">
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
          {product.images && product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-extrabold text-white/80">
              {String(product.name || "").split(" ").map(w => w[0] ?? "").join("").slice(0,3).toUpperCase()}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-white">{product.name}</h3>
          {typeof product.countInStock === "number" && (
            <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/70">
              Tồn: {product.countInStock}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60">
          {product.brand && <span>{product.brand}</span>}
          {product.category && (
            <>
              <span>•</span>
              <span>{product.category}</span>
            </>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-emerald-400 font-extrabold">{salePrice.toLocaleString("vi-VN")}đ</span>
          {product.discount > 0 && (
            <span className="text-gray-400 line-through text-sm">{product.price.toLocaleString("vi-VN")}đ</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            disabled={product.countInStock === 0}
            className={`px-3 py-2 rounded-xl font-bold flex-1 ${
              product.countInStock === 0
                ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-600 text-slate-900"
            }`}
          >
            {product.countInStock === 0 ? "Hết hàng" : "Thêm giỏ"}
          </button>
          <Link
            to={id ? `/products/${id}` : "#"}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"
          >
            Xem
          </Link>
        </div>
      </div>
    </article>
  );
}
