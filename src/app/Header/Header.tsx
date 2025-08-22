"use client";

import React from "react";
import "./Header.css";
import { useTheme } from "../context/ThemeContext";

const themes = ["classic", "ocean", "sunset", "forest", "royal"];

const Header: React.FC = () => {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const { theme, setTheme } = useTheme();

  const handleThemeClick = () => {
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] as any);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top custom-navbar">
      <div className="container-fluid px-3">
        {/* Brand */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <span className="logo-icon">👓</span>
          <span className="brand-text">Jyoti Netra Seva</span>
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
              <button className="nav-link btn btn-link" onClick={() => handleScroll("men")}>Men</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("women")}>Women</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("children")}>Kids</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleScroll("offers")}>Offers</button>
            </li>

            {/* Theme Switcher as Button */}
            <li className="nav-item">
              <button
                className="btn btn-sm nav-btn"
                onClick={handleThemeClick}
              >
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </button>
            </li>

            {/* Action Buttons */}
            <li className="nav-item d-flex gap-2 mt-2 mt-lg-0">
              <a
                className="btn btn-sm nav-btn"
                href="https://www.google.com/maps/dir/?api=1&destination=JYOTI+NETRA+SEVA+%26+JYOTI+CHASHMA+SAGAR"
                target="_blank"
              >
                <i className="fas fa-map-marker-alt"></i> Store
              </a>
              <a className="btn btn-sm nav-btn call-btn" href="tel:+919889716600">
                <i className="fas fa-phone-alt"></i> Call
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
