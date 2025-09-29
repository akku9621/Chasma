"use client";
import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  // ✅ Remove "+" sign, keep only digits
  const phoneNumber = "918299562428"; 
  const message = "Hello! I want to know more about your products."; 

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
