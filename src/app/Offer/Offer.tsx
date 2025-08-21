'use client';

import React from "react";
import "./Offer.css";

const Offer: React.FC = () => {
  const images = [
    "https://images.pexels.com/photos/7357979/pexels-photo-7357979.jpeg",
    "https://images.pexels.com/photos/7357975/pexels-photo-7357975.jpeg",
    "https://images.pexels.com/photos/27111648/pexels-photo-27111648.jpeg",
    "https://images.pexels.com/photos/29153398/pexels-photo-29153398.jpeg",
    "https://images.pexels.com/photos/33129357/pexels-photo-33129357.jpeg",
  ];

  return (
    <section id="offers" className="offer-carousel container my-4">
      <div id="offerCarousel" className="carousel slide" data-bs-ride="carousel">
        {/* Indicators */}
        <div className="carousel-indicators">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#offerCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0 ? "true" : "false"}
              aria-label={`Slide ${i + 1}`}
            ></button>
          ))}
        </div>

        {/* Slides */}
        <div className="carousel-inner rounded-3 shadow">
          {images.map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img
                src={img}
                className="d-block w-100 offer-img"
                alt={`Offer ${i + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#offerCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#offerCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
};

export default Offer;
