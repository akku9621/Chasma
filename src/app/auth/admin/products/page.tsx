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
  language?: string;
  is_active?: boolean;
  images?: { id: number; image_path: string }[]; // 👈 added images array
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [categoryId, setCategoryId] = useState<string>("");
  const [productSize, setProductSize] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<any>({});

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

      const res = await fetch(`${API.PRODUCTS.GET_ALL}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  const handleFormChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      size: product.size,
      language: product.language || "hindi",
      is_active: product.is_active ?? true,
    });
  };

  const updateProduct = async () => {
    if (!token || !editingProduct) return;

    try {
      const fd = new FormData();

      const fields = [
        "name",
        "description",
        "price",
        "category_id",
        "size",
        "language",
        "is_active",
      ] as const;

      fields.forEach((key) => {
        const curr = (formData as any)[key];
        const orig = (editingProduct as any)[key];

        if (key === "price" || key === "category_id") {
          const currNum = curr !== undefined && curr !== null ? Number(curr) : curr;
          const origNum = orig !== undefined && orig !== null ? Number(orig) : orig;
          if (currNum !== undefined && currNum !== origNum) {
            fd.append(key, String(currNum));
          }
        } else if (key === "is_active") {
          const currBool = Boolean(curr);
          const origBool = Boolean(orig);
          if (currBool !== origBool) {
            fd.append("is_active", String(currBool));
          }
        } else {
          if (curr !== undefined && curr !== orig) {
            fd.append(key, String(curr));
          }
        }
      });

      if (formData.image instanceof File) {
        fd.append("image", formData.image);
      }

      if ([...fd.keys()].length === 0) {
        alert("No changes to save.");
        return;
      }

      const res = await fetch(API.PRODUCTS.UPDATE(String(editingProduct.id)), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      const result = await res.json();
      if (!res.ok) {
        console.error("Update failed:", result);
        alert("❌ Failed to update product.");
      } else {
        alert("✅ Product updated successfully.");
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!token) return;

    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(API.PRODUCTS.DELETE(String(id)), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        alert("✅ Product deleted successfully.");
        fetchProducts();
      } else {
        const data = await res.json();
        console.error("Delete failed:", data);
        alert("❌ Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📦 Products</h2>

      {/* Filters */}
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

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-muted">No products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Photo</th>
                <th>Images</th>
                <th>Name</th>
                <th>Price</th>
                <th>Size</th>
                <th>Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p.id}>
                  <td>{(page - 1) * size + index + 1}</td>
                  <td>{p.id}</td>
                  <td>
                    {p.image_path ? (
                      <img
                        src={
                          p.image_path
                            ? process.env.NEXT_PUBLIC_BACKEND_URL +
                              "/api/uploads/" +
                              p.image_path
                            : "/pictures/image.png"
                        }
                        alt={p.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        className="rounded"
                      />
                    ) : (
                      "No image"
                    )}
                  </td>
                  <td>
                    {Array.isArray(p.images) && p.images.length > 0 ? (
                      <div className="d-flex flex-wrap">
                        {p.images.map((img) => (
                          <img
                            key={img.id}
                            src={process.env.NEXT_PUBLIC_BACKEND_URL + "/api/uploads/" + img.image_path}
                            alt={`img-${img.id}`}
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            className="me-1 mb-1 rounded"
                          />
                        ))}
                      </div>
                    ) : (
                      "No images"
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.size}</td>
                  <td>{p.category_name || p.category_id}</td>
                  <td>{p.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => openEditModal(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
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

      {/* Edit Modal */}
      {editingProduct && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => handleFormChange("price", Number(e.target.value))}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Category ID"
                  value={formData.category_id}
                  onChange={(e) =>
                    handleFormChange("category_id", Number(e.target.value))
                  }
                />
                <select
                  className="form-select mb-2"
                  value={formData.size}
                  onChange={(e) => handleFormChange("size", e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra_large">Extra Large</option>
                </select>
                <select
                  className="form-select mb-2"
                  value={formData.language}
                  onChange={(e) => handleFormChange("language", e.target.value)}
                >
                  <option value="hindi">Hindi</option>
                  <option value="english">English</option>
                </select>
                <select
                  className="form-select mb-2"
                  value={formData.is_active ? "true" : "false"}
                  onChange={(e) =>
                    handleFormChange("is_active", e.target.value === "true")
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={updateProduct}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
