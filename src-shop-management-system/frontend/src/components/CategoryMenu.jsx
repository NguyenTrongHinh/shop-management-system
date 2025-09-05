// src/components/CategoryMenu.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import CategoryAPI from "../api/CategoryAPI";

const CategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await CategoryAPI.getAll();
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lấy category từ URL
  const getCurrentCategory = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  };

  if (loading) {
    return (
      <div className="flex gap-4 flex-wrap">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full animate-pulse w-24"></div>
        ))}
      </div>
    );
  }

  const currentCategory = getCurrentCategory();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <ChevronDown size={20} className="mr-2" />
          Danh mục sản phẩm
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Tất cả sản phẩm */}
          <Link
            to="/products"
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !currentCategory
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </Link>

          {/* Các danh mục */}
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentCategory === category.name
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryMenu;