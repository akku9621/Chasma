'use client';

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/services/api";
import { useTranslation } from "react-i18next";

interface CarouselItem {
  id: number;
  name: string;
  description: string;
  image_path?: string | null;
  image_folder?: string | null;
  [key: string]: any;
}

export default function VideoCarousel() {
  const [videos, setVideos] = useState<CarouselItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation(); 

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const params = new URLSearchParams({ page: "1", size: "50" });
        const res = await fetch(`${API.CAROUSELS.GET_ALL}?${params}`);
        if (!res.ok) {
          console.error("Failed to fetch videos:", res.status);
          return;
        }
        const data = await res.json();
        const items: CarouselItem[] = Array.isArray(data) ? data : data.items || [];

        const filtered = items.filter(
          (c: CarouselItem) =>
            c.description && c.description.trim().startsWith("<iframe")
        );

        const fixed = filtered.map((item: CarouselItem) => {
          let desc = item.description;
          if (!desc.includes("allow=")) {
            desc = desc.replace(
              "<iframe",
              `<iframe allow="autoplay; encrypted-media; fullscreen" allowfullscreen`
            );
          }
          return { ...item, description: desc };
        });

        setVideos(fixed);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchVideos();
  }, []);

  // Auto-scroll like Offer section
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || videos.length === 0) return;

    const doubled = [...videos, ...videos]; // duplicate videos for seamless scroll
    let running = true;
    const speed = 40; // pixels per second
    let lastTime = performance.now();

    const step = (time: number) => {
      if (!running || !container) return;

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      container.scrollBy({ left: speed * delta, behavior: "auto" });

      const halfWidth = container.scrollWidth / 2;
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);

    const pause = () => (running = false);
    const resume = () => {
      if (!running) {
        running = true;
        lastTime = performance.now();
        requestAnimationFrame(step);
      }
    };

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause, { passive: true });
    container.addEventListener("touchend", resume, { passive: true });

    return () => {
      running = false;
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", resume);
    };
  }, [videos]);

  if (!videos.length) return null;

  const doubledVideos = [...videos, ...videos];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 text-glow">{t("our_feed")}</h2>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch" }}
      >
        {doubledVideos.map((video: CarouselItem, idx) => (
          <div
            key={`${video.id}_${idx}`}
            className="flex-shrink-0 w-[315px] h-[560px] rounded-2xl overflow-hidden shadow-lg bg-black"
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: video.description }}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </section>
  );
}
