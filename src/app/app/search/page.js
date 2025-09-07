"use client"
import React, { useState, useEffect, useCallback } from "react";
import { PRODUCTS, CATEGORIES } from "@/utils/constant";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";

import ProductGrid from "@/components/Products/ProductGrid";
import ProductModal from "@/components/ui/ProductModal";

export default function Search() {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(() => {
    setIsSearching(true);
    setTimeout(() => {
      let results = products;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags?.some(tag => tag.toLowerCase().includes(query)) ||
          product.features?.some(feature => feature.toLowerCase().includes(query))
        );
      }

      if (selectedFilters.length > 0) {
        results = results.filter(product =>
          selectedFilters.includes(product.category_id) ||
          selectedFilters.some(filter =>
            product.tags?.includes(filter) ||
            product.features?.includes(filter)
          )
        );
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, [searchQuery, selectedFilters, products]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const loadData = async () => {
    // const [productsData, categoriesData] = await Promise.all([
    //   Product.list(),
    //   Category.list()
    // ]);
    // setProducts(productsData);
    // setCategories(categoriesData);
  };

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Search Hero */}
      <section className="glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-6 text-glow">
              Find Your Perfect Vision
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Search through our premium collection of high-tech goggles
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <Input
              placeholder="Search for goggles, features, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg glass-effect border-white/30 text-white placeholder-gray-400 focus:border-cyan-400 focus:glow-effect rounded-2xl"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category.id}
                variant={selectedFilters.includes(category.id) ? "default" : "outline"}
                onClick={() => toggleFilter(category.id)}
                className={`${
                  selectedFilters.includes(category.id)
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white glow-effect"
                    : "glass-effect text-gray-300 border-white/30 hover:text-white hover:border-cyan-400"
                }`}
              >
                {category.name}
              </Button>
            ))}
            {selectedFilters.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="text-red-400 border-red-400/30 hover:bg-red-400/20"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {selectedFilters.length > 0 && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-gray-400">Active filters:</span>
              {selectedFilters.map((filterId) => {
                const category = categories.find(c => c.id === filterId);
                return (
                  <Badge
                    key={filterId}
                    className="glass-effect text-cyan-400 border-cyan-400/30"
                  >
                    {category?.name || filterId}
                    <button
                      onClick={() => toggleFilter(filterId)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Results Count */}
          <div className="text-center">
            <p className="text-gray-300">
              {isSearching ? "Searching..." : `${searchResults.length} goggles found`}
            </p>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductGrid
          products={searchResults}
          viewMode="grid"
          onProductClick={setSelectedProduct}
        />
      </section>

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