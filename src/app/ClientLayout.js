"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import FormModal from "../app/components/ui/FormModal";
import { useTranslation } from "react-i18next"; // ✅ for language toggle
import { useState } from "react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // ✅ detect if route is /auth/*
  const isAuthPage = pathname.startsWith("/auth");

  const { i18n } = useTranslation(); // ✅ hook for changing language
  const [lang, setLang] = useState(i18n.language || "en"); // track current language
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  const navigationItems = [
    // { name: "Home", icon: Home, url: "/" }, // Home commented out as requested
    // { name: "Search", icon: Search, url: "/search" }, // Search commented out as requested
  ];
  
  // ✅ If /auth/* → return only children (no header/footer/UI wrapper)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Define common button classes for consistency
  const buttonClasses = "px-3 py-1 text-sm bg-purple-600/50 text-white rounded-full hover:bg-purple-700/70 transition glow-effect font-semibold flex-shrink-0";
  const languageButtonClasses = "px-3 py-1 text-sm bg-white/20 text-white rounded hover:bg-white/30 transition font-semibold flex-shrink-0";


  // ✅ Else → full UI with header + footer
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <style jsx>{`
        :root {
          --glow-primary: #8b5cf6;
          --glow-secondary: #06b6d4;
          --glow-accent: #10b981;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .glow-effect {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
        }
        .text-glow {
          text-shadow: 0 0 10px var(--glow-primary);
        }
        .neon-border {
          border: 1px solid;
          border-image: linear-gradient(
            45deg,
            var(--glow-primary),
            var(--glow-secondary),
            var(--glow-accent)
          ) 1;
        }
      `}</style>

      {/* Header - Responsive & No Hamburger */}
      <header className="bg-slate-900 border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Row: Logo and Actions */}
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and App Name - Font size adjusted for mobile responsiveness */}
            <Link
              href="/"
              className="flex items-center space-x-2 group !no-underline hover:!no-underline py-2 min-w-0"
            >
              {/* MINIMAL CHANGE: Increased container and Image size for better visibility */}
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center glow-effect group-hover:scale-110 transition-transform flex-shrink-0">
                <Image
                  src="/pictures/logo_en.png"
                  alt="Logo"
                  width={24} // Changed from 20 to 24
                  height={24} // Changed from 20 to 24
                  className="object-contain"
                />
              </div>
              {/* App name font size: text-lg for mobile/tablet, text-xl for desktop */}
              <span className="inline-flex items-center max-h-[50px] overflow-hidden">
                <img
                  src="/pictures/name.png"
                  alt="Jyoti Chashma"
                  className="max-h-[40px] w-auto object-contain drop-shadow-[0_0_10px_rgba(0,255,128,0.8)]"
                />
              </span>
            </Link>

            {/* Desktop Contact/Language */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Modal Link - Using consistent button styling */}
              <FormModal linkText={t("contact")} buttonClassName={buttonClasses} />

              {/* ✅ Single language toggle button - Using consistent button styling */}
              <button
                onClick={toggleLanguage}
                className={languageButtonClasses}
              >
                {lang === 'en' ? 'English' : 'हिन्दी'}
              </button>
            </div>

            {/* Mobile Actions - Combined Contact and Language */}
            <div className="md:hidden flex items-center space-x-2 flex-shrink-0">
                {/* Modal Link for Mobile - Using consistent button styling */}
                <FormModal linkText={t("contact")} buttonClassName={buttonClasses} /> 

                {/* ✅ Single language toggle for mobile - Using consistent button styling */}
                <button
                onClick={toggleLanguage}
                className={languageButtonClasses.replace('px-3', 'px-2')} // Slightly smaller padding for tight mobile space
              >
                {lang.toUpperCase()}
              </button>
            </div>
          </div>
          
          {/* Desktop Navigation Links (Second Row - Hidden on Mobile) */}
          <nav className="hidden md:flex justify-start space-x-8 h-auto pb-2">
              {navigationItems.map((item) => (
                <Link 
                    key={item.name} 
                    href={item.url} 
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                        pathname === item.url 
                            ? "text-cyan-400 border-b-2 border-cyan-400" 
                            : "text-gray-400 hover:text-white"
                    } !no-underline hover:!no-underline`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{t(item.name.toLowerCase())}</span>
                </Link>
              ))}
          </nav>

        </div>
        
        {/* Mobile Menu Dropdown - REMOVED */}
      </header>

      {/* Main */}
      <main className="relative">{children}</main>

      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center glow-effect">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white text-glow">
                  {t("jyoti_chashma")}
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                {t("slider_line")}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-cyan-400">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 text-glow">
                {t("map")}
              </h3>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7379741.471414846!2d74.38286995000004!3d25.425242168193165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e07356a7d4afd%3A0xd9162650f638677e!2sJYOTI%20NETRA%20SEVA%20%26%20JYOTI%20CHASHMA%20SAGAR!5e0!3m2!1sen!2sin!4v1757580173330!5m2!1sen!2sin"
                  style={{ border: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 text-glow">
                {t("quick_links")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">jyotichashma@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">+918299562428</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">{t("address")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                {t("footer_text")}
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
    </div>
  );
}