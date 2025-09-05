// src/components/CategoryManagement.jsx
import React, { useState, useEffect } from "react";
import CategoryAPI from "../api/CategoryAPI";
import { Folder, Edit, Trash2, Plus, Search } from "lucide-react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryAPI.getAll();
      setCategories(response.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Lỗi khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await CategoryAPI.update(editingCategory._id, formData);
        alert("Cập nhật danh mục thành công");
      } else {
        await CategoryAPI.create(formData);
        alert("Tạo danh mục thành công");
      }
      resetForm();
      loadCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.message || "Lỗi khi lưu danh mục");
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    
    try {
      await CategoryAPI.delete(categoryId);
      alert("Xóa danh mục thành công");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Lỗi khi xóa danh mục");
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: ""
    });
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Đang tải danh mục...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Folder className="mr-2" size={24} />
          Quản lý Danh mục
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form thêm/sửa category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Điện thoại, Laptop..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Mô tả về danh mục..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={16} className="mr-1" />
                {editingCategory ? "Cập nhật" : "Thêm mới"}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Danh sách Danh mục ({filteredCategories.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCategories.map((category) => (
              <div key={category._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      Tạo bởi: {category.createdBy?.username || "Admin"}
                    </span>
                    <span className="text-xs text-gray-500">
                      • {new Date(category.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setFormData({
                        name: category.name,
                        description: category.description || ""
                      });
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;