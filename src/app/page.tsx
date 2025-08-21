import React from "react";
import Header from "../app/Header/Header";
import HeroBanner from "../app/HeroBanner/HeroBanner";
import CategoryGrid from "./CategoryGrid/CategoriesGrid";
import Offer from "../app/Offer/Offer";
import CategorySection from "./CategorySection/CategorySection";
import Footer from "../app/Footer/Footer";
import "./AllProducts/AllProducts.css";

export default function App() {
  return (
    <>
      <Header />
      <HeroBanner />
      <CategoryGrid />
      <Offer />

      {/* Category Sections */}
      <CategorySection id="men" title="Men" query="man glasses" />
      <CategorySection id="women" title="Women" query="woman glasses" />
      <CategorySection id="children" title="Kids" query="kid glasses" />

      <Footer />
    </>
  );
}
