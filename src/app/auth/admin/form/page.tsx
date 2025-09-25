'use client';

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { API } from "../../../../services/api";

// ✅ For Excel & PDF export
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
// ⬇️ FIXED import
import autoTable from "jspdf-autotable";

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

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // ✅ Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(forms);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FormData");
    XLSX.writeFile(wb, "form_submissions.xlsx");
  };

  // ✅ Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Form Submissions", 14, 10);

    // ⬇️ FIXED call
    autoTable(doc, {
      head: [["#", "Name", "Email", "Phone", "Subject", "Message", "Status", "Created At"]],
      body: forms.map((form, index) => [
        index + 1,
        form.name || "-",
        form.email || "-",
        form.phone || "-",
        form.subject || "-",
        form.message || "-",
        form.status || "-",
        new Date(form.created_at || "").toLocaleString() || "-",
      ]),
    });

    doc.save("form_submissions.pdf");
  };

  // ✅ Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentForms = forms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(forms.length / itemsPerPage);

  if (!mounted) return null;

  return (
    <div className="container">
      <h2 className="fw-bold mb-4">📄 Form Submissions</h2>

      {/* ✅ Export buttons */}
      <div className="mb-3">
        <button className="btn btn-success me-2" onClick={exportToExcel}>
          Download Excel
        </button>
        <button className="btn btn-primary" onClick={exportToPDF}>
          Download PDF
        </button>
      </div>

      {loading ? (
        <p>Loading form submissions...</p>
      ) : forms.length === 0 ? (
        <p className="text-muted">No form submissions found.</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th> {/* ✅ Serial Number */}
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
              {currentForms.map((form, idx) => (
                <tr key={form.id}>
                  <td>{indexOfFirst + idx + 1}</td> {/* ✅ Serial number */}
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

          {/* ✅ Pagination controls */}
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
