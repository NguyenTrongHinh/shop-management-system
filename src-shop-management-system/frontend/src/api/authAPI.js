import axiosClient from "./axiosClient";

const authAPI = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  getProfile: () => axiosClient.get("/users/me"),
  logout: () => axiosClient.post("/auth/logout"),
};

export default authAPI;