'use client';

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/services/api";

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
  const requestRef = useRef<number>();

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const params = new URLSearchParams({ page: "1", size: "50" });
        const res = await fetch(`${API.CAROUSELS.GET_ALL}?${params}`);
        if (!res.ok) return;

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
        container.scrollLeft += 0.5; // Adjust speed here
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          container.scrollLeft = 0;
        }
      }
      requestRef.current = requestAnimationFrame(step);
    };

    requestRef.current = requestAnimationFrame(step);
    return () => requestRef.current && cancelAnimationFrame(requestRef.current);
  }, [isPaused]);

  // Pause scrolling on user interaction with iframe
  const handleUserInteract = (pause: boolean) => {
    setIsPaused(pause);
  };

  if (!videos.length) return null;

  return (
    <section className="relative w-full overflow-hidden py-6">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "auto" }} // disable smooth CSS scroll
      >
        {videos.map((video: CarouselItem) => (
          <div
            key={video.id}
            className="flex-shrink-0 w-[315px] h-[560px] rounded-2xl overflow-hidden shadow-lg bg-black"
            onMouseEnter={() => handleUserInteract(true)}
            onMouseLeave={() => handleUserInteract(false)}
            onTouchStart={() => handleUserInteract(true)}
            onTouchEnd={() => handleUserInteract(false)}
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: video.description }}
              onClick={() => handleUserInteract(true)} // stop scrolling when user clicks
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
