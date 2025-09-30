"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // ✅ For cookies
import { API } from "../../../services/api"; // ✅ Import API constants
import "./admin.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState<string | null>(null);

  // ✅ Client-side year to avoid hydration mismatch
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const isAdmin = Cookies.get("isAdmin");
    const token = Cookies.get("token");

    // ❌ If missing cookies, redirect
    if (!isAdmin || !token) {
      router.replace("/auth/Login");
      return;
    }

    // ✅ Validate token with backend
    const verifyUser = async () => {
      try {
        const res = await fetch(`${API.AUTH.ME}?token=${token}`);
        if (!res.ok) {
          throw new Error("Invalid token");
        }

        const data = await res.json();

        if (!data || !data.username) {
          throw new Error("Auth failed");
        }

        // ✅ Save user info in cookies for reuse
        Cookies.set("username", data.username, { expires: 1 });
        Cookies.set("email", data.email || "", { expires: 1 });
        Cookies.set("role", data.role || "admin", { expires: 1 });

        setUsername(data.username);
        setChecking(false);
      } catch (err) {
        // ❌ Invalid token → clear cookies
        Cookies.remove("isAdmin");
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("email");
        Cookies.remove("role");
        router.replace("/auth/Login");
      }
    };

    verifyUser();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("isAdmin");
    Cookies.remove("token");
    Cookies.remove("username");
    Cookies.remove("email");
    Cookies.remove("role");
    router.push("/auth/Login");
  };

  if (checking) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        {/* Mobile Close Button */}
        <button
          className="btn btn-sm btn-outline-danger d-md-none position-absolute top-0 end-0 m-2"
          onClick={() => setSidebarOpen(false)}
        >
          ✖
        </button>

        <h2 className="sidebar-title">Admin Panel</h2>
        <ul className="sidebar-menu">
          <li>
            <Link href="/auth/admin" onClick={() => setSidebarOpen(false)}>
              🏠 Dashboard
            </Link>
          </li>
          <li>
            <Link href="/auth/admin/categories" onClick={() => setSidebarOpen(false)}>
              📂 Categories
            </Link>
          </li>
          <li>
            <Link href="/auth/admin/products" onClick={() => setSidebarOpen(false)}>
              📦 Products
            </Link>
          </li>
          <li>
            <Link href="/auth/admin/products/upload" onClick={() => setSidebarOpen(false)}>
              ⬆️ Upload Product
            </Link>
          </li>
          <li>
            <Link href="/auth/admin/slider" onClick={() => setSidebarOpen(false)}>
              🎞️ Carousels
            </Link>
          </li>
          <li>
            <Link href="/auth/admin/form" onClick={() => setSidebarOpen(false)}>
              📄 Form/Query
            </Link>
          </li>
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

          {/* ✅ Use actual username */}
          <span className="fw-bold">👋 Hello, {username || "Admin"}</span>

          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="p-4">{children}</main>

        <footer className="admin-footer">
          © {year || ""} JYOTI NETRA SEVA & JYOTI CHASHMA SAGAR
        </footer>
      </div>
    </div>
  );
}
