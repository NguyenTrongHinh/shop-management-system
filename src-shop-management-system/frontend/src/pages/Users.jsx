// src/pages/Users.jsx
import React, { useState, useEffect } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);

  // Dữ liệu người dùng tĩnh ban đầu (có thể thay bằng API call sau)
  useEffect(() => {
    const initialUsers = [
      { _id: "1", username: "hinhnguyen931", email: "hinhnguyen931@gmail.com", role: "admin" },
      { _id: "2", username: "user1", email: "user1@example.com", role: "user" },
      { _id: "3", username: "user2", email: "user2@example.com", role: "user" },
    ];
    setUsers(initialUsers);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">👥 Quản lý người dùng</h1>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Tên đăng nhập</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Vai trò</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {user.role === "admin" ? "Quản trị viên" : "Người dùng thường"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}