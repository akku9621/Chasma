import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Button from "../ui/Button";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation(); 
    return (
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        {/* <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070"
            alt="Futuristic goggles"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-slate-900/80"></div>
        </div> */}
  
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping delay-2000"></div>
  
        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full glass-effect text-cyan-400 text-sm font-medium glow-effect">
              <Sparkles className="w-4 h-4 mr-2" />
              {t("next_gen")}
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
            <span className="block text-glow">{t("jyoti")}</span>
            <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {t("chashma")}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t("slider_msg")}
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold rounded-xl glow-effect hover:scale-105 transition-all group"
              >
                Explore Collection
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="glass-effect text-white border-white/30 hover:border-cyan-400 px-8 py-4 text-lg font-semibold rounded-xl hover:scale-105 transition-all"
            >
              Watch Demo
            </Button>
          </div> */}
        </div>
  
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }