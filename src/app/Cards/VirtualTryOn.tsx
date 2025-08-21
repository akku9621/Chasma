'use client';

import React, { useEffect, useRef, useState } from "react";
import "./virtualtryon.css";

interface VirtualTryOnProps {
  frameSrc: string;
  onClose: () => void;
}

// Typing for dynamically loaded FaceMesh
interface FaceMeshType {
  new (options: { locateFile: (file: string) => string }): {
    setOptions(options: any): void;
    onResults(callback: (results: FaceMeshResults) => void): void;
    send({ image }: { image: HTMLVideoElement | HTMLCanvasElement }): Promise<void>;
  };
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

export default function VirtualTryOn({ frameSrc, onClose }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameImgRef = useRef<HTMLImageElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    let mounted = true;

    async function init() {
      try {
        setLoading(true);

        await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");

        const FaceMeshClass = (window as unknown as { FaceMesh?: FaceMeshType }).FaceMesh;

        let retries = 5;
        let faceMeshClassRetry = FaceMeshClass;
        while (!faceMeshClassRetry && retries > 0) {
          await new Promise((res) => setTimeout(res, 200));
          faceMeshClassRetry = (window as unknown as { FaceMesh?: FaceMeshType }).FaceMesh;
          retries--;
        }

        if (!faceMeshClassRetry) throw new Error("FaceMesh not available");

        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";
        frameImg.src = frameSrc;
        frameImgRef.current = frameImg;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        canvas.width = 640;
        canvas.height = 480;

        const faceMesh = new faceMeshClassRetry({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.autoplay = true;
        video.muted = true;
        await video.play();

        faceMesh.onResults((results: FaceMeshResults) => {
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

            const angle = Math.atan2(dy, dx);

            const img = frameImgRef.current!;
            if (img.complete) {
              ctx.save();
              ctx.translate(eyeCenterX, eyeCenterY);
              ctx.rotate(angle);
              ctx.drawImage(img, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
              ctx.restore();
            }
          }
        });

        const render = async () => {
          if (!mounted) return;
          if (video.readyState >= 2) {
            await faceMesh.send({ image: video });
          }
          animationFrameRef.current = requestAnimationFrame(render);
        };
        render();

        setLoading(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("VirtualTryOn error:", msg);
        setError(msg);
        setLoading(false);
      }
    }

    init();

    return () => {
      mounted = false;
      stopCameraAndAnimation();
    };
  }, [frameSrc]);

  return (
    <>
      <div className="modal-backdrop show" />
      <div className="modal fade show d-block vt-modal" tabIndex={-1}>
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">👓 Virtual Try-On</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  stopCameraAndAnimation();
                  onClose();
                }}
              />
            </div>
            <div className="modal-body text-center">
              {loading && !error && <div className="vt-loading">Starting camera…</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              <video ref={videoRef} className="d-none" playsInline muted />
              <canvas ref={canvasRef} className="vt-canvas border rounded" />

              <div className="mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    stopCameraAndAnimation();
                    onClose();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
