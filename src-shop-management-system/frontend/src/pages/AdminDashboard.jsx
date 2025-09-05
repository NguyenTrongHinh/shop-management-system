// AdminDashboard.jsx - Cập nhật
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  Box, Users, ShoppingCart, Package, 
  BarChart3, Settings, LogOut, Home 
} from "lucide-react";
import UserManagement from "../components/UserManagement";
import ProductManagement from "../components/ProductManagement";
import CategoryManagement from "../components/CategoryManagement";

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Các card thống kê giữ nguyên */}
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Chào mừng đến trang quản trị</h3>
              {/* Nội dung dashboard */}
            </div>
          </div>
        );
      case "products":
        return <ProductManagement />;
      case "users":
        return <UserManagement />;
      case "orders":
        return <div className="p-6">Quản lý Đơn hàng - Đang phát triển</div>;
      case "categories":
        return <CategoryManagement />;
      case "settings":
        return <div className="p-6">Cài Đặt - Đang phát triển</div>;
      default:
        return <div className="p-6">Dashboard</div>;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {isRedirecting ? "Bạn không có quyền truy cập. Đang chuyển hướng..." : "Vui lòng đăng nhập với tài khoản admin"}
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Sản Phẩm", icon: Package },
    { id: "users", label: "Người Dùng", icon: Users },
    { id: "orders", label: "Đơn Hàng", icon: ShoppingCart },
    { id: "categories", label: "Danh Mục", icon: Box },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-sm text-gray-600">Xin chào, {user?.username}</p>
          <p className="text-xs text-green-600 font-medium">Quyền: Administrator</p>
        </div>
        
        <nav className="p-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg mb-1 transition ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition mb-2"
          >
            <Home size={20} className="mr-3" />
            Về trang chủ
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={20} className="mr-3" />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border-b p-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {menuItems.find(item => item.id === activeTab)?.label || "Admin Dashboard"}
          </h2>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}