"use client";
import React, { useEffect, useState } from "react";
import { X, MessageCircle, Share2, Eye } from "lucide-react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";

// 1. Load the model outside the component to prevent re-loading
let faceMeshModel = null;
const loadModel = async () => {
  if (!faceMeshModel) {
    faceMeshModel = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
  }
};

const ProductModal = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [visible, setVisible] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    }
  }, [isOpen, product]);

  useEffect(() => {
    let stream;
    let animationFrameId;
    const video = document.getElementById("tryon-video");
    const glasses = document.getElementById("glasses-overlay");

    const setupTryOn = async () => {
      // Show loading state while the model loads for the first time
      setModelLoading(true);
      await loadModel();
      setModelLoading(false);

      try {
        // Start webcam
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (video) video.srcObject = stream;

        const detectFace = async () => {
          if (video.readyState >= 2) {
            const predictions = await faceMeshModel.estimateFaces({
              input: video,
            });
            if (predictions.length > 0) {
              const keypoints = predictions[0].scaledMesh;

              // Use main eye landmarks for broader detection
              const leftEye = keypoints[33];
              const rightEye = keypoints[263];

              // Calculate the center point between the eyes
              const eyeCenterX = (leftEye[0] + rightEye[0]) / 2;
              const eyeCenterY = (leftEye[1] + rightEye[1]) / 2;

              // Calculate the distance between the eyes
              const eyeDistance = Math.hypot(
                rightEye[0] - leftEye[0],
                rightEye[1] - leftEye[1]
              );

              // --- MANUAL ADJUSTMENT VARIABLES ---
              // Adjust these values to perfectly align the glasses
              const vertical_offset = 50; // Move glasses down by 50 pixels
              const horizontal_offset = -89; // Move glasses to the left by 79 pixels
              const scale_multiplier = 2.2; // Adjusted for a better frame size according to the face

              // Position, scale, and rotate glasses
              if (glasses) {
                glasses.style.position = "absolute";
                glasses.style.left = `${eyeCenterX + horizontal_offset}px`; // Apply horizontal offset
                glasses.style.top = `${eyeCenterY + vertical_offset}px`; // Apply vertical offset
                glasses.style.width = `${eyeDistance * scale_multiplier}px`;
                glasses.style.transform = `translate(-50%, -50%) rotate(${
                  Math.atan2(
                    rightEye[1] - leftEye[1],
                    rightEye[0] - leftEye[0]
                  ) *
                  (180 / Math.PI)
                }deg)`;
              }
            }
          }
          animationFrameId = requestAnimationFrame(detectFace);
        };
        detectFace();
      } catch (err) {
        console.error("Webcam or model error:", err);
      }
    };

    if (showTryOn && typeof window !== "undefined") {
      setupTryOn();
    }

    return () => {
      // Cleanup
      if (stream) stream.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(animationFrameId);
    };
  }, [showTryOn]);

  if (!isOpen || !product) return null;

  const tabs = ["Overview"];
  const categoryMap = { 1: "Men", 2: "Women", 3: "Children" };

  const buildWhatsAppMessage = () =>
    `*${product.name}*
Brand: Jyoti Chashma
Category: ${categoryMap[product.category_id] || "Eyewear"}
Price: ₹${product.price}
Description: ${
      product.description || "Premium eyewear with latest design."
    }
Image: ${
      product.image_url ||
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
    }`;

  const handleShareWithFriends = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleOrderOnWhatsApp = () => {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/918299562428?text=${text}`, "_blank");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-gray-300 leading-relaxed">
              {product.description ||
                "Experience cutting-edge eyewear technology with our premium collection."}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Brand:</span>{" "}
                <span className="text-white ml-1">Jyoti Chashma</span>
              </div>
              <div>
                <span className="text-gray-400">Model:</span>{" "}
                <span className="text-white ml-1">{product.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>{" "}
                <span className="text-white ml-1">
                  {categoryMap[product.category_id] || "Premium Eyewear"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Availability:</span>{" "}
                <span className="text-green-400 ml-1">In Stock</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center"
      aria-hidden={false}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        role="dialog"
        aria-modal="true"
        className={
          "relative w-full max-w-sm sm:max-w-md bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden mx-3 mt-[10vh] transform transition-all duration-220 ease-out " +
          (visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-3 scale-95")
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
              src={
                product.image_url ||
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
              }
              alt={product.name}
              className="w-full max-h-48 object-contain rounded-lg bg-gray-800"
            />
          </div>

          {/* Product Info */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-white">{product.name}</h2>
              <p className="text-xs text-gray-400">
                {categoryMap[product.category_id] || "Eyewear"}
              </p>
              <span className="text-lg font-bold text-cyan-400">
                ₹{product.price ?? "1200"}
              </span>
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
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs px-2 py-1 rounded-md ${
                    activeTab === tab
                      ? "bg-cyan-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-2">
              {renderTabContent()}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowTryOn(!showTryOn)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>Try On</span>
            </button>
            <button
              onClick={handleOrderOnWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Virtual Try-On overlay */}
          {showTryOn && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-90 p-4">
              {modelLoading && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                  Loading Virtual Try-On...
                </div>
              )}
              <button
                onClick={() => setShowTryOn(false)}
                className="absolute top-2 right-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 z-10"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <video
                id="tryon-video"
                autoPlay
                muted
                playsInline
                className="w-full h-full rounded-lg object-cover"
              />
              <img
                id="glasses-overlay"
                src="/pictures/image.png"
                alt="glasses overlay"
                className="absolute pointer-events-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;