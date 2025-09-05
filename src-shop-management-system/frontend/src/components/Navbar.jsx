import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart(); // Thêm dòng này để lấy số lượng sản phẩm
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && window.location.pathname !== "/admin") {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  if (isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const item = "px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition";

  const CartLink = (
    <NavLink
      to="/cart"
      className="relative px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
    >
      Giỏ hàng
      {getTotalItems() > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {getTotalItems()}
        </span>
      )}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl tracking-tight">
          E-Shop<span className="text-green-600">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={item}>Trang chủ</NavLink>
          <NavLink to="/products" className={item}>Sản phẩm</NavLink>

          {user ? (
            <div className="flex items-center gap-2">
              <NavLink to="/profile" className={item}>
                👤 Tài khoản
              </NavLink>
              {CartLink}
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition">
                Đăng nhập
              </NavLink>
              <NavLink to="/register" className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:opacity-90 transition">
                Đăng ký
              </NavLink>
              {CartLink}
            </div>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex items-center p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-2">
            <NavLink to="/" onClick={() => setOpen(false)} className={item}>Trang chủ</NavLink>
            <NavLink to="/products" onClick={() => setOpen(false)} className={item}>Sản phẩm</NavLink>

            {user ? (
              <>
                <NavLink to="/user/profile" onClick={() => setOpen(false)} className={item}>Tài khoản</NavLink>
                <NavLink
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="relative px-3 py-2 rounded-lg bg-green-500 text-white text-left"
                >
                  Giỏ hàng
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-gray-200 text-gray-700 text-left"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white text-left"
                >
                  Đăng nhập
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white text-left"
                >
                  Đăng ký
                </NavLink>
                <NavLink
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="relative px-3 py-2 rounded-lg bg-green-500 text-white text-left"
                >
                  Giỏ hàng
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
