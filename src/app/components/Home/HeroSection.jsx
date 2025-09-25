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
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Hero Image */}
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${current.image_path}`}
        alt={current.name}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-slate-900/80"></div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
          {current.name}
        </h1>
        {current.description && (
          <p className="text-sm md:text-base text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
            {current.description}
          </p>
        )}
      </div>

      {/* Scroll Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carousels.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === currentIndex ? "bg-cyan-400" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
