"use client";
import React, { useEffect, useRef, useState } from "react";
import { X, MessageCircle, Share2, Eye } from "lucide-react";
import "./virtualtryon.css"; // optional styling
import { useTranslation } from "react-i18next";

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

interface FaceLandmark {
  x: number;
  y: number;
  z?: number;
}

interface FaceMeshResults {
  image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement;
  multiFaceLandmarks?: FaceLandmark[][];
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [visible, setVisible] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const { t } = useTranslation(); 

  // --- Virtual Try-On refs and state ---
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImgRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [vtLoading, setVtLoading] = useState(false);
  const [vtError, setVtError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
  }, [isOpen, product]);

  // --- WhatsApp share ---
  const categoryMap: Record<number, string> = { 
    1: "Men", 
    2: "Women", 
    3: "Children",
    4: "Offer" 
  };

  // ✅ Minimal change: include product.id and image link
  const buildWhatsAppMessage = () =>
    `*${product.name}* (ID: ${product.id})\nBrand: Jyoti Chashma\nCategory: ${
      categoryMap[product.category_id] || "Eyewear"
    }\nPrice: ₹${product.price}\nDescription: ${
      product.description || "Premium eyewear with latest design."
    }\nSizes: ${product.size || "Standard"}\nImage: ${
      product.image_path ? process.env.NEXT_PUBLIC_BACKEND_URL + "/api/uploads/" + product.image_path : "/pictures/image.png"
    }`;

  const handleShareWithFriends = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleOrderOnWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/918299562428?text=${text}`, "_blank");
  };

  // --- Render tab content ---
  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-gray-300 leading-relaxed">
              {product.description || "Experience cutting-edge eyewear technology with our premium collection."}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">{t("brand")}:</span>{" "}
                <span className="text-white ml-1">{t("jyoti_chashma")}</span>
              </div>
              <div>
                <span className="text-gray-400">{t("model")}:</span>{" "}
                <span className="text-white ml-1">{product.name}</span>
              </div>
              <div>
                <span className="text-gray-400">{t("category")}:</span>{" "}
                <span className="text-white ml-1">{categoryMap[product.category_id] || "Premium Eyewear"}</span>
              </div>
              <div>
                <span className="text-gray-400">{t("availability")}:</span>{" "}
                <span className="text-green-400 ml-1">{t("in_stock")}</span>
              </div>
              {product.size && (
                <div className="col-span-2">
                  <span className="text-gray-400">{t("sizes")}:</span>{" "}
                  <span className="text-white ml-1">{product.size}</span>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // --- Virtual Try-On logic ---
  const stopCameraAndAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!showTryOn || !product) return;

    let mounted = true;

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(s);
      });

    async function initVT() {
      try {
        setVtLoading(true);
        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");

        const FaceMeshClass = (window as any).FaceMesh;
        if (!FaceMeshClass) throw new Error("FaceMesh not loaded");

        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.src = product.image_path ? process.env.NEXT_PUBLIC_BACKEND_URL + "/api/uploads/" + product.image_path : "/pictures/image.png";
        frameImgRef.current = frameImg;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        canvas.width = 640;
        canvas.height = 480;

        const faceMesh = new FaceMeshClass({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        faceMesh.onResults((results: FaceMeshResults) => {
          if (!mounted) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          if (results.multiFaceLandmarks?.length) {
            const landmarks = results.multiFaceLandmarks[0];

            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
            const chin = landmarks[152];
            const leftCheek = landmarks[234];
            const rightCheek = landmarks[454];

            const w = canvas.width;
            const h = canvas.height;

            const eyeCenterX = ((leftEye.x + rightEye.x) / 2) * w;
            const eyeCenterY = ((leftEye.y + rightEye.y) / 2) * h;

            const dx = (rightEye.x - leftEye.x) * w;
            const dy = (rightEye.y - leftEye.y) * h;
            const eyeDistance = Math.sqrt(dx * dx + dy * dy);

            const faceHeight = Math.abs(chin.y * h - eyeCenterY);
            const faceWidth = Math.abs((rightCheek.x - leftCheek.x) * w);

            const frameWidth = Math.min(eyeDistance * 2.2, faceWidth * 1.05);
            const frameHeight = faceHeight * 0.55;

            const img = frameImgRef.current!;
            if (img.complete) {
              ctx.save();
              ctx.translate(eyeCenterX, eyeCenterY);
              ctx.drawImage(img, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
              ctx.restore();
            }
          }
        });

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.autoplay = true;
        video.muted = true;
        await video.play();

        const render = async () => {
          if (!mounted) return;
          if (video.readyState >= 2) await faceMesh.send({ image: video });
          animationFrameRef.current = requestAnimationFrame(render);
        };
        render();
        setVtLoading(false);
      } catch (err: any) {
        console.error(err);
        setVtError(err.message || "Error initializing Virtual Try-On");
        setVtLoading(false);
      }
    }

    initVT();

    return () => {
      mounted = false;
      stopCameraAndAnimation();
    };
  }, [showTryOn, product]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center" aria-hidden={false}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />

      {/* Modal container */}
      <div
        role="dialog"
        aria-modal="true"
        className={
          "relative w-full max-w-sm sm:max-w-md bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden mx-3 mt-[10vh] transform transition-all duration-220 ease-out " +
          (visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95")
        }
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex flex-col p-4 space-y-3">
          {/* Product Image */}
          <div className="w-full">
            <img
              src={product.image_path ? process.env.NEXT_PUBLIC_BACKEND_URL + "/api/uploads/" + product.image_path : "/pictures/image.png"}
              alt={product.name}
              className="w-full max-h-48 object-contain rounded-lg bg-gray-800"
            />
          </div>

          {/* Product Info */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-white">{product.name}</h2>
              <p className="text-xs text-gray-400">{categoryMap[product.category_id] || "Eyewear"}</p>
              <span className="text-lg font-bold text-cyan-400">₹{product.price ?? "1200"}</span>
            </div>

            <button
              onClick={handleShareWithFriends}
              className="p-2 bg-green-600 hover:bg-green-700 rounded-full shadow-md ml-3"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex bg-gray-800 rounded-lg p-1 mb-2">
              {["Overview"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs px-2 py-1 rounded-md ${
                    activeTab === tab ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-2">{renderTabContent()}</div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowTryOn(true)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>{t("try_on")}</span>
            </button>
            <button
              onClick={handleOrderOnWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t("whatsapp")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Virtual Try-On Modal (bigger) */}
      {showTryOn && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="relative bg-gray-900 p-4 rounded-xl shadow-xl max-w-lg w-full flex flex-col items-center">
            {vtLoading && <div className="text-white text-sm">Starting camera…</div>}
            {vtError && <div className="text-red-500">{vtError}</div>}

            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas
              ref={canvasRef}
              className="rounded-lg w-full max-h-[500px] sm:max-h-[600px] mx-auto"
            />

            {/* Close button */}
            <button
              className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
              onClick={() => setShowTryOn(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
