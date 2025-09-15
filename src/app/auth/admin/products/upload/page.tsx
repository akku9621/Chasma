'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API } from "@/services/api";

interface Category {
  id: number;
  name: string;
}

export default function UploadProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Example: load categories from API if available
    setCategories([
      { id: 1, name: "Men" },
      { id: 2, name: "Women" },
      { id: 3, name: "Children" },
      { id: 4, name: "Offer" },
    ]);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category || !photo) {
      alert("⚠️ Please fill all required fields (including photo).");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      alert("❌ You are not logged in.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", name.toLowerCase().replace(/\s+/g, "-"));
      formData.append("description", description);
      formData.append("price", String(Number(price)));
      formData.append("category_id", String(Number(category)));
      formData.append("size", size);
      formData.append("language", "english");
      formData.append("photo", photo);

      // ✅ Token in header, not query param
      const res = await fetch(API.PRODUCTS.CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Upload failed:", data);
        alert(`❌ Failed: ${data.message || "Validation error"}`);
      } else {
        alert("✅ Product uploaded successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setSize("");
        setCategory("");
        setPhoto(null);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">⬆️ Upload Product</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {/* Product Name */}
        <div className="col-md-6">
          <label className="form-label">Product Name *</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Price */}
        <div className="col-md-6">
          <label className="form-label">Price (₹) *</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Size */}
        <div className="col-md-6">
          <label className="form-label">Size *</label>
          <select
            className="form-select"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
          >
            <option value="">-- Select Size --</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra_large">Extra Large</option>
          </select>
        </div>

        {/* Category */}
        <div className="col-md-6">
          <label className="form-label">Category *</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Photo */}
        <div className="col-12">
          <label className="form-label">Photo *</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {photo && (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="img-fluid mt-2 rounded"
              style={{ maxHeight: "200px" }}
            />
          )}
        </div>

        {/* Submit */}
        <div className="col-12">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Uploading..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
