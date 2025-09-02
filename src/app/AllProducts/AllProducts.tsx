'use client';

import React from 'react';
import Image from 'next/image';

const productImages = [
  "https://images.pexels.com/photos/39716/pexels-photo-39716.jpeg",
  "https://images.pexels.com/photos/7357975/pexels-photo-7357975.jpeg",
  "https://images.pexels.com/photos/7357979/pexels-photo-7357979.jpeg",
  "https://images.pexels.com/photos/18279387/pexels-photo-18279387.jpeg",
  "https://images.pexels.com/photos/27111648/pexels-photo-27111648.jpeg",
  "https://images.pexels.com/photos/33129357/pexels-photo-33129357.jpeg",
  "https://images.pexels.com/photos/947885/pexels-photo-947885.jpeg",
  "https://images.pexels.com/photos/29153398/pexels-photo-29153398.jpeg"
];

const whatsappNumber = '919889716600';

const AllProducts: React.FC = () => {
  const products = Array.from({length: 100}, (_, i) => {
    const img = productImages[i % productImages.length];
    const model = `Model No: ${i+1}`;
    const price = 499 + ((i+1) % 5) * 110;
    const details = `I am interested in ${model} priced at ₹${price}. Image: ${img}`;
    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(details)}`;
    return {id: i+1, img, model, price, waLink};
  });

  const onThumbClick = (p: any) => {
    const titleEl = document.getElementById('productModalLabel');
    const imgEl = document.getElementById('modalImg') as HTMLImageElement | null;
    const priceEl = document.getElementById('modalDetails');
    const waEl = document.getElementById('modalWhatsapp') as HTMLAnchorElement | null;
    if (titleEl) titleEl.textContent = p.model;
    if (imgEl) imgEl.src = p.img;
    if (priceEl) priceEl.innerHTML = `<div class="price" style="font-size:1.15em">₹${p.price}</div>`;
    if (waEl) waEl.href = p.waLink;
  };

  return (
    <div className="container mb-5">
      <h3 className="fw-bold mb-3 text-center">All Eyeglasses &amp; Sunglasses</h3>
      <div className="row g-3">
        {products.map(p => (
          <div key={p.id} className="col-6 col-md-3">
            <div className="card product-card h-100 p-2">
              <div style={{position: 'relative', width: '100%', height: 160, cursor: 'pointer'}}>
                <Image
                  src={p.img}
                  alt={p.model}
                  fill
                  style={{objectFit: 'cover'}}
                  data-bs-toggle="modal"
                  data-bs-target="#productModal"
                  onClick={() => onThumbClick(p)}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160x160?text=No+Image'; }}
                />
              </div>
              <div className="card-body text-center">
                <div className="fw-bold mb-0">{p.model}</div>
                <div className="price mt-1 mb-2">₹{p.price}</div>
                <a href={p.waLink} target="_blank" className="whatsapp-btn">
                  <i className="fab fa-whatsapp"></i> Order on WhatsApp 1
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="modal fade" id="productModal" aria-hidden="true" aria-labelledby="productModalLabel" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="productModalLabel"></h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <img id="modalImg" src="" alt="Eyeglass" className="img-fluid rounded mb-3" style={{maxHeight:'360px'}} />
              <div id="modalDetails" className="mb-2"></div>
              <a id="modalWhatsapp" href="#" target="_blank" className="whatsapp-btn d-inline-block mb-1">
                <i className="fab fa-whatsapp"></i> Order on WhatsApp 1
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
