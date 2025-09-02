'use client';

import React from "react";
import Cards from "../Cards/Cards";
import "./Home.css";

const Home: React.FC = () => {
  const categories = [
    { id: 1, label: "Our_Products_Range", description: "Discover the latest styles and eyewear trends for men." },
    { id: 2, label: "Women Collection", description: "Explore elegant and modern frames designed for women." },
    { id: 3, label: "Children Collection", description: "Find durable and colorful eyewear made for kids." },
  ];

  return (
    <main className="collections-main">
      {categories.map(cat => (
        <section key={cat.id} id={`category-${cat.id}`} className="collection-section mb-5">
          <h2>{cat.label}</h2>
          <p>{cat.description}</p>
          {/* <Cards categoryId={cat.id} /> */}
        </section>
      ))}
    </main>
  );
};

export default Home;
