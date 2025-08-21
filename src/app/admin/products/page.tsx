'use client';

import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
  photo: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const normalizeIds = (items: Product[]) => {
    return items.map((item, index) => ({ ...item, id: index + 1 })); // ✅ IDs from 1
  };

  const loadProducts = () => {
    const saved = localStorage.getItem("products");
    if (saved) {
      const parsed: Product[] = JSON.parse(saved);
      const normalized = normalizeIds(parsed);
      setProducts(normalized);
      localStorage.setItem("products", JSON.stringify(normalized)); // keep synced
    } else {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();

    // Listen for localStorage changes
    const handleStorage = () => loadProducts();
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const deleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      const normalized = normalizeIds(updated);
      setProducts(normalized);
      localStorage.setItem("products", JSON.stringify(normalized));
    }
  };

  const handleEditChange = (field: keyof Product, value: string | number) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const saveEdit = () => {
    if (!editingProduct) return;
    const updated = products.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    const normalized = normalizeIds(updated);
    setProducts(normalized);
    localStorage.setItem("products", JSON.stringify(normalized));
    setEditingProduct(null);
  };

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📦 Manage Products</h2>

      {products.length === 0 ? (
        <p className="text-muted">No products uploaded yet.</p>
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
                <th style={{ width: "150px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.photo ? (
                      <img
                        src={p.photo}
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
                  <td>{p.size || "-"}</td>
                  <td>{p.category}</td>
                  <td>{p.description || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => setEditingProduct(p)}
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

      {/* ✅ Edit Modal */}
      {editingProduct && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
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
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingProduct.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={editingProduct.price}
                      onChange={(e) =>
                        handleEditChange("price", parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Size</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingProduct.size}
                      onChange={(e) => handleEditChange("size", e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingProduct.category}
                      onChange={(e) =>
                        handleEditChange("category", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={editingProduct.description}
                      onChange={(e) =>
                        handleEditChange("description", e.target.value)
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={saveEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
