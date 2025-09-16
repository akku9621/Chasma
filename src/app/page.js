"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Zap, Shield, Eye } from "lucide-react";

import Button from "../app/components/ui/Button";
import HeroSection from "../app/components/Home/HeroSection";
import CategoryGrid from "../app/components/Home/CategoryGrid";
import ProductModal from "../app/components/ui/ProductModal";

import { API } from "../services/api";

/*
  CATEGORY_MAP: local category map used instead of fetching categories.
  Keep this here — it's used for badges and to render CategoryGrid if needed.
*/
const CATEGORY_MAP = {
  1: "Men",
  2: "Women",
  3: "Children",
  4: "Offer",
};

export default function Home() {
  // products + featured
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // pagination per category (1..3). Offer is a scroller, not paginated.
  const [currentPage, setCurrentPage] = useState({
    1: 1,
    2: 1,
    3: 1,
  });
  const PRODUCTS_PER_PAGE = 12; // per-category pagination (Men/Women/Children)

  // loader state
  const [loading, setLoading] = useState(true);

  // refs for Offer auto-scroll
  const offerSectionRef = useRef(null); // used for auto-scroll-to-offer on load
  const offerScrollRef = useRef(null); // the actual scroll container

  // build categories array for CategoryGrid (if that component expects {id,name}[])
  const categoriesArray = Object.keys(CATEGORY_MAP).map((k) => ({
    id: Number(k),
    name: CATEGORY_MAP[k],
  }));

  // load products (only products API, as requested)
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API.PRODUCTS.GET_ALL);
        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching products:", data);
          setAllProducts([]);
          setFeaturedProducts([]);
          setLoading(false);
          return;
        }
        const items = data.items || data || [];
        setAllProducts(items);
        setFeaturedProducts(items.filter((p) => p.featured));
      } catch (err) {
        console.error("Error loading products:", err);
        setAllProducts([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // auto-scroll to Offer section on first load (smooth)
  useEffect(() => {
    if (!offerSectionRef.current) return;
    const t = setTimeout(() => {
      try {
        offerSectionRef.current.scrollIntoView({ behavior: "smooth" });
      } catch (e) {
        /* ignore */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [allProducts]);

  // Smooth, seamless auto-scroller for Offer section (iOS compatible)
  useEffect(() => {
    const container = offerScrollRef.current;
    if (!container) return;
    const products = allProducts.filter((p) => p.category_id === 4);
    if (!products || products.length === 0) return;

    // iOS smooth scrolling
    container.style.scrollBehavior = "auto";
    container.style.WebkitOverflowScrolling = "touch";

    let rafId = null;
    let running = true;
    const speed = 40; // pixels per second
    let lastTime = performance.now();

    const step = (time) => {
      if (!running || !container) return;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      container.scrollBy({ left: speed * delta, behavior: "auto" });

      const halfWidth = container.scrollWidth / 2;
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    const pause = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
    const resume = () => {
      if (!running) {
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause, { passive: true });
    container.addEventListener("touchend", resume, { passive: true });

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
    };
  }, [allProducts]);

  // helpers: paginate generic
  const paginate = (items, page, perPage) => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  };

  const totalPages = (items, perPage) =>
    Math.max(1, Math.ceil((items?.length || 0) / perPage));

  const handleCategoryPage = (categoryId, nextPage) => {
    setCurrentPage((prev) => ({ ...prev, [categoryId]: nextPage }));
  };

  // Product card inline
  const ProductCard = ({ product, onClick }) => (
    <div
      key={product.id}
      className="relative group overflow-hidden rounded-2xl p-0.5 transition-all cursor-pointer bg-gray-800 hover:bg-white/10 shadow-lg hover:shadow-cyan-400/20"
      onClick={onClick}
    >
      <div className="p-3 sm:p-4 bg-gray-900 rounded-[15px] flex flex-col h-full text-center">
        <div className="relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-36 sm:h-48 object-cover rounded-xl mb-3 sm:mb-4 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {CATEGORY_MAP[product.category_id]}
          </div>
        </div>

        <div className="flex-grow flex flex-col items-center">
          <h3 className="text-sm sm:text-lg font-bold text-white mb-1 line-clamp-2">
            {product.name}
          </h3>

          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
            {product.description}
          </p>

          {product.size && (
            <p className="text-xs font-medium text-gray-300 mb-2">
              Size: <span className="text-cyan-400 uppercase">{product.size}</span>
            </p>
          )}

          <div className="mt-auto w-full">
            <p className="text-base sm:text-xl font-bold text-cyan-400 mb-2">
              ₹{product.price}
            </p>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-4 py-2 text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105">
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Offer section
  const renderOfferSection = () => {
    const products = allProducts.filter((p) => p.category_id === 4);
    if (!products || products.length === 0) {
      return (
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 text-glow">Special Offers</h2>
            <p className="text-gray-300">No offers available</p>
          </div>
        </section>
      );
    }

    const doubled = [...products, ...products];

    return (
      <section id="category-4" key="offer" ref={offerSectionRef} className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-glow">Special Offers</h2>
          <p className="text-gray-300">{products.length} offers available</p>
        </div>

        <div
          ref={offerScrollRef}
          className="flex gap-6 overflow-x-auto pb-4 no-scrollbar"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {doubled.map((product, idx) => (
            <div className="w-56 sm:w-64 flex-shrink-0" key={`${product.id}_${idx}`}>
              <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
            </div>
          ))}
        </div>
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>
    );
  };

  // category sections (Men, Women, Children)
  const renderCategorySection = (categoryId) => {
    const products = allProducts.filter((p) => p.category_id === categoryId);
    const page = currentPage[categoryId] || 1;
    const pages = totalPages(products, PRODUCTS_PER_PAGE);
    const items = paginate(products, page, PRODUCTS_PER_PAGE);

    return (
      <section id={`category-${categoryId}`} key={categoryId} className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-glow">
            {CATEGORY_MAP[categoryId]} Collection
          </h2>
          <p className="text-gray-300">{products.length} products available</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
          ))}
        </div>

        {pages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
            <Button
              onClick={() => handleCategoryPage(categoryId, Math.max(page - 1, 1))}
              disabled={page === 1}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-6 py-2 disabled:bg-gray-700 disabled:text-gray-400"
            >
              Previous
            </Button>

            <span className="text-white text-lg font-semibold">
              Page {page} of {pages}
            </span>

            <Button
              onClick={() => handleCategoryPage(categoryId, Math.min(page + 1, pages))}
              disabled={page === pages}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-6 py-2 disabled:bg-gray-700 disabled:text-gray-400"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    );
  };

  const FancyLoader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="relative z-10">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <FancyLoader />
        ) : (
          <>
            <section>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
                ))}
              </div>
            </section>

            {/* One-line categories with scroll and gradient buttons */}
            <section className="my-12">
              <div className="flex justify-center gap-4 overflow-x-auto no-scrollbar px-2">
                {categoriesArray.map((cat) => (
                  <button
                    key={cat.id}
                    className="px-5 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-cyan-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-cyan-400/30 whitespace-nowrap"
                    onClick={() => {
                      const section = document.getElementById(`category-${cat.id}`);
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
            </section>

            {renderOfferSection()}

            {renderCategorySection(1)}
            {renderCategorySection(2)}
            {renderCategorySection(3)}
          </>
        )}

        <section className="text-center mt-4">
          <h2 className="text-4xl font-bold text-white mb-16 text-glow">Why Choose Jyoti Chashma?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced Protection",
                description: "Military-grade UV protection and impact resistance",
              },
              {
                icon: Eye,
                title: "Crystal Clear Vision",
                description: "Anti-fog technology with HD clarity in any condition",
              },
              {
                icon: Zap,
                title: "Smart Features",
                description: "Integrated tech for the ultimate performance experience",
              },
            ].map((feature, index) => (
              <div key={index} className="glass-effect p-8 rounded-2xl glow-effect group hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
