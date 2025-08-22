"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo credentials: adjust to your backend auth as needed
    if (email === "admin@gmail.com" && password === "admin123") {
      // ✅ Persist auth for BOTH your guards
      // Cookie (consumed by middleware)
      document.cookie = `isAdmin=true; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
      // localStorage (consumed by /admin page client check)
      try {
        localStorage.setItem("isAdmin", "true");
      } catch {}

      // Go to admin
      router.push("/admin");
    } else {
      setError("❌ Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="login-card shadow p-4" style={{ maxWidth: 400, width: "100%" }}>
        <h2 className="mb-4 text-center">Admin Login</h2>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
