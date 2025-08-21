'use client';

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

interface CardProps {
  photo: string;
  price: number;
  size: string;
  description: string;
  model: string;
}

const Card: React.FC<CardProps> = ({ photo, price, size, description, model }) => {
  const [show, setShow] = useState(false);

  const handleShow = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShow(true);
  };
  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setShow(false);
  };

  return (
    <>
      <div
        className="custom-card card shadow-sm m-2"
        tabIndex={0}
        role="button"
        aria-label={`Open details for ${model}`}
        onClick={handleShow}
        onKeyPress={(e) => e.key === 'Enter' && handleShow()}
      >
        <img
          src={photo}
          alt={model}
          className="card-img-top custom-card-img"
          onError={e => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Unavailable")}
          loading="lazy"
        />
        <div className="card-body">
          <h5 className="card-title custom-card-model">{model}</h5>
          <p className="card-text custom-card-desc">{description}</p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="text-success fw-bold custom-card-price">₹{price}</span>
            <span className="text-secondary custom-card-size">Size: {size}</span>
          </div>
          <button
            className="btn btn-primary mt-3 custom-order-btn"
            onClick={(e) => { e.stopPropagation(); handleShow(); }}
          >
            Order Now
          </button>
        </div>
      </div>

      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex={-1}
        role="dialog"
        style={{
          background: "rgba(0,0,0,0.5)",
          opacity: show ? 1 : 0,
          visibility: show ? "visible" : "hidden",
          transition: "opacity 0.3s ease",
        }}
        onClick={handleClose}
      >
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{model}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={handleClose} />
            </div>
            <div className="modal-body">
              <img src={photo} alt={model} className="img-fluid rounded modal-img mb-3" />
              <p className="mb-1"><b>Price:</b> <span className="text-success">₹{price}</span></p>
              <p className="mb-1"><b>Size:</b> {size}</p>
              <p>{description}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={() => { alert(`Order placed for ${model}`); handleClose(); }}>
                Order Now
              </button>
              <button className="btn btn-outline-secondary" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
