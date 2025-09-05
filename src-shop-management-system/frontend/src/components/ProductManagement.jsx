import React, { useState, useEffect } from "react";
import productAPI from "../api/ProductAPI";
import ProductForm from "./ProductForm";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formData);
        alert("Cập nhật sản phẩm thành công");
      } else {
        await productAPI.createProduct(formData);
        alert("Thêm sản phẩm thành công");
      }
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Lỗi khi lưu sản phẩm");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await productAPI.deleteProduct(id);
      alert("Xóa sản phẩm thành công");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Lỗi khi xóa sản phẩm");
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
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setEditingProduct(null);
            }}
          />
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Danh sách sản phẩm ({products.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div key={product._id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3 flex-1">
                  {/* Hiển thị ảnh sản phẩm */}
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600">
                      {product.price.toLocaleString()}đ
                      {product.discount > 0 && (
                        <span className="text-red-500 ml-2">
                          -{product.discount}%
                        </span>
                      )
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.category} • {product.brand}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
            
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có sản phẩm nào</p>
                <p className="text-sm">Hãy thêm sản phẩm mới</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}