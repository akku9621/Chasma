'use client';

import React from 'react';
import './HeroBanner.css';

const HeroBanner: React.FC = () => {
  const slides = [
    {
      img: "https://images.pexels.com/photos/7357975/pexels-photo-7357975.jpeg",
      title: "Trendy Eyeglasses",
      text: "Upgrade your style with our latest collection.",
    },
    {
      img: "https://images.pexels.com/photos/7357979/pexels-photo-7357979.jpeg",
      title: "Sunglasses for Every Look",
      text: "Protect your eyes in style starting ₹1399.",
    },
    {
      img: "https://images.pexels.com/photos/27111648/pexels-photo-27111648.jpeg",
      title: "Frames & Lenses",
      text: "Buy 1 Get 1 Free • Free lenses solution",
    },
  ];

  return (
    <section className="hero-carousel">
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""}`}
            >
              <img src={s.img} className="d-block w-100 hero-img" alt={s.title} />
              <div className="carousel-caption d-none d-md-block">
                <h2 className="fw-bold">{s.title}</h2>
                <p>{s.text}</p>
                <button className="btn btn-light btn-lg rounded-pill">Shop Now</button>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;
