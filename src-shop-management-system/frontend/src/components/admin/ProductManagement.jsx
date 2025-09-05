import React, { useState, useEffect } from "react";
import productAPI from "../../api/ProductAPI";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    brand: "",
    countInStock: "",
    discount: ""
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formData);
      } else {
        await productAPI.createProduct(formData);
      }
      setFormData({ name: "", price: "", description: "", category: "", brand: "", countInStock: "", discount: "" });
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productAPI.deleteProduct(id);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Giá"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Danh mục"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Thương hiệu"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Số lượng"
                value={formData.countInStock}
                onChange={(e) => setFormData({...formData, countInStock: e.target.value})}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Giảm giá (%)"
                value={formData.discount}
                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                className="w-full p-2 border rounded"
                max={100}
                min={0}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              {editingProduct ? "Cập nhật" : "Thêm sản phẩm"}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({ name: "", price: "", description: "", category: "", brand: "", countInStock: "", discount: "" });
                }}
                className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Hủy
              </button>
            )}
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Danh sách sản phẩm ({products.length})</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.price.toLocaleString()}đ</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setFormData({
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        category: product.category,
                        brand: product.brand,
                        countInStock: product.countInStock,
                        discount: product.discount
                      });
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}