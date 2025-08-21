'use client';

import React from "react";
import "./Home.css";
import Cards from "../Cards/Cards";

const collections = [
  {
    label: "Men Collections",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&q=80",
    id: "men",
    bg: "#165d84",
    query: "man glasses",
  },
  {
    label: "Women Collections",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&q=80",
    id: "women",
    bg: "#bba080",
    query: "woman glasses",
  },
  {
    label: "Kids Collections",
    img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&q=80",
    id: "children",
    bg: "#f6b0bc",
    query: "kid glasses",
  },
];

const Home: React.FC = () => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="collections-main">
      <div className="collections-row">
        {collections.map((col) => (
          <div
            key={col.id}
            className="collection-card"
            style={{
              backgroundImage: `url(${col.img})`,
              backgroundColor: col.bg,
            }}
            tabIndex={0}
            onClick={() => scrollToSection(col.id)}
            onKeyPress={(e) => {
              if (e.key === "Enter") scrollToSection(col.id);
            }}
            aria-label={col.label}
            role="button"
          >
            <div className="collection-label">{col.label}</div>
          </div>
        ))}
      </div>

      {collections.map((col) => (
        <section key={col.id} id={col.id} className="collection-section">
          <h2>{col.label.replace(" Collections", "")} Collection</h2>
          <p>
            {col.id === "men" && "Discover the latest styles and eyewear trends for men."}
            {col.id === "women" && "Explore elegant and modern frames designed for women."}
            {col.id === "children" && "Find durable and colorful eyewear made for kids."}
          </p>
          <Cards category={col.query} />
        </section>
      ))}
    </main>
  );
};

export default Home;
