'use client';

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API } from "../../../../services/api";

interface FormDataItem {
  id: number;
  name?: string;
  email?: string | null;
  phone?: string | null;
  message?: string;
  subject?: string;
  status?: string;
  created_at?: string;
}

export default function FormDataPage() {
  const [mounted, setMounted] = useState(false);
  const [forms, setForms] = useState<FormDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const token = mounted ? Cookies.get("token") : null;

  useEffect(() => setMounted(true), []);

  // Fetch form submissions
  const fetchForms = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(API.FORM.GET_ALL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.error("Failed to fetch form data:", res.statusText);
        setForms([]);
        return;
      }

      const data = await res.json();

      // Extract items array safely
      if (data?.items && Array.isArray(data.items)) {
        setForms(data.items);
      } else {
        console.warn("Unexpected API response:", data);
        setForms([]);
      }
    } catch (err) {
      console.error("Error fetching form data:", err);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) fetchForms();
  }, [mounted, token]);

  // Delete a form
  const deleteForm = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`${API.FORM.CREATE}/${id}`, { // Adjust API if DELETE endpoint differs
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setForms(forms.filter(f => f.id !== id));
      } else {
        const data = await res.json();
        console.error("Failed to delete form:", data);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📄 Form Submissions</h2>

      {loading ? (
        <p>Loading form submissions...</p>
      ) : forms.length === 0 ? (
        <p className="text-muted">No form submissions found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id}>
                <td>{form.name || "-"}</td>
                <td>{form.email || "-"}</td>
                <td>{form.phone || "-"}</td>
                <td>{form.subject || "-"}</td>
                <td>{form.message || "-"}</td>
                <td>{form.status || "-"}</td>
                <td>{new Date(form.created_at || "").toLocaleString() || "-"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteForm(form.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
