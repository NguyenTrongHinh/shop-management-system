// src/components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import UserAPI from "../api/UserAPI";
import { Users, Edit, Trash2, Plus, Search } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserAPI.getAll();
      setUsers(response);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Cập nhật user (không gửi password nếu không thay đổi)
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await UserAPI.update(editingUser._id, updateData);
        alert("Cập nhật người dùng thành công");
      } else {
        // Tạo user mới
        await UserAPI.create(formData);
        alert("Tạo người dùng thành công");
      }
      resetForm();
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message || "Lỗi khi lưu người dùng");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    
    try {
      await UserAPI.delete(userId);
      alert("Xóa người dùng thành công");
      loadUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Lỗi khi xóa người dùng");
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      isAdmin: false,
    });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">Đang tải người dùng...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Users className="mr-2" size={24} />
          Quản lý Người dùng
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form thêm/sửa user */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingUser ? "Chỉnh sửa Người dùng" : "Thêm Người dùng Mới"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu {editingUser && "(để trống nếu không đổi)"}
              </label>
              <input
                type="password"
                required={!editingUser}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={formData.isAdmin}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isAdmin" className="text-sm text-gray-700">
                Quyền quản trị viên
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus size={16} className="mr-1" />
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách users */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Danh sách Người dùng ({filteredUsers.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{user.username}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.isAdmin 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {user.isAdmin ? "Quản trị viên" : "Người dùng"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setFormData({
                        username: user.username,
                        email: user.email,
                        password: "",
                        isAdmin: user.isAdmin,
                      });
                    }}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;