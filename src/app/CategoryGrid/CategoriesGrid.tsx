'use client';

import React from 'react';
import './CategoryGrid.css';

const categories = [
  { name: "Men", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80" },
  { name: "Women", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80" },
  { name: "Kids", img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=600&q=80" },
];

const CategoriesGrid: React.FC = () => {
  return (
    <section className="categories-grid">
      {categories.map((cat) => (
        <div key={cat.name} className="category-card" style={{ backgroundImage: `url(${cat.img})` }}>
          <div className="category-label">{cat.name} Collection</div>
        </div>
      ))}
    </section>
  );
};

export default CategoriesGrid;
