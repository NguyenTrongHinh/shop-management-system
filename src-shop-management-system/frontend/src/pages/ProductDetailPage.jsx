import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import productAPI from "../api/ProductAPI";
import ProductDetail from "../components/ProductDetail";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        
        // ✅ Backend trả về: { success: true, product: {} }
        const response = await productAPI.getProductById(id);
        
        if (!ignore) {
          setProduct(response.product || response.data || null);
        }
      } catch (e) {
        console.error("Load product error:", e);
        if (!ignore) {
          setError(e?.message || "Không tải được thông tin sản phẩm");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadProduct();
    } else {
      setError("ID sản phẩm không hợp lệ");
      setLoading(false);
    }

    return () => (ignore = true);
  }, [id]);

  const handleAddedToCart = (product) => {
    console.log("Đã thêm vào giỏ từ detail page:", product.name);
    // Có thể show toast notification ở đây
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 flex items-center text-sm text-white/60">
        <Link to="/" className="hover:text-white">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-white">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="text-white">
          {loading ? "Đang tải..." : product?.name || "Chi tiết sản phẩm"}
        </span>
      </nav>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white">Chi tiết sản phẩm</h1>
        <Link 
          to="/products" 
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-white/5 animate-pulse rounded" />
            <div className="h-6 bg-white/5 animate-pulse rounded" />
            <div className="h-4 bg-white/5 animate-pulse rounded" />
            <div className="h-12 bg-white/5 animate-pulse rounded" />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 text-center">
          <div className="text-2xl mb-2">😢</div>
          <p className="font-medium">{error}</p>
          <Link 
            to="/products" 
            className="inline-block mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
          >
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      )}

      {/* Success state */}
      {!loading && !error && product && (
        <ProductDetail 
          product={product} 
          onAdded={handleAddedToCart} 
        />
      )}

      {/* Not found state */}
      {!loading && !error && !product && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-white/60 mb-6">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link 
            to="/products" 
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-white font-bold"
          >
            Khám phá sản phẩm khác
          </Link>
        </div>
      )}
    </div>
  );
}