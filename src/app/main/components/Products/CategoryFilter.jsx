import React from "react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="glass-effect p-6 rounded-2xl glow-effect sticky top-24">
      <h3 className="text-xl font-bold text-white mb-6 text-glow">Categories</h3>
      
      <div className="space-y-3">
        <Button
          variant={selectedCategory === "all" ? "default" : "ghost"}
          onClick={() => onCategoryChange("all")}
          className={`w-full justify-start text-left ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white glow-effect"
              : "text-gray-300 hover:text-white hover:glass-effect"
          }`}
        >
          All Categories
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full justify-start text-left ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white glow-effect"
                : "text-gray-300 hover:text-white hover:glass-effect"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{category.name}</span>
              <Badge 
                variant="secondary"
                className="glass-effect text-cyan-400 border-cyan-400/30"
              >
                {/* We'd need to calculate count here, but keeping it simple */}
                •
              </Badge>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}