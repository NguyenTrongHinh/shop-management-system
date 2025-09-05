// src/api/ProductAPI.js
import axiosClient from "./axiosClient";

const productAPI = {
  // Lấy danh sách sản phẩm với phân trang và lọc 
  getProducts: (params = {}) => axiosClient.get("/products", { params }),
  
  // Lấy chi tiết sản phẩm 
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  
  // Lấy danh sách categories 
  getCategories: () => axiosClient.get("/products/categories"),
  
  // Lấy danh sách brands 
  getBrands: () => axiosClient.get("/products/brands"),
  
  // Lấy sản phẩm nổi bật 
  getFeaturedProducts: () => axiosClient.get("/products/featured"),
  // Lấy sản phẩm theo category
  getProductsByCategory: (category, params = {}) => 
    axiosClient.get("/products", { params: { ...params, category } }),
  // CRUD operations 
  createProduct: (data) => axiosClient.post("/products", data),
  updateProduct: (id, data) => axiosClient.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
  
  
  // Cập nhật đánh giá 
  updateProductRating: (id, rating) => axiosClient.post(`/products/${id}/rating`, { rating }),
};

export default productAPI;