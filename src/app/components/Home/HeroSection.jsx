'use client';

import React, { useEffect, useState, useRef } from "react";
import { API } from "../../../services/api"; // adjust path
import { useTranslation } from "react-i18next";

export default function HeroCarousel() {
  const { t } = useTranslation();
  const [carousels, setCarousels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  const fetchCarousels = async () => {
    try {
      const params = new URLSearchParams({ page: "1", size: "50" });
      const res = await fetch(`${API.CAROUSELS.GET_ALL}?${params}`);
      if (!res.ok) {
        console.error("Failed to fetch videos:", res.status);
        return;
      }
      const data = await res.json();
      if (res.ok) {
        // only keep carousels with images
        const imagesOnly = (data.items || data).filter(c => c.image_path);
        setCarousels(imagesOnly);
      }
    } catch (err) {
      console.error("Fetch carousels failed:", err);
    }
  };

  useEffect(() => {
    fetchCarousels();
  }, []);

  // Auto scroll
  useEffect(() => {
    if (carousels.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carousels.length);
    }, 5000); // change every 5s
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [carousels]);

  if (carousels.length === 0) return null;

  const current = carousels[currentIndex];

  return (
    <section className="relative h-[50vh] flex items-end justify-center overflow-hidden bg-black">
      {/* ✅ Carousel Images (no opacity, no blur) */}
      <div className="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out">
        {carousels.map((item, idx) => (
          <img
            key={idx}
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${item.image_path}`}
            alt={item.name}
            className={`absolute inset-0 w-full h-full object-cover brightness-110 transition-opacity duration-1000 ${
              idx === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* ✅ Content moved to bottom */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-6 mb-4">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-md">
          {current.name}
        </h1>
        {current.description && (
          <p className="text-sm md:text-base text-gray-200 leading-relaxed drop-shadow-sm">
            {current.description}
          </p>
        )}
      </div>

      {/* ✅ Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {carousels.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "bg-cyan-400 scale-125" : "bg-white/40 hover:bg-cyan-300"
            }`}
          />
        ))}
      </div>

      {/* ✅ Optional Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + carousels.length) % carousels.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % carousels.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"
      >
        ›
      </button>
    </section>
  );
}
