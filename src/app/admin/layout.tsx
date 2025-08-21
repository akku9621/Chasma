'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li><Link href="/admin" onClick={() => setSidebarOpen(false)}>🏠 Dashboard</Link></li>
          <li><Link href="/admin/categories" onClick={() => setSidebarOpen(false)}>📂 Categories</Link></li>
          <li><Link href="/admin/products" onClick={() => setSidebarOpen(false)}>📦 Products</Link></li>
          <li><Link href="/admin/products/upload" onClick={() => setSidebarOpen(false)}>⬆️ Upload Product</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="admin-header">
          {/* Mobile Hamburger */}
          <button
            className="btn btn-sm btn-outline-primary d-md-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          <span className="fw-bold">👋 Hello, Admin</span>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </header>
        <main className="p-4">{children}</main>
        <footer className="admin-footer">
          © {new Date().getFullYear()} Jyoti Netra Seva
        </footer>
      </div>
    </div>
  );
}
