// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import ProductFilter from "../components/ProductFilter";
import CategoryMenu from "../components/CategoryMenu";
import productAPI from "../api/ProductAPI";
import { Filter, X } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, [location.search]); // Reload khi search params thay đổi

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Lấy params từ URL
      const params = new URLSearchParams(location.search);
      const category = params.get("category");
      const search = params.get("search");
      const brand = params.get("brand");
      const minPrice = params.get("minPrice");
      const maxPrice = params.get("maxPrice");
      const sort = params.get("sort");
      
      // Tạo object filters từ URL params
      const filters = {};
      if (category) filters.category = category;
      if (search) filters.search = search;
      if (brand) filters.brand = brand;
      if (minPrice) filters.minPrice = minPrice;
      if (maxPrice) filters.maxPrice = maxPrice;
      if (sort) filters.sort = sort;

      setAppliedFilters(filters);

      console.log("Loading products with filters:", filters);
      
      const response = await productAPI.getProducts(filters);
      setProducts(response.products || []);
      setTotalProducts(response.pagination?.totalProducts || response.products?.length || 0);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Kết hợp filter mới với các filter hiện có từ URL
    const params = new URLSearchParams(location.search);
    
    // Cập nhật params với newFilters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Chuyển filters thành query string
    const queryString = params.toString();
    navigate(`?${queryString}`, { replace: true });
  };

  const clearAllFilters = () => {
    navigate("/products", { replace: true });
  };

  const getCurrentCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  };

  const hasActiveFilters = () => {
    const params = new URLSearchParams(location.search);
    return params.toString() !== "";
  };

  const currentCategory = getCurrentCategory();

  return (
    <div>
      {/* Category Menu */}
      <CategoryMenu />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header với thông tin lọc */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {currentCategory 
                ? `Sản phẩm ${currentCategory}`
                : "Tất cả sản phẩm"
              }
            </h1>
            <p className="text-gray-600">
              {totalProducts} sản phẩm được tìm thấy
            </p>
          </div>

          {hasActiveFilters() && (
            <button
              onClick={clearAllFilters}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-4 lg:mt-0"
            >
              <X size={16} className="mr-2" />
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>

        {/* Hiển thị filters đang active */}
        {hasActiveFilters() && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Filter size={16} className="text-blue-600 mr-2" />
              <span className="text-blue-600 font-medium">Bộ lọc đang áp dụng:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(appliedFilters).map(([key, value]) => (
                value && (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {key}: {value}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar với filter */}
          <div className="lg:col-span-1">
            <ProductFilter 
              onChange={handleFilterChange}
              currentCategory={currentCategory}
            />
          </div>
          
          {/* Product list */}
          <div className="lg:col-span-3">
            <ProductList 
              products={products}
              loading={loading}
              error={error}
            />
            
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Không tìm thấy sản phẩm nào
                </h3>
                <p className="text-gray-600 mb-4">
                  {hasActiveFilters() 
                    ? "Hãy thử điều chỉnh bộ lọc của bạn"
                    : "Hiện chưa có sản phẩm nào trong danh mục này"
                  }
                </p>
                {hasActiveFilters() && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}