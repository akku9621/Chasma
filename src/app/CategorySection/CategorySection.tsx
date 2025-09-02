"use client";

import React from "react";
import Cards from "../Cards/Cards";
import "./CategorySection.css";
import { useTranslation } from "react-i18next";

interface CategorySectionProps {
  id: string;
  title: string;
  query: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ id, title, query }) => {
  const { t } = useTranslation();

  return (
    <section id={id} className="category-section">
      <div className="container py-4">
        {/* Title */}
        <h2 className="fw-bold text-center mb-3">
          {t(`Our_Products_Range`)}
        </h2>

        {/* Description */}
        <p className="text-center text-muted mb-4">
          {id === "Our_Products_Range" && t("Our_Products")}
          {/* {id === "women" && t("women description")}
          {id === "children" && t("kids description")} */}
        </p>

        {/* Cards */}
        <Cards category={query} />
      </div>
    </section>
  );
};

export default CategorySection;
