'use client';

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/services/api";
import Cookies from "js-cookie";

export default function VideoCarousel() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = Cookies.get("token");

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) {
        console.error("No token found.");
        return;
      }

      try {
        // Add page/size query params to match working pattern
        const params = new URLSearchParams({ page: "1", size: "50" });
        const res = await fetch(`${API.CAROUSELS.GET_ALL}?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch videos:", res.status);
          return;
        }

        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];

        // Only keep carousels with iframe descriptions
        const filtered = items.filter(
          (c) => c.description && c.description.trim().startsWith("<iframe")
        );

        // Ensure iframe has autoplay/allow attributes
        const fixed = filtered.map((item) => {
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
  }, [token]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 1, behavior: "smooth" });
        if (
          scrollRef.current.scrollLeft + scrollRef.current.clientWidth >=
          scrollRef.current.scrollWidth
        ) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Pause scrolling when user clicks or focuses on iframe
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleFocusIn = () => setIsPaused(true);
    const handleFocusOut = () => setIsPaused(false);

    container.addEventListener("focusin", handleFocusIn);
    container.addEventListener("focusout", handleFocusOut);

    return () => {
      container.removeEventListener("focusin", handleFocusIn);
      container.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  if (!videos.length) return null;

  return (
    <section className="relative w-full overflow-hidden py-6">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex-shrink-0 w-[315px] h-[560px] rounded-2xl overflow-hidden shadow-lg bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
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
