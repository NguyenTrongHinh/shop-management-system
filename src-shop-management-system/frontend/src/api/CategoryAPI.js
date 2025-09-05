// src/api/CategoryAPI.js
import axiosClient from "./axiosClient";

const CategoryAPI = {
  getAll: () => axiosClient.get("/categories"),
  create: (data) => axiosClient.post("/categories", data),
  update: (id, data) => axiosClient.put(`/categories/${id}`, data),
  delete: (id) => axiosClient.delete(`/categories/${id}`),
};

export default CategoryAPI;