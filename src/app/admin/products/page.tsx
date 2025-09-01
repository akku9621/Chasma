'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API } from "@/services/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  category_id: number;
  category_name: string;
  image_path: string;
  image_folder: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10); // items per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // filters
  const [categoryId, setCategoryId] = useState<string>("");
  const [productSize, setProductSize] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const token = Cookies.get("token");

  const fetchProducts = async () => {
    if (!token) {
      alert("❌ You are not logged in.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(size),
      });

      if (categoryId) params.append("category_id", categoryId);
      if (productSize) params.append("product_size", productSize);
      if (search) params.append("search", search);

      const res = await fetch(`${API.PRODUCTS.GET_ALL}?${params.toString()}&token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Error fetching products:", data);
        return;
      }

      setProducts(data.items || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, size, categoryId, productSize, search]);

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📦 Products</h2>

      {/* 🔍 Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={productSize}
            onChange={(e) => setProductSize(e.target.value)}
          >
            <option value="">All Sizes</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra_large">Extra Large</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Category ID"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* 📋 Table */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Price</th>
                <th>Size</th>
                <th>Category</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.image_path ? (
                      <img
                        src={`${p.image_folder}/${p.image_path}`}
                        alt={p.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        className="rounded"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.size}</td>
                  <td>{p.category_name || p.category_id}</td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔄 Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-outline-secondary"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
