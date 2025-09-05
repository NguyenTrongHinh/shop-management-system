// src/api/UserAPI.js
import axiosClient from "./axiosClient";

const UserAPI = {
  getProfile: () => axiosClient.get("/users/me"),
  
  updateProfile: (data) => axiosClient.put("/users/me", data),
  
  getAll: () => axiosClient.get("/users"),
  
  getById: (id) => axiosClient.get(`/users/${id}`),
  
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default UserAPI;