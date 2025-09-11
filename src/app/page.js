"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Zap, Shield, Eye } from "lucide-react";

import Button from "../app/components/ui/Button";
import HeroSection from "../app/components/Home/HeroSection";
import CategoryGrid from "../app/components/Home/CategoryGrid";
import ProductModal from "../app/components/ui/ProductModal";

import { API } from "../services/api";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 24;

  // filters
  const [search, setSearch] = useState("");
  const [productSize, setProductSize] = useState("");

  // ref for scrolling
  const collectionRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(API.PRODUCTS.GET_ALL);
        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching products:", data);
          return;
        }
        const products = data.items || data;
        setAllProducts(products);
        setFeaturedProducts(products.filter((p) => p.featured));
      } catch (err) {
        console.error("Error loading products:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(API.CATEGORIES.GET_ALL);
        const data = await res.json();
        if (res.ok) {
          setCategories(data.items || data);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    let filtered = allProducts;

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id === selectedCategory
      );
    }
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (productSize) {
      filtered = filtered.filter((product) => product.size === productSize);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // reset pagination when filters change
  }, [selectedCategory, search, productSize, allProducts]);

  // scroll to top of collection when page changes
  useEffect(() => {
    if (collectionRef.current) {
      collectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const getPaginatedProducts = (products) => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(start, start + PRODUCTS_PER_PAGE);
  };

  const totalPages = (products) =>
    Math.ceil(products.length / PRODUCTS_PER_PAGE);

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
        </div>
        <div className="flex-grow flex flex-col items-center">
          <h3 className="text-sm sm:text-lg font-bold text-white mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-400 text-xs sm:text-sm line-clamp-2 mb-2">
            {product.description}
          </p>
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

  return (
    <div className="relative z-10">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Products */}
        <section>
          {/* <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-300">
              Discover our latest high-tech eyewear innovations
            </p>
          </div> */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex justify-between items-center mb-12">
            {/* <div>
              <h2 className="text-4xl font-bold text-white mb-4 text-glow">
                Shop by Category
              </h2>
              <p className="text-xl text-gray-300">
                Find the perfect goggles for your needs
              </p>
            </div> */}
            {selectedCategory && (
              <Button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                <span className="font-medium">Show All Categories</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>

          {!selectedCategory ? (
            <CategoryGrid
              categories={categories}
              onCategorySelect={setSelectedCategory}
            />
          ) : (
            <div className="space-y-8">
              {/* Filters */}
              {/*
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="p-3 w-full sm:w-1/3 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="p-3 w-full sm:w-1/6 rounded-full border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={productSize}
                  onChange={(e) => setProductSize(e.target.value)}
                >
                  <option value="">All Sizes</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="extra_large">Extra Large</option>
                </select>
                <input
                  type="number"
                  placeholder="Category ID"
                  className="p-3 w-full sm:w-1/6 rounded-full border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={selectedCategory || ""}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                />
              </div>
              */}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {categories.find((c) => c.id === selectedCategory)?.name}{" "}
                  Collection
                </h3>
                <p className="text-gray-300 mb-8">
                  {filteredProducts.length} products available
                </p>
              </div>

              {/* Products Grid with Pagination */}
              <div
                ref={collectionRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {getPaginatedProducts(filteredProducts).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages(filteredProducts) > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
                  <Button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentPage((p) => Math.max(p - 1, 1));
                    }}
                    disabled={currentPage === 1}
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-6 py-2 hover:from-purple-700 hover:to-cyan-600 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <span className="text-white text-lg font-semibold">
                    Page {currentPage} of {totalPages(filteredProducts)}
                  </span>
                  <Button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentPage((p) =>
                        Math.min(p + 1, totalPages(filteredProducts))
                      );
                    }}
                    disabled={currentPage === totalPages(filteredProducts)}
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-6 py-2 hover:from-purple-700 hover:to-cyan-600 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* All Products Grid */}
        {!selectedCategory && (
          <section ref={collectionRef}>
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-12 text-glow text-center space-y-24">
                Featured Collection
              </h2>
            </div>
            {/* Filters */}
            {/*
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <input type="text" placeholder="Search products..." ... />
              <select ...> ... </select>
              <input type="number" ... />
            </div>
            */}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {getPaginatedProducts(allProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages(allProducts) > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-8 gap-4">
                <Button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentPage((p) => Math.max(p - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-6 py-2 hover:from-purple-700 hover:to-cyan-600 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <span className="text-white text-lg font-semibold">
                  Page {currentPage} of {totalPages(allProducts)}
                </span>
                <Button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentPage((p) =>
                      Math.min(p + 1, totalPages(allProducts))
                    );
                  }}
                  disabled={currentPage === totalPages(allProducts)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-6 py-2 hover:from-purple-700 hover:to-cyan-600 transition-colors disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            )}
          </section>
        )}

        {/* Features Section */}
        <section className="text-center mt-4">
          <h2 className="text-4xl font-bold text-white mb-16 text-glow">
            Why Choose Jyoti Chashma?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced Protection",
                description:
                  "Military-grade UV protection and impact resistance",
              },
              {
                icon: Eye,
                title: "Crystal Clear Vision",
                description:
                  "Anti-fog technology with HD clarity in any condition",
              },
              {
                icon: Zap,
                title: "Smart Features",
                description:
                  "Integrated tech for the ultimate performance experience",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-effect p-8 rounded-2xl glow-effect group hover:scale-105 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
