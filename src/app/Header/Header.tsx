"use client";

import React from "react";
import "./Header.css";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const themes = ["classic", "ocean", "sunset", "forest", "royal"];

const Header: React.FC = () => {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleThemeClick = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as any);
  };

  const changeLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "hi" : "en");
  };

  // ✅ Select logo based on language
  const logoPath = i18n.language === "en" ? "/pictures/logo_en.png" : "/pictures/logo_hi.png";

  return (
    <nav className="navbar navbar-expand-lg sticky-top custom-navbar">
      <div className="container-fluid px-3">
        {/* ✅ Logo + Brand */}
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img
            src={logoPath} // dynamically changes with language
            alt="Jyoti Netraseva Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
          <span className="brand-text fw-bold">{t("brand")}</span>
        </a>

        {/* Hamburger */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-3">
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("men")}>
                {t("men")}
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("women")}>
                {t("women")}
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("children")}>
                {t("kids")}
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("offers")}>
                {t("offers")}
              </button>
            </li>

            {/* 🔥 Grouped Buttons in One Line */}
            <li className="nav-item d-flex gap-2 mt-2 mt-lg-0">
              {/* Theme */}
              <button className="btn btn-sm nav-btn" onClick={handleThemeClick}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>

              {/* Language */}
              <button className="btn btn-sm nav-btn" onClick={changeLanguage}>
                🌐 {i18n.language === "en" ? "हिंदी" : "English"}
              </button>

              {/* Store */}
              <a
                className="btn btn-sm nav-btn"
                href="https://www.google.com/maps/dir/?api=1&destination=JYOTI+NETRA+SEVA+%26+JYOTI+CHASHMA+SAGAR"
                target="_blank"
              >
                <i className="fas fa-map-marker-alt"></i> {t("store")}
              </a>

              {/* Call */}
              <a className="btn btn-sm nav-btn call-btn" href="tel:+919889716600">
                <i className="fas fa-phone-alt"></i> {t("call")}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
