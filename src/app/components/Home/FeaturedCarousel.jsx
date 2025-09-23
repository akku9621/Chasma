import React, { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";

export default function FeaturedCarousel({ products, onProductClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation(); 

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product, index) => (
            <div key={product.id} className="w-full flex-shrink-0">
              <div className="glass-effect mx-4 rounded-3xl overflow-hidden glow-effect group cursor-pointer">
                <div className="grid md:grid-cols-2 min-h-[500px]">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_urls?.[0] || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
                  </div>
                  
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-300 text-sm">{t("premium_quality")}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 text-glow">
                        {product.name}
                      </h3>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex items-center space-x-4">
                        <span className="text-3xl font-bold text-cyan-400">
                          ${product.price}
                        </span>
                        {product.original_price && (
                          <span className="text-lg text-gray-400 line-through">
                            ${product.original_price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        onClick={() => onProductClick(product)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl glow-effect hover:scale-105 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        {t("view_details")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 glass-effect text-white hover:text-cyan-400 w-12 h-12 rounded-full glow-effect"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 glass-effect text-white hover:text-cyan-400 w-12 h-12 rounded-full glow-effect"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-3 mt-8">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-cyan-400 glow-effect"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}