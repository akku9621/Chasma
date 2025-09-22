'use client';

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API } from "../../../../services/api";

interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");

  // Fetch categories from API
  const fetchCategories = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API.CATEGORIES.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update category
  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !token) return;

    try {
      const payload = {
        name: newCategory,
        slug: newCategory.toLowerCase().replace(/\s+/g, "-"),
        description: "",
      };

      if (editingCategory) {
        // Update
        const res = await fetch(API.CATEGORIES.UPDATE(editingCategory.id.toString()), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setCategories(categories.map(c => c.id === updated.id ? updated : c));
        setEditingCategory(null);
      } else {
        // Create
        const res = await fetch(API.CATEGORIES.CREATE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setCategories([...categories, created]);
      }

      setNewCategory("");
    } catch (err) {
      console.error("Failed to save category:", err);
    }
  };

  // Delete category
  const deleteCategory = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(API.CATEGORIES.DELETE(id.toString()), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      } else {
        const data = await res.json();
        console.error("Failed to delete category:", data);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const editCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategory(cat.name);
  };

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📂 Manage Categories</h2>

      <form onSubmit={saveCategory} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          {editingCategory ? "Update" : "Add"}
        </button>
        {editingCategory && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setEditingCategory(null);
              setNewCategory("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-muted">No categories found.</p>
      ) : (
        <ul className="list-group">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {cat.name}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => editCategory(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteCategory(cat.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
