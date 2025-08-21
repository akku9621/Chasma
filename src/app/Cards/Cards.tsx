'use client';

import React, { useMemo, useState } from "react";
import "./Cards.css";
import VirtualTryOn from "./VirtualTryOn"; // same folder

interface Product {
  id: number;
  images: string[]; // product images (first one used as preview; images[0] also used as frame)
  price: number;
  size: string;
  description: string;
  model: string;
}

interface CardsProps {
  category: string;
}

const generateProducts = (category: string): Product[] => {
  // sample product data: you likely already save products in localStorage; this is fallback/demo
  const sampleSets = [
    [
      "https://static.vecteezy.com/system/resources/thumbnails/046/158/728/small/black-eyeglasses-frame-png.png",
      "https://images.pexels.com/photos/7357975/pexels-photo-7357975.jpeg",
    ],
    [
      "https://static.vecteezy.com/system/resources/thumbnails/048/220/008/small/black-rimmed-sunglasses-free-png.png",
      "https://images.pexels.com/photos/18279387/pexels-photo-18279387.jpeg",
    ],
    [
      "https://static.vecteezy.com/system/resources/thumbnails/027/928/340/small_2x/black-and-red-round-glasses-png.png",
      "https://images.pexels.com/photos/947885/pexels-photo-947885.jpeg",
    ],
    [
      "https://static.vecteezy.com/system/resources/thumbnails/046/158/728/small/black-eyeglasses-frame-png.png",
      "https://images.pexels.com/photos/33129357/pexels-photo-33129357.jpeg",
    ],
  ];

  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    images: sampleSets[i % sampleSets.length],
    price: 999 + i * 200,
    size: ["S", "M", "L"][i % 3],
    description: `${category} eyewear with stylish design and comfort.`,
    model: `${category} Model ${i + 1}`
  }));
};

const Cards: React.FC<CardsProps> = ({ category }) => {
  // Try to read real products from localStorage (uploaded by admin). If not present, fallback to sample
  const savedProducts = (typeof window !== "undefined" && localStorage.getItem("products"))
    ? JSON.parse(localStorage.getItem("products") as string)
    : null;

  const products: Product[] = useMemo(() => {
    if (savedProducts && Array.isArray(savedProducts) && savedProducts.length > 0) {
      // Map stored products to the Product type expecting images array: use photo as images[0]
      return savedProducts.map((p: any, idx: number) => ({
        id: p.id ?? (idx + 1),
        images: p.images && Array.isArray(p.images) && p.images.length ? p.images : (p.photo ? [p.photo] : [""]),
        price: p.price ?? 0,
        size: p.size ?? "",
        description: p.description ?? "",
        model: p.name ?? p.model ?? `Product ${idx + 1}`
      }));
    }
    return generateProducts(category);
  }, [category]);

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null); // if you keep edit modal
  const [showTryOn, setShowTryOn] = useState(false);

  // open product modal is handled by bootstrap attributes; we store active product
  const openProduct = (p: Product) => {
    setActiveProduct(p);
    // product modal will open via data-bs attributes on click in the markup below
  };

  return (
    <>
      <div className="row g-3">
        {products.map((p) => (
          <div key={p.id} className="col-6 col-lg-3">
            <div className="card product-card h-100 p-2">
              <img
                src={p.images[0]}
                alt={p.model}
                className="product-img card-img-top"
                data-bs-toggle="modal"
                data-bs-target="#cardModal"
                onClick={() => openProduct(p)}
              />
              <div className="card-body text-center">
                <h6 className="fw-bold mb-1">{p.model}</h6>
                <div className="price">₹{p.price}</div>
                <div className="text-muted mb-2">Size: {p.size}</div>
                <p className="small text-muted">{p.description}</p>
                <button
                  className="btn btn-sm whatsapp-btn"
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

      {/* Product Modal */}
      <div className="modal fade" id="cardModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">{activeProduct ? activeProduct.model : "Product"}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setActiveProduct(null)}></button>
            </div>
            <div className="modal-body text-center">
              {activeProduct && (
                <>
                  <img src={activeProduct.images[0]} alt={activeProduct.model} className="img-fluid rounded mb-3" style={{ maxHeight: 320, objectFit: "contain" }} />
                  <div><strong>Price:</strong> ₹{activeProduct.price}</div>
                  <div><strong>Size:</strong> {activeProduct.size}</div>
                  <p>{activeProduct.description}</p>

                  {/* Try Now button: closes product modal (via data-bs-dismiss) and opens VirtualTryOn */}
                  <div className="d-flex gap-2 justify-content-center mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      data-bs-dismiss="modal"
                      onClick={() => {
                        // after modal closes, open try-on
                        // small timeout to allow bootstrap to remove backdrop
                        setTimeout(() => setShowTryOn(true), 250);
                      }}
                    >
                      👓 Try Now
                    </button>

                    <a
                      href={`https://wa.me/919889716600?text=${encodeURIComponent("Hi, I'm interested in " + activeProduct.model)}`}
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

      {/* Virtual Try-On overlay (renders when showTryOn true) */}
      {showTryOn && activeProduct && (
        <VirtualTryOn
          frameSrc={activeProduct.images[0]}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </>
  );
};

export default Cards;
