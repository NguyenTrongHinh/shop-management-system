// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserAPI from "../api/UserAPI";
import { User, Mail, Calendar, Save, Edit, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await UserAPI.getProfile();
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      setMessage({ type: "error", text: "Lỗi khi tải thông tin người dùng" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UserAPI.updateProfile(formData);
      setMessage({ type: "success", text: "Cập nhật thông tin thành công" });
      setEditing(false);
      // Reload user data
      await loadUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.response?.data?.message || "Lỗi khi cập nhật thông tin" });
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user.username,
      email: user.email,
    });
    setEditing(false);
    setMessage({ type: "", text: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Thông tin tài khoản
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Shield size={16} className={authUser.isAdmin ? "text-green-600" : "text-blue-600"} />
            <span className={authUser.isAdmin ? "text-green-600 font-medium" : "text-blue-600"}>
              {authUser.isAdmin ? "Quản trị viên" : "Người dùng"}
            </span>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === "success" 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên người dùng
              </label>
              {editing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User size={20} className="text-gray-400 mr-3" />
                  <span className="text-gray-800">{user.username}</span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-400 mr-3" />
                  <span className="text-gray-800">{user.email}</span>
                </div>
              )}
            </div>

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày tham gia
              </label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar size={20} className="text-gray-400 mr-3" />
                <span className="text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID người dùng
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {user._id}
                </code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {editing ? (
                <>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Save size={18} className="mr-2" />
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit size={18} className="mr-2" />
                  Chỉnh sửa thông tin
                </button>
              )}
              
              <button
                type="button"
                onClick={logout}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ml-auto"
              >
                Đăng xuất
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thông tin bổ sung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Shield size={16} className="text-green-600 mr-2" />
              <span>Trạng thái: </span>
              <span className="ml-2 font-medium text-green-600">Đang hoạt động</span>
            </div>
            <div className="flex items-center">
              <Mail size={16} className="text-blue-600 mr-2" />
              <span>Xác thực email: </span>
              <span className="ml-2 font-medium text-green-600">Đã xác thực</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}