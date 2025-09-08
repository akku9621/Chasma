import React from "react";
import { ArrowRight } from "lucide-react";

export default function CategoryGrid({ categories, onCategorySelect }) {
  if (!categories.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className="group cursor-pointer text-left"
        >
          <div className="glass-effect rounded-2xl overflow-hidden glow-effect group-hover:scale-105 transition-all duration-500">
            <div className="relative h-64">
              <img
                src={category.image_url || "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-${category.color || 'purple'}-900/80 to-transparent`}></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2 text-glow">
                  {category.name}
                </h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center text-cyan-400 font-medium group-hover:text-cyan-300 transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}