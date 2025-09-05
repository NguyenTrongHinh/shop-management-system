// src/components/ProductFilter.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import productAPI from "../api/ProductAPI";

export default function ProductFilter({ onChange, currentCategory }) {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    category: currentCategory || "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    sort: "createdAt:desc"
  });

  // Load categories và brands
  useEffect(() => {
    loadFilterData();
  }, []);

  // Đồng bộ filters từ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = { ...filters };
    
    // Cập nhật filters từ URL
    if (params.get("category")) newFilters.category = params.get("category");
    if (params.get("brand")) newFilters.brand = params.get("brand");
    if (params.get("minPrice")) newFilters.minPrice = params.get("minPrice");
    if (params.get("maxPrice")) newFilters.maxPrice = params.get("maxPrice");
    if (params.get("sort")) newFilters.sort = params.get("sort");
    
    setFilters(newFilters);
  }, [location.search]);

  const loadFilterData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getBrands()
      ]);
      setCategories(categoriesData.categories || []);
      setBrands(brandsData.brands || []);
    } catch (error) {
      console.error("Error loading filter data:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Nếu đổi category, xóa các filter khác để tránh conflict
    if (key === "category") {
      const cleanFilters = { category: value };
      onChange(cleanFilters);
    } else {
      onChange(newFilters);
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sort: "createdAt:desc"
    };
    setFilters(resetFilters);
    onChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4 sticky top-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Bộ lọc</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Xóa hết
        </button>
      </div>

      {/* Category filter - Ẩn nếu đã chọn category từ menu */}
      {!currentCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {/* Brand filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả thương hiệu</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-full p-2 border rounded-lg text-sm"
          />
          <input
            type="number"
            placeholder="Đến"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-full p-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
        <select
          value={filters.minRating}
          onChange={(e) => handleFilterChange("minRating", e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả đánh giá</option>
          <option value="4">⭐ 4+ sao</option>
          <option value="3">⭐ 3+ sao</option>
          <option value="2">⭐ 2+ sao</option>
          <option value="1">⭐ 1+ sao</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp</label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="createdAt:desc">Mới nhất</option>
          <option value="price:asc">Giá tăng dần</option>
          <option value="price:desc">Giá giảm dần</option>
          <option value="name:asc">Tên A-Z</option>
          <option value="name:desc">Tên Z-A</option>
          <option value="rating:desc">Đánh giá cao nhất</option>
        </select>
      </div>
    </div>
  );
}