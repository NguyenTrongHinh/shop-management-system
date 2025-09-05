import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users'; 
import RedirectToAdmin from './components/RedirectToAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from "./pages/ProfilePage";
import CheckoutPage from "./pages/CheckoutPage";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/admin/*" element={<AdminLayout />} />
              <Route path="*" element={<MainLayout />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

// Layout cho Admin (KHÔNG có navbar thông thường)
const AdminLayout = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} /> {/* Trang mặc định khi vào /admin */}
      <Route
        path="users"
        element={
          <ProtectedRoute requiredRole="admin">
            <Users />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Layout cho User (CÓ navbar thông thường)
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={  <ProtectedRoute> <CartPage /> </ProtectedRoute>} />
          <Route path="/checkout" element={  <ProtectedRoute> <CheckoutPage /> </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/redirect-admin" element={<RedirectToAdmin />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/profile" element={  <ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
};

export default App;