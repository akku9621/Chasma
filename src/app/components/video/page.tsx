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
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
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

  // Smooth auto-scroll using requestAnimationFrame
  useEffect(() => {
    const step = () => {
      if (scrollRef.current && !isPaused) {
        const container = scrollRef.current;
        container.scrollLeft += 0.5;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollLeft = 0;
        }
      }
      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused]);

  if (!videos.length) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 text-glow">{t("our_feed")}</h2>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
      >
        {videos.map((video: CarouselItem) => (
          <div
            key={video.id}
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
