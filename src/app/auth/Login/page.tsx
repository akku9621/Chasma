"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // ✅ For storing token
import { API } from "../../../services/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Login API
      const res = await fetch(API.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        setError(data.message || "❌ Login failed");
        setLoading(false);
        return;
      }

      // ✅ Save token
      if (data.access_token) {
        Cookies.set("token", data.access_token, { expires: 1 }); // 1 day
        Cookies.set("isAdmin", "true", { expires: 1 });
      } else {
        setError("❌ No token received");
        setLoading(false);
        return;
      }

      // ✅ Call auth/me to verify user
      try {
        const meRes = await fetch(`${API.AUTH.ME}?token=${data.access_token}`);
        const meData = await meRes.json();
        console.log("Me API response:", meData);

        if (meRes.ok) {
          Cookies.set("username", meData.username, { expires: 1 });
          Cookies.set("email", meData.email, { expires: 1 });
          Cookies.set("role", meData.role, { expires: 1 });
        } else {
          setError("❌ Authentication failed");
          Cookies.remove("token");
          Cookies.remove("isAdmin");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Me API error:", err);
        setError("❌ Could not verify user");
        setLoading(false);
        return;
      }

      // ✅ Redirect after login success
      router.push("/auth/admin"); // Make sure this page exists
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Something went wrong");
    } finally {
      setLoading(false);
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
            <label className="form-label">Email / Username</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username"
              required
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading && (
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
