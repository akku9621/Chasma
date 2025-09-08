"use client"
import React, { useState, useEffect } from "react";
import { ChevronRight, Star, Zap, Shield, Eye } from "lucide-react";

import Button from "../app/components/ui/Button";
import HeroSection from "../app/components/Home/HeroSection";
import FeaturedCarousel from "../app/components/Home/FeaturedCarousel";
import CategoryGrid from "../app/components/Home/CategoryGrid";
import AllProductsSection from "../app/components/Home/AllProductsSection";
import ProductModal from "../app/components/ui/ProductModal"

import { CATEGORIES, PRODUCTS, FEATURED_PRODUCTS } from "../app/utils/constant";

export default function Home() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [featuredProducts, setFeaturedProducts] = useState(FEATURED_PRODUCTS);
  const [allProducts, setAllProducts] = useState(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // if (selectedCategory) {
    //   const filtered = allProducts.filter(product => product.category_id === selectedCategory);
    //   setFilteredProducts(filtered);
    // } else {
    //   setFilteredProducts([]);
    // }
  }, [selectedCategory, allProducts]);

  const loadData = async () => {
    // const [categoriesData, productsData] = await Promise.all([
    //   Category.list(),
    //   Product.list('-created_date')
    // ]);
    // setCategories(categoriesData);
    // setAllProducts(productsData);
    // setFeaturedProducts(productsData.filter(p => p.featured));
  };

  return (
    <div className="relative z-10">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Featured Products Carousel */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 text-glow">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-300">
              Discover our latest high-tech eyewear innovations
            </p>
          </div>
          <FeaturedCarousel 
            products={featuredProducts}
            onProductClick={setSelectedProduct}
          />
        </section>

        {/* Categories */}
        <section>
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4 text-glow">
                Shop by Category
              </h2>
              <p className="text-xl text-gray-300">
                Find the perfect goggles for your needs
              </p>
            </div>
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
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {categories.find(c => c.id === selectedCategory)?.name} Collection
                </h3>
                <p className="text-gray-300 mb-8">
                  {filteredProducts.length} products available
                </p>
              </div>
              <AllProductsSection 
                products={filteredProducts}
                onProductClick={setSelectedProduct}
                title=""
                showAutoScroll={false}
              />
            </div>
          )}
        </section>

        {/* All Products with Auto Scroll */}
        {!selectedCategory && (
          <AllProductsSection 
            products={allProducts}
            onProductClick={setSelectedProduct}
            title="Complete Collection"
            subtitle="Explore our entire range of premium eyewear"
            showAutoScroll={true}
          />
        )}

        {/* Features Section */}
        <section className="text-center">
          <h2 className="text-4xl font-bold text-white mb-16 text-glow">
            Why Choose VisionX?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Advanced Protection",
                description: "Military-grade UV protection and impact resistance"
              },
              {
                icon: Eye,
                title: "Crystal Clear Vision",
                description: "Anti-fog technology with HD clarity in any condition"
              },
              {
                icon: Zap,
                title: "Smart Features",
                description: "Integrated tech for the ultimate performance experience"
              }
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
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}