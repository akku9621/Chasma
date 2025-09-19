"use client";

import React, { useEffect, useState } from "react";
import { API } from "@/services/api";
import Cookies from "js-cookie";

export default function VideoCarousel() {
  const [videos, setVideos] = useState([]);
  const token = Cookies.get("token");

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
        setVideos(filtered);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchVideos();
  }, [token]);

  if (!videos.length) return null;

  // Duplicate videos for seamless scroll
  const videoList = [...videos, ...videos];

  return (
    <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee">
          {videoList.map((video, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[315px] h-[560px] rounded-2xl overflow-hidden shadow-lg"
            >
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: video.description }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .animate-marquee {
          display: flex;
          gap: 1rem;
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused; /* pause on hover */
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
