'use client';

import React, { useEffect, useState, useRef } from "react"; // 👈 added useRef
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
  const [photoURL, setPhotoURL] = useState<string | null>(null); // 👈 for preview
  const [images, setImages] = useState<File[]>([]); // 👈 new multi-images state
  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // 👈 new previews array
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null); // 👈 ref for single file input
  const multiFileInputRef = useRef<HTMLInputElement>(null); // 👈 ref for multi file input

  // ✅ Load categories from API instead of hardcoding
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await fetch(API.CATEGORIES.GET_ALL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoURL(URL.createObjectURL(file)); // 👈 set preview URL
    }
  };

  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setImages(fileArray);

      // 👈 create previews
      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewArray);
    }
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
      formData.append("image", photo); // <- minimal change: was 'photo', now 'image'

      // 👈 append multiple images
      images.forEach((img) => formData.append("images", img));

      const res = await fetch(API.PRODUCTS.CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type manually
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
        setImages([]);
        if (photoURL) URL.revokeObjectURL(photoURL); // 👈 revoke object URL
        setPhotoURL(null); // 👈 clear preview
        imagePreviews.forEach((url) => URL.revokeObjectURL(url)); // 👈 revoke multiple image previews
        setImagePreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = ""; // 👈 reset single file input
        if (multiFileInputRef.current) multiFileInputRef.current.value = ""; // 👈 reset multi file input
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
          <label className="form-label">Description *</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Single Photo */}
        <div className="col-12">
          <label className="form-label">Try On Photo *</label>
          <input
            ref={fileInputRef} // 👈 attach ref here
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {photoURL && (
            <img
              src={photoURL}
              alt="Preview"
              className="img-fluid mt-2 rounded"
              style={{ maxHeight: "200px" }}
            />
          )}
        </div>

        {/* Multiple Images */}
        <div className="col-12">
          <label className="form-label">Image Gallery *</label>
          <input
            ref={multiFileInputRef} // 👈 attach ref here
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleMultipleImagesUpload}
            required
          />
          <div className="d-flex flex-wrap mt-2">
            {imagePreviews.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx}`}
                className="me-2 mb-2 rounded"
                style={{ maxHeight: "100px" }}
              />
            ))}
          </div>
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
