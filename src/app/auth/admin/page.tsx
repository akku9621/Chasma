"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function AdminPanel() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const hasCookie = getCookie("isAdmin") === "true";
    const hasLocalStorage =
      typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

    if (!hasCookie && !hasLocalStorage) {
      router.replace("/auth/Login");
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("isAdmin");
    } catch {}
    // Expire cookie immediately
    document.cookie = "isAdmin=; path=/; Max-Age=0; samesite=lax";
    router.replace("/auth/Login");
  };

  if (checking) {
    return (
      <div className="container py-5">
        <p className="lead">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold">👋 Welcome to the Admin Panel</h1>
      <p>Here you will manage products, offers, and users.</p>
      <button onClick={handleLogout} className="btn btn-danger mt-3">
        Logout
      </button>
    </div>
  );
}
