"use client";
import React from "react";

export default function WhatsAppButton() {
  const phoneNumber = "918299562428"; 
  const message = "Hello! I want to know more about your products."; 

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-4 z-50 w-16 h-16 p-0 rounded-full shadow-lg overflow-hidden transition-all hover:scale-105"
    >
      <img 
        src="/pictures/whatsappPhoto.png"  // replace with your actual image name
        alt="WhatsApp" 
        className="w-full h-full object-cover"
      />
    </button>
  );
}
