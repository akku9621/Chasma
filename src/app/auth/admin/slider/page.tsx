'use client';

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { API } from "../../../../services/api"; // ✅ Make sure API.CAROUSELS paths exist

interface Carousel {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_path: string | null;
  image_folder: string | null;
  created_at: string;
  updated_at: string | null;
  is_active: boolean;
}

export default function CarouselPage() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({});
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);

  const token = Cookies.get("token");

  const fetchCarousels = async () => {
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

      const res = await fetch(`${API.CAROUSELS.GET_ALL}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data: any;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        alert("❌ Failed to fetch carousels: server returned unexpected response.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        console.error("Error fetching carousels:", data);
        return;
      }

      // ✅ Handle both plain array and paginated response
      if (Array.isArray(data)) {
        setCarousels(data);
        setTotalPages(1);
      } else {
        setCarousels(data.items || []);
        setTotalPages(data.pages || 1);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarousels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const handleFormChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const createCarousel = async () => {
    if (!token) return;

    try {
      const fd = new FormData();
      fd.append("name", formData.name || "");
      if (formData.description) fd.append("description", formData.description);
      if (formData.image instanceof File) fd.append("image", formData.image);

      const res = await fetch(API.CAROUSELS.CREATE, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      let result: any;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        alert("❌ Failed to create carousel: server returned unexpected response.");
        return;
      }

      if (!res.ok) {
        console.error("Create failed:", result);
        alert("❌ Failed to create carousel.");
      } else {
        alert("✅ Carousel created successfully.");
        setFormData({}); // ✅ reset all form data
        // ✅ reset file input manually
        const fileInput = document.querySelector<HTMLInputElement>(
          'input[type="file"]'
        );
        if (fileInput) fileInput.value = "";
        fetchCarousels();
      }
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const updateCarousel = async () => {
    if (!token || !editingCarousel) return;

    try {
      let payload = {
        name: formData.name || editingCarousel.name,
        slug: editingCarousel.slug,
        description: formData.description || editingCarousel.description,
        image_path: editingCarousel.image_path,
        image_folder: editingCarousel.image_folder || "",
      };

      // ✅ Only upload new image if selected
      if (formData.image instanceof File) {
        const fd = new FormData();
        fd.append("file", formData.image);

        const uploadRes = await fetch(API.CAROUSELS.UPLOAD_IMAGE, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        let uploadData: any;
        const contentType = uploadRes.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          uploadData = await uploadRes.json();
        } else {
          const text = await uploadRes.text();
          console.error("Expected JSON but got:", text);
          alert("❌ Failed to upload new image: server returned unexpected response.");
          return;
        }

        if (!uploadRes.ok) {
          console.error("Image upload failed:", uploadData);
          alert("❌ Failed to upload new image");
          return;
        }

        payload.image_path = uploadData.image_path;
        payload.image_folder = uploadData.image_folder;
      }

      // ✅ Send JSON for update
      const res = await fetch(API.CAROUSELS.UPDATE(String(editingCarousel.id)), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let result: any;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        alert("❌ Failed to update carousel: server returned unexpected response.");
        return;
      }

      if (!res.ok) {
        console.error("Update failed:", result);
        alert("❌ Failed to update carousel.");
      } else {
        alert("✅ Carousel updated successfully.");
        setEditingCarousel(null);
        setFormData({});
        fetchCarousels();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const deleteCarousel = async (id: number) => {
    if (!token) return;

    if (!confirm("Are you sure you want to delete this carousel?")) return;

    try {
      const res = await fetch(API.CAROUSELS.DELETE(String(id)), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ handle both 204 and 200 success
      if (res.status === 204 || res.status === 200) {
        alert("✅ Carousel deleted successfully.");
        fetchCarousels();
      } else {
        let data = null;
        try {
          const contentType = res.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            data = await res.json();
          } else {
            const text = await res.text();
            console.error("Delete returned unexpected response:", text);
          }
        } catch {
          // no body
        }
        console.error("Delete failed:", data);
        alert("❌ Failed to delete carousel.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Separate video and text descriptions
  const videoCarousels = carousels.filter(
    (c) => c.description && c.description.trim().startsWith("<iframe")
  );
  const textCarousels = carousels.filter(
    (c) => !c.description || !c.description.trim().startsWith("<iframe")
  );

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">🎞️ Carousels</h2>

      {/* Upload Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Carousel</h5>
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={formData.name || ""}
            onChange={(e) => handleFormChange("name", e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Description (text or iframe HTML)"
            value={formData.description || ""}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
          <input
            type="file"
            className="form-control mb-2"
            onChange={(e) =>
              handleFormChange("image", e.target.files ? e.target.files[0] : null)
            }
          />
          <button className="btn btn-success" onClick={createCarousel}>
            Upload Carousel
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🖼️ Text Description Table */}
          <h4 className="mt-4">📝 Text Carousels</h4>
          {textCarousels.length === 0 ? (
            <p className="text-muted">No text carousels found.</p>
          ) : (
            <div className="table-responsive mb-5">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th> {/* ✅ Added */}
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {textCarousels.map((c, index) => (
                    <tr key={c.id}>
                      <td>{(page - 1) * size + index + 1}</td> {/* ✅ Serial No */}
                      <td>{c.id}</td>
                      <td>
                        {c.image_path ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${c.image_path}`}
                            alt={c.name}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td>{c.name}</td>
                      <td>{c.description}</td>
                      <td>{c.slug}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            setEditingCarousel(c);
                            setFormData({
                              name: c.name,
                              description: c.description,
                              image: null, // ✅ reset file on edit start
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCarousel(c.id)}
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

          {/* 🎥 Video Description Table */}
          <h4 className="mt-4">🎥 Video Carousels</h4>
          {videoCarousels.length === 0 ? (
            <p className="text-muted">No video carousels found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th> {/* ✅ Added */}
                    <th>ID</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Video</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videoCarousels.map((c, index) => (
                    <tr key={c.id}>
                      <td>{(page - 1) * size + index + 1}</td> {/* ✅ Serial No */}
                      <td>{c.id}</td>
                      <td>
                        {c.image_path ? (
                          <img
                            src={`${c.image_folder}/${c.image_path}`}
                            alt={c.name}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                        ) : (
                          "No image"
                        )}
                      </td>
                      <td>{c.name}</td>
                      <td>
                        <div
                          style={{
                            width: "160px", // ✅ Small video
                            height: "90px",
                            overflow: "hidden",
                          }}
                          dangerouslySetInnerHTML={{ __html: c.description }}
                        />
                      </td>
                      <td>{c.slug}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => {
                            setEditingCarousel(c);
                            setFormData({
                              name: c.name,
                              description: c.description,
                              image: null, // ✅ reset file on edit start
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteCarousel(c.id)}
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
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

      {/* Edit Modal */}
      {editingCarousel && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Carousel</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingCarousel(null)}
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
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={(e) =>
                    handleFormChange("image", e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingCarousel(null)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={updateCarousel}>
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
