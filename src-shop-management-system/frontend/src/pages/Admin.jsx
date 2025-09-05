// src/pages/Admin.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosClient"; // dùng axiosClient (tên file của bạn)

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products"); // axiosClient unwraps .data
      setProducts(res); // nếu backend trả array trực tiếp
      // Nếu backend trả { data: products }, điều chỉnh accordingly
    } catch (err) {
      console.error(err);
    }
  };

  // ... phần còn lại giữ nguyên
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post("/products", form);
      }
      setForm({ name: "", price: "", description: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi CRUD sản phẩm");
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Không thể xóa sản phẩm!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">⚙️ Quản trị sản phẩm</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input type="text" name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} className="border px-3 py-2 rounded" required />
        <input type="number" name="price" placeholder="Giá" value={form.price} onChange={handleChange} className="border px-3 py-2 rounded" required />
        <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} className="border px-3 py-2 rounded" />
        <button type="submit" className="bg-green-600 text-white py-2 rounded">
          {editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p._id} className="text-center">
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price}₫</td>
              <td className="border p-2">{p.description}</td>
              <td className="border p-2 flex gap-2 justify-center">
                <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded">Sửa</button>
                <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
