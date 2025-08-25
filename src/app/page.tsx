"use client";   // ✅ required for useTranslation

import React from "react";
import { useTranslation } from "react-i18next";

import Header from "./Header/Header";
import HeroBanner from "./HeroBanner/HeroBanner";
import CategoryGrid from "./CategoryGrid/CategoriesGrid";
import Offer from "./Offer/Offer";
import CategorySection from "./CategorySection/CategorySection";
import Footer from "./Footer/Footer";

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Header />
      <HeroBanner />
      <CategoryGrid />
      <Offer />

      {/* Category Sections */}
      <CategorySection id="men" title={t("men collection")} query="man glasses" />
      <CategorySection id="women" title={t("women")} query="woman glasses" />
      <CategorySection id="children" title={t("kids")} query="kid glasses" />

      {/* Language Switch */}
      {/* <div style={{ textAlign: "center", margin: "1rem" }}>
        <button onClick={() => i18n.changeLanguage("en")}>English</button>
        <button onClick={() => i18n.changeLanguage("hi")}>हिंदी</button>
      </div> */}

      <Footer />
    </>
  );
}
