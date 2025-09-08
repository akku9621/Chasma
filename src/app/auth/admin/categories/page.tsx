'use client';

import React, { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");

  // Load categories from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const newCat = { id: Date.now(), name: newCategory };
    setCategories([...categories, newCat]);
    setNewCategory("");
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📂 Manage Categories</h2>

      {/* Add Category Form */}
      <form onSubmit={addCategory} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      {/* Category List */}
      {categories.length === 0 ? (
        <p className="text-muted">No categories added yet.</p>
      ) : (
        <ul className="list-group">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {cat.name}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteCategory(cat.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
