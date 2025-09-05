import axiosClient from "./axiosClient";

const OrderAPI = {
  createOrder: (data) => axiosClient.post("/orders", data),
  getMyOrders: () => axiosClient.get("/orders/myorders"),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),
};

export default OrderAPI;