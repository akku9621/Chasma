'use client';

import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  category: string;
  photo: string; // base64 string for now
}

export default function UploadProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [photo, setPhoto] = useState("");

  // Load categories + products from localStorage
  useEffect(() => {
    const savedCats = localStorage.getItem("categories");
    if (savedCats) setCategories(JSON.parse(savedCats));

    const savedProducts = localStorage.getItem("products");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category) {
      alert("⚠️ Please fill required fields.");
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name,
      description,
      price: parseFloat(price),
      size,
      category,
      photo,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    // Reset form
    setName("");
    setDescription("");
    setPrice("");
    setSize("");
    setCategory("");
    setPhoto("");
    alert("✅ Product uploaded successfully!");
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
          <label className="form-label">Size</label>
          <input
            type="text"
            className="form-control"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
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
              <option key={c.id} value={c.name}>
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

        {/* Photo Upload */}
        <div className="col-12">
          <label className="form-label">Photo</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {photo && (
            <img
              src={photo}
              alt="Preview"
              className="img-fluid mt-2 rounded"
              style={{ maxHeight: "200px" }}
            />
          )}
        </div>

        {/* Submit */}
        <div className="col-12">
          <button type="submit" className="btn btn-success">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
