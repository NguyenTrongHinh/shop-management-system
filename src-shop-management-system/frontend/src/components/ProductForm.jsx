// src/components/ProductForm.jsx
import React, { useState } from "react";
import { Upload, X, Image } from "lucide-react";

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    description: product?.description || "",
    category: product?.category || "",
    brand: product?.brand || "",
    countInStock: product?.countInStock || "",
    discount: product?.discount || ""
  });
  const [images, setImages] = useState(product?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newImages.length > 5) {
      alert("Chỉ được upload tối đa 5 ảnh");
      return;
    }
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Thêm các field vào formData
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Thêm ảnh mới
      newImages.forEach(image => {
        formDataToSend.append('images', image);
      });

      // Thêm ảnh còn lại (nếu có)
      images.forEach(image => {
        formDataToSend.append('existingImages', image);
      });

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Các field cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giá</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
      </div>

      {/* Upload ảnh */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
        
        {/* Hiển thị ảnh hiện có */}
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Product ${index}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hiển thị ảnh mới */}
        {newImages.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {newImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New ${index}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        <label className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
          <Upload size={16} className="mr-2" />
          Thêm ảnh
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
        <p className="text-sm text-gray-500 mt-1">Tối đa 5 ảnh, định dạng JPG, PNG</p>
      </div>

      {/* Các field khác */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Chọn danh mục</option>
            <option value="Điện thoại">Điện thoại</option>
            <option value="Laptop">Laptop</option>
            <option value="Tablet">Tablet</option>
            <option value="Đồng hồ">Đồng hồ</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
          <input
            type="number"
            name="countInStock"
            value={formData.countInStock}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            min="0"
            max="100"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="4"
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : (product ? "Cập nhật" : "Thêm sản phẩm")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default ProductForm;