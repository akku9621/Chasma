'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./Cards.css";
import VirtualTryOn from "./VirtualTryOn";
import { API } from "@/services/api";

interface Product {
  id: number;
  name: string;
  price: number;
  size: string;
  description: string;
  image_path: string | null;
  image_folder: string | null;
  category_id?: number;
  category_name?: string;
}

interface ApiResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const categories = [
  { id: 1, name: "Men" },
  { id: 2, name: "Women" },
  { id: 3, name: "Children" },
];

const Cards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showTryOn, setShowTryOn] = useState(false);

  // 🔹 Pagination + filters
  const [page, setPage] = useState(1);
  const [size] = useState(12); // how many per page
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [productSize, setProductSize] = useState<string | null>(null);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (search) params.append("search", search);
        if (categoryId) params.append("category_id", String(categoryId));
        if (productSize) params.append("product_size", productSize);

        const res = await fetch(`${API.PRODUCTS.GET_ALL}?${params.toString()}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ApiResponse = await res.json();
        setProducts(Array.isArray(data.items) ? data.items : []);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, search, categoryId, productSize, size]);

  const openProduct = (p: Product) => setActiveProduct(p);

  // Group products by category -> then by size
  const groupedProducts = categories.map(cat => {
    const productsInCategory = products.filter(p => p.category_id === cat.id);
    const groupedBySize: Record<string, Product[]> = productsInCategory.reduce((acc, product) => {
      if (!acc[product.size]) acc[product.size] = [];
      acc[product.size].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
    return { category: cat, groupedBySize };
  });

  if (loading) return <div>Loading products...</div>;
  if (!products.length) return <div>No products available.</div>;

  return (
    <>
      {/* 🔍 Filters */}
      <div className="filters mb-4 d-flex gap-2">
        {/* <input
          type="text"
          placeholder="Search..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
        <select
          className="form-select"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className="form-select"
          value={productSize ?? ""}
          onChange={(e) => setProductSize(e.target.value || null)}
        >
          <option value="">All Sizes</option>
          <option value="S">Small</option>
          <option value="M">Medium</option>
          <option value="L">Large</option>
        </select>
      </div>

      {/* Products grouped by category + size */}
      {groupedProducts.map(({ category, groupedBySize }) => (
        <div key={category.id} id={`category-${category.id}`} className="category-section mb-4">
          <h4 className="mb-3">{category.name}</h4>

          {Object.entries(groupedBySize).length === 0 && <div>No products in this category.</div>}

          {Object.entries(groupedBySize).map(([size, items]) => (
            <div key={size} className="size-section mb-3">
              <h6 className="text-secondary mb-2">Size: {size}</h6>
              <div className="row g-3">
                {items.map((p) => (
                  <div key={p.id} className="col-6 col-lg-3">
                    <div className="card product-card h-100 p-2">
                      <div style={{ position: 'relative', width: '100%', height: 160, cursor: 'pointer' }}>
                        {p.image_path ? (
                          <Image
                            src={`${p.image_folder || ""}/${p.image_path}`}
                            alt={p.name}
                            fill
                            style={{ objectFit: 'contain' }}
                            data-bs-toggle="modal"
                            data-bs-target="#cardModal"
                            onClick={() => openProduct(p)}
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="card-body text-center">
                        <h6 className="fw-bold mb-1">{p.name}</h6>
                        <div className="price">₹{p.price}</div>
                        <p className="small text-muted">{p.description}</p>
                        <button
                          className="btn btn-sm whatsapp-btn btn btn-success"
                          data-bs-toggle="modal"
                          data-bs-target="#cardModal"
                          onClick={() => openProduct(p)}
                        >
                          <i className="fab fa-whatsapp"></i> View / Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>Prev</button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Product Modal */}
      <div className="modal fade" id="cardModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">{activeProduct ? activeProduct.name : "Product"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setActiveProduct(null)}></button>
            </div>
            <div className="modal-body text-center">
              {activeProduct && (
                <>
                  <div style={{ position: 'relative', width: '100%', height: 320 }}>
                    {activeProduct.image_path ? (
                      <Image
                        src={`${activeProduct.image_folder || ""}/${activeProduct.image_path}`}
                        alt={activeProduct.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}
                  </div>
                  <div><strong>Price:</strong> ₹{activeProduct.price}</div>
                  <div><strong>Size:</strong> {activeProduct.size}</div>
                  <p>{activeProduct.description}</p>

                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      data-bs-dismiss="modal"
                      onClick={() => setTimeout(() => setShowTryOn(true), 250)}
                    >
                      👓 Try Now
                    </button>

                    <a
                      href={`https://wa.me/919889716600?text=${encodeURIComponent("Hi, I'm interested in " + activeProduct.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-success"
                    >
                      <i className="fab fa-whatsapp"></i> Order on WhatsApp
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Try-On */}
      {showTryOn && activeProduct && (
        <VirtualTryOn
          frameSrc={`${activeProduct.image_folder || ""}/${activeProduct.image_path}`}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </>
  );
};

export default Cards;
