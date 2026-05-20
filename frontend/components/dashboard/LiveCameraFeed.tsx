"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Radio, Maximize2, Video, VideoOff, ShieldAlert, ShieldCheck } from "lucide-react";
import GlowCard from "@/components/ui/GlowCard";
import { getSimulatedState, setSimulatedState, addSimulatedLog } from "@/lib/mock-data";
import type { VerificationStatus } from "@/types";

export default function LiveCameraFeed() {
  const [status, setStatus] = useState<VerificationStatus>("WAITING_FOR_HAND");
  const [cameraActive, setCameraActive] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync with global simulated state
  useEffect(() => {
    const handleStateChange = () => {
      const state = getSimulatedState();
      setStatus(state.status);
      
      // Release browser camera lock if backend is connected
      if (state.isBackendConnected && streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      
      setIsBackendConnected(state.isBackendConnected);
    };

    handleStateChange(); // initial load
    window.addEventListener("edgeprint_state_change", handleStateChange);
    return () => window.removeEventListener("edgeprint_state_change", handleStateChange);
  }, []);


  // Handle webcam start / stop
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
      if (!isBackendConnected) {
        setSimulatedState({ status: "WAITING_FOR_HAND" });
      }
      addSimulatedLog("info", "Webcam Disabled", "Camera feed stopped by operator");
    } else {
      if (isBackendConnected) {
        setCameraActive(true);
        addSimulatedLog("info", "Webcam Enabled", "Connected to Python/FastAPI camera pipeline");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
        addSimulatedLog("info", "Webcam Enabled", "Direct browser camera capture initialized");
      } catch (err) {
        console.error("Webcam access error:", err);
        addSimulatedLog("error", "Webcam Blocked", "Camera access denied or device unavailable");
      }
    }
  };

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Update simulator state
  const handleSimulateStatus = (newStatus: VerificationStatus) => {
    setSimulatedState({ status: newStatus });
    if (newStatus === "REAL_USER_VERIFIED") {
      addSimulatedLog("success", "User Verified", "Landmark consistency matched; authentic hand");
    } else if (newStatus === "SPOOF_DETECTED") {
      addSimulatedLog("error", "Spoof Blocked", "No live movement / photo replay signature detected");
    } else if (newStatus === "PROCESSING") {
      addSimulatedLog("info", "Liveness Analysis", "Extracting fingertip ROI; calculating Laplacian variance");
    } else {
      addSimulatedLog("info", "Waiting", "ROI viewport cleared; awaiting hand landmark registration");
    }
  };

  return (
    <GlowCard glowColor="cyan" className="overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Live Camera Feed</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Connection mode */}
            <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
              isBackendConnected 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}>
              {isBackendConnected ? "FASTAPI MODE" : "SIMULATION MODE"}
            </span>

            {/* LIVE badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-red-400">LIVE</span>
            </div>
            
            {/* Camera power toggle */}
            <button
              onClick={toggleCamera}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                cameraActive 
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  : "border-[#1a2744] bg-[#0d1526] text-gray-500 hover:text-cyan-400"
              }`}
              title={cameraActive ? "Disable Camera" : "Enable Camera"}
            >
              {cameraActive ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Camera viewport */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-cyan-500/20 bg-[#030a14]">
          {/* Real video element or Backend MJPEG stream */}
          {cameraActive && (
            isBackendConnected ? (
              <img
                src="http://localhost:8000/video_feed"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
                alt="FastAPI OpenCV Hand Tracking Stream"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
            )
          )}


          {/* Animated border glow */}
          <div className="pointer-events-none absolute inset-0 rounded-lg"
            style={{
              boxShadow: status === "REAL_USER_VERIFIED" ? "inset 0 0 40px rgba(34, 197, 94, 0.25)" :
                         status === "SPOOF_DETECTED" ? "inset 0 0 40px rgba(239, 68, 68, 0.25)" :
                         status === "PROCESSING" ? "inset 0 0 40px rgba(0, 245, 255, 0.25)" :
                         "inset 0 0 30px rgba(0, 245, 255, 0.05)",
              border: status === "REAL_USER_VERIFIED" ? "1px solid rgba(34, 197, 94, 0.4)" :
                      status === "SPOOF_DETECTED" ? "1px solid rgba(239, 68, 68, 0.4)" :
                      status === "PROCESSING" ? "1px solid rgba(0, 245, 255, 0.4)" :
                      "1px solid rgba(0, 245, 255, 0.15)",
            }}
          />

          {/* Scan line animation */}
          {cameraActive && (
            <div className="pointer-events-none absolute left-0 right-0 h-[2px] overflow-hidden"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.8), transparent)",
                animation: "scanLine 3s linear infinite",
              }}
            />
          )}

          {/* Corner brackets */}
          {[
            "top-2 left-2 border-t border-l",
            "top-2 right-2 border-t border-r",
            "bottom-2 left-2 border-b border-l",
            "bottom-2 right-2 border-b border-r",
          ].map((pos, i) => (
            <div key={i} className={`absolute h-5 w-5 ${pos} ${
              status === "REAL_USER_VERIFIED" ? "border-emerald-400/60" :
              status === "SPOOF_DETECTED" ? "border-red-400/60" :
              "border-cyan-400/60"
            }`} />
          ))}

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 245, 255, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 245, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Center content — webcam placeholder */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/5">
                <VideoOff className="h-8 w-8 text-cyan-500/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-cyan-400/80">Camera Stream Inactive</p>
                <p className="mt-1 font-mono text-[11px] text-gray-500 px-6 max-w-sm">
                  Click the video camera icon above to turn on local webcam for live verification simulation.
                </p>
              </div>
            </div>
          )}

          {/* Hand ROI box wrapper */}
          {cameraActive && status !== "WAITING_FOR_HAND" && (
            <div className={`pointer-events-none absolute left-[30%] top-[20%] h-[60%] w-[40%] rounded border-2 transition-all duration-300 ${
              status === "REAL_USER_VERIFIED" ? "border-emerald-400/60 bg-emerald-500/5" :
              status === "SPOOF_DETECTED" ? "border-red-400/60 bg-red-500/5" :
              "border-cyan-400/60 bg-cyan-500/5"
            }`}>
              <div className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider ${
                status === "REAL_USER_VERIFIED" ? "bg-emerald-500 text-white" :
                status === "SPOOF_DETECTED" ? "bg-red-500 text-white" :
                "bg-cyan-500 text-black"
              }`}>
                {status === "REAL_USER_VERIFIED" && "VERIFIED USER"}
                {status === "SPOOF_DETECTED" && "SPOOF ATTACK BLOCK"}
                {status === "PROCESSING" && "ANALYZING HAND"}
              </div>

              {/* Fingertips tracked markers */}
              {[
                { x: "20%", y: "25%", name: "INDEX" },
                { x: "45%", y: "15%", name: "MIDDLE" },
                { x: "70%", y: "20%", name: "RING" },
                { x: "90%", y: "35%", name: "PINKY" },
              ].map((pos, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: pos.x, top: pos.y }}>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                    className={`h-2.5 w-2.5 rounded-full ${
                      status === "REAL_USER_VERIFIED" ? "bg-emerald-400" :
                      status === "SPOOF_DETECTED" ? "bg-red-400" :
                      "bg-cyan-400"
                    }`}
                  />
                  <span className="absolute left-3 top-[-6px] font-mono text-[8px] text-gray-400 font-bold">{pos.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Bottom stats overlay bar */}
          {cameraActive && (
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-cyan-500/10 bg-black/75 px-3 py-1.5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-cyan-400">
                  {status === "WAITING_FOR_HAND" ? "0 FPS" : "24 FPS"}
                </span>
                <span className="font-mono text-[10px] text-gray-600">·</span>
                <span className="font-mono text-[10px] text-gray-400">1280×720</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                  status === "WAITING_FOR_HAND" ? "bg-amber-400" :
                  status === "REAL_USER_VERIFIED" ? "bg-emerald-400" : "bg-cyan-400"
                }`} />
                <span className="font-mono text-[10px] text-gray-300">
                  {status === "WAITING_FOR_HAND" && "Awaiting hand placement"}
                  {status === "PROCESSING" && "Running anti-spoof model"}
                  {status === "REAL_USER_VERIFIED" && "Real user verified"}
                  {status === "SPOOF_DETECTED" && "Attack signature matched"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Live Simulator Control Panel (renders when FastAPI backend is disconnected to allow demonstration) */}
        {!isBackendConnected && (
          <div className="mt-4 rounded-lg border border-[#1a2744] bg-[#07090f] p-3">
            <p className="mb-2 font-mono text-[10px] font-bold tracking-wider text-gray-500 uppercase">
              Webcam Simulator Controls
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateStatus("WAITING_FOR_HAND")}
                className={`flex-1 rounded px-2.5 py-1.5 font-mono text-[10px] font-bold border transition-all ${
                  status === "WAITING_FOR_HAND"
                    ? "bg-amber-500/15 text-amber-400 border-amber-500/35"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                }`}
              >
                No Hand
              </button>
              <button
                onClick={() => handleSimulateStatus("PROCESSING")}
                className={`flex-1 rounded px-2.5 py-1.5 font-mono text-[10px] font-bold border transition-all ${
                  status === "PROCESSING"
                    ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/35"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                }`}
              >
                Put Hand (Scan)
              </button>
              <button
                onClick={() => handleSimulateStatus("REAL_USER_VERIFIED")}
                className={`flex-1 rounded px-2.5 py-1.5 font-mono text-[10px] font-bold border transition-all ${
                  status === "REAL_USER_VERIFIED"
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/35"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                }`}
              >
                Verify Real
              </button>
              <button
                onClick={() => handleSimulateStatus("SPOOF_DETECTED")}
                className={`flex-1 rounded px-2.5 py-1.5 font-mono text-[10px] font-bold border transition-all ${
                  status === "SPOOF_DETECTED"
                    ? "bg-red-500/15 text-red-400 border-red-500/35"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10"
                }`}
              >
                Sim Spoof Attack
              </button>
            </div>
          </div>
        )}
      </div>
    </GlowCard>
  );
}
