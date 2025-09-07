import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, viewMode, onProductClick }) {
  if (!products.length) {
    return (
      <div className="glass-effect rounded-2xl p-12 text-center glow-effect">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">👓</span>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">No goggles found</h3>
        <p className="text-gray-300">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === "grid" 
        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
        : "grid-cols-1"
    }`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}