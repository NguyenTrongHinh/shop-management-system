import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Truck, Shield, Headphones } from "lucide-react";
import CategoryAPI from "../api/CategoryAPI";
import ProductAPI from "../api/ProductAPI";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState({
    categories: true,
    featured: true,
    new: true
  });

  useEffect(() => {
    loadCategories();
    loadFeaturedProducts();
    loadNewProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await CategoryAPI.getAll();
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const loadFeaturedProducts = async () => {
    try {
      const response = await ProductAPI.getFeaturedProducts();
      setFeaturedProducts(response.products || []);
    } catch (error) {
      console.error("Error loading featured products:", error);
    } finally {
      setLoading(prev => ({ ...prev, featured: false }));
    }
  };

  const loadNewProducts = async () => {
    try {
      const response = await ProductAPI.getProducts({ 
        sort: "createdAt:desc", 
        limit: 8 
      });
      setNewProducts(response.products || []);
    } catch (error) {
      console.error("Error loading new products:", error);
    } finally {
      setLoading(prev => ({ ...prev, new: false }));
    }
  };

  const handleAddToCart = (product) => {
    console.log("Added to cart:", product.name);
    // Có thể thêm toast notification ở đây
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Chào mừng đến với <span className="text-yellow-300">E-Shop</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Khám phá thế giới công nghệ với những sản phẩm chất lượng, 
            giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-4 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-500 transition transform hover:scale-105"
          >
            <ShoppingBag className="mr-2" size={20} />
            Mua sắm ngay
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Giao hàng miễn phí</h3>
              <p className="text-gray-600">Cho đơn hàng từ 500.000đ</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bảo hành chính hãng</h3>
              <p className="text-gray-600">12 tháng cho tất cả sản phẩm</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="text-purple-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ CSKH nhiệt tình</p>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục nổi bật */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Danh mục nổi bật
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá đa dạng các danh mục sản phẩm công nghệ với chất lượng hàng đầu
          </p>
        </div>

        {loading.categories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category, i) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-105 p-6 text-center cursor-pointer group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-purple-200 transition">
                  <ShoppingBag className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {category.description || "Khám phá ngay"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được yêu thích và đánh giá cao nhất
            </p>
          </div>

          {loading.featured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdded={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">😢</div>
              <p className="text-gray-600">Chưa có sản phẩm nổi bật</p>
            </div>
          )}
        </div>
      </section>

      {/* Sản phẩm mới */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Sản phẩm mới nhất
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cập nhật những sản phẩm mới nhất với công nghệ tiên tiến
          </p>
        </div>

        {loading.new ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAdded={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-gray-600">Chưa có sản phẩm mới</p>
          </div>
        )}

        {newProducts.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Xem tất cả sản phẩm
              <ShoppingBag className="ml-2" size={20} />
            </Link>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Đăng ký nhận thông báo
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và sự kiện độc quyền
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-yellow-400"
            />
            <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition">
              Đăng ký
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}