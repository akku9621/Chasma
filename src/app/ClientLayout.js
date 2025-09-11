"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // ✅ detect if route is /auth/*
  const isAuthPage = pathname.startsWith("/auth");

  const navigationItems = [
    { name: "Home", icon: Home, url: "/" },
    { name: "Search", icon: Search, url: "/search" },
  ];

  // ✅ If /auth/* → return only children (no header/footer/UI wrapper)
  if (isAuthPage) {
    return <>{children}</>;
  }

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

      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-2 group !no-underline hover:!no-underline"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center glow-effect group-hover:scale-110 transition-transform">
                <Image
                  src="/pictures/logo_en.png"
                  alt="Logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white text-glow">
                Jyoti Chashma
              </span>
            </Link>


            {/* <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === item.url
                      ? "glass-effect text-cyan-400 glow-effect"
                      : "text-gray-300 hover:text-cyan-400 hover:glass-effect"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav> */}

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.url}
                  className={`p-2 rounded-lg transition-all ${
                    pathname === item.url
                      ? "glass-effect text-cyan-400 glow-effect"
                      : "text-gray-300 hover:text-cyan-400"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
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
                  Jyoti Chashma
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Leading the future of eyewear technology with innovative designs
                and cutting-edge features.
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
                Quick Links
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

            {/* Support */}
            {/* <div>
              <h3 className="text-lg font-semibold text-white mb-6 text-glow">
                Support
              </h3>
              <ul className="space-y-3">
                {[
                  "Help Center",
                  "Size Guide",
                  "Warranty",
                  "Returns",
                  "Tech Support",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 text-glow">
                Contact
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
                  <span className="text-gray-300">Zamania Railway Station, Ghazipur, UP, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Jyoti Chashma. All rights reserved. Built for the future.
              </p>
              {/* <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 text-sm">
                  Cookies
                </a>
              </div> */}
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
