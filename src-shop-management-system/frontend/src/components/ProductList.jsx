import React from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ 
  products = [], 
  loading = false, 
  error = "", 
  onAdded,
  className = "" 
}) {
  // loading skeleton
  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">
        {error}
      </div>
    );
  }

  if (!products || !products.length) {
    return (
      <div className="text-center py-12 text-white/60">
        <div className="text-4xl mb-2">😢</div>
        <p>Không tìm thấy sản phẩm nào.</p>
        <p className="text-sm mt-1">Hãy thử điều chỉnh bộ lọc của bạn.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {products.map((product, index) => (
        <ProductCard 
          key={product?._id || product?.id || index} 
          product={product} 
          onAdded={onAdded} 
        />
      ))}
    </div>
  );
}