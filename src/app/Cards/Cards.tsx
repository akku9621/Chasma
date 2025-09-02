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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API.PRODUCTS.GET_ALL}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
                            src={p.image_path}
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
                        src={activeProduct.image_path}
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
          frameSrc={activeProduct.image_path || ""}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </>
  );
};

export default Cards;
