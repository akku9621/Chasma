"use client";

import React, { useEffect, useState, useRef } from "react";
import { API } from "@/services/api";
import Cookies from "js-cookie";

export default function VideoCarousel() {
  const [videos, setVideos] = useState([]); 
  const [isPaused, setIsPaused] = useState(false); 
  const scrollRef = useRef(null);
  const token = Cookies.get("token");

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      if (!token) return;
      try {
        const res = await fetch(API.CAROUSELS.GET_ALL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.items || [];
        const filtered = items.filter(
          (c) => c.description && c.description.trim().startsWith("<iframe")
        );

        // ✅ Ensure iframe has proper allow attributes
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
            // Stop scrolling when user interacts
            onMouseEnter={() => setIsPaused(true)}
            onTouchStart={() => setIsPaused(true)}
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
