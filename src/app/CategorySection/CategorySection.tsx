'use client';

import React from "react";
import Cards from "../Cards/Cards";
import "./CategorySection.css";

interface CategorySectionProps {
  id: string;
  title: string;
  query: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ id, title, query }) => {
  return (
    <section id={id} className="category-section">
      <div className="container py-4">
        <h2 className="fw-bold text-center mb-3">{title} Collection</h2>
        <p className="text-center text-muted mb-4">
          {id === "men" && "Discover the latest styles and eyewear trends for men."}
          {id === "women" && "Explore elegant and modern frames designed for women."}
          {id === "children" && "Find durable and colorful eyewear made for kids."}
        </p>
        <Cards category={query} />
      </div>
    </section>
  );
};

export default CategorySection;
