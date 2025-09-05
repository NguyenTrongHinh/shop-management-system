// src/api/UserAPI.js
import axiosClient from "./axiosClient";

const UserAPI = {
  // Lấy thông tin user hiện tại
  getProfile: () => axiosClient.get("/users/me"),
  
  // Cập nhật thông tin user
  updateProfile: (data) => axiosClient.put("/users/me", data),
  
  // ADMIN: Lấy tất cả users
  getAll: () => axiosClient.get("/users"),
  
  // ADMIN: Lấy user by ID
  getById: (id) => axiosClient.get(`/users/${id}`),
  
  // ADMIN: Cập nhật user
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  
  // ADMIN: Xóa user
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default UserAPI;