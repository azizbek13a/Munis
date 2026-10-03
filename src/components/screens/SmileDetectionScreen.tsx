"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmileDetector } from "@/lib/smileDetector";
import { sounds } from "@/lib/sounds";
import { Sparkles, Heart, Scan, CheckCircle2 } from "lucide-react";

interface SmileDetectionScreenProps {
  name: string;
  stream: MediaStream;
  onPhotoCaptured: (photoDataUrl: string) => void;
}

// 70% tabassum ko'rsatkichi chegarasi
const SMILE_THRESHOLD = 0.70;

export const SmileDetectionScreen: React.FC<SmileDetectionScreenProps> = ({
  name,
  stream,
  onPhotoCaptured,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const detectorRef = useRef<SmileDetector | null>(null);

  const [smileScore, setSmileScore] = useState<number>(0);
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [smileDropped, setSmileDropped] = useState<boolean>(false);

  // Tabassumni uzluksiz ushlab turish vaqtini o'lchash (ms)
  const smileHoldTimeRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);
  const lastSoundStepRef = useRef<number>(4);
  const isCapturingRef = useRef<boolean>(false);

  // Kamera apparat oqimlarini to'xtatish
  const stopTracks = useCallback(() => {
    try {
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      // Ignore
    }
  }, [stream]);

  // Suratga olish chaqnashi va freymni muhrlash
  const triggerCapture = useCallback(() => {
    if (!videoRef.current || isCapturingRef.current) return;

    isCapturingRef.current = true;
    setIsFrozen(true);
    setIsShutterActive(true);
    sounds.playShutter();

    const photoUrl =
      detectorRef.current?.captureHighResPhoto(videoRef.current) || "";

    // Maxfiylik uchun kamera datchiklarini shu zahoti o'chirish
    stopTracks();

    setTimeout(() => {
      onPhotoCaptured(photoUrl);
    }, 650);
  }, [onPhotoCaptured, stopTracks]);

  // Jonli detektor va silliq, ishonchli 70%+ hisoblagich
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    video.play().catch((err) => console.warn("Video play error:", err));

    const detector = new SmileDetector();
    detectorRef.current = detector;

    lastTimestampRef.current = performance.now();

    video.onloadedmetadata = () => {
      detector.start(video, (res) => {
        if (isCapturingRef.current) return;

        setSmileScore(res.score);
        setIsFaceDetected(res.faceDetected);

        const now = performance.now();
        const dt = Math.min(now - lastTimestampRef.current, 80);
        lastTimestampRef.current = now;

        // 70% dan baland tabassum holati
        if (res.score >= SMILE_THRESHOLD) {
          setSmileDropped(false);
          smileHoldTimeRef.current += dt;

          // ~2.2 soniya davomida tabassum ushlab turilganda suratga olinadi
          const remainingSec = 3 - Math.floor(smileHoldTimeRef.current / 750);

          if (remainingSec <= 0) {
            setCountdown(null);
            triggerCapture();
          } else {
            setCountdown(remainingSec);
            if (remainingSec < lastSoundStepRef.current) {
              sounds.playCountdown(remainingSec);
              lastSoundStepRef.current = remainingSec;
            }
          }
        } else if (res.score >= 0.58) {
          // Kichik yorug'lik o'zgarishi paytida hisoblagich darhol o'chib ketmaydi
          // Bir oz ushlab turadi
          smileHoldTimeRef.current = Math.max(0, smileHoldTimeRef.current - dt * 0.4);
        } else {
          // Tabassum butunlay to'xtaganda orqaga hisob bekor bo'ladi
          if (smileHoldTimeRef.current > 400) {
            setSmileDropped(true);
          }
          smileHoldTimeRef.current = Math.max(0, smileHoldTimeRef.current - dt * 2);
          if (smileHoldTimeRef.current === 0) {
            setCountdown(null);
            lastSoundStepRef.current = 4;
          }
        }
      });
    };

    return () => {
      detector.stop();
    };
  }, [stream, triggerCapture]);

  const isLockingSmile = smileScore >= SMILE_THRESHOLD;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center max-w-2xl mx-auto"
    >
      {/* Kamera chaqnashi effekti */}
      {isShutterActive && (
        <div className="fixed inset-0 z-50 bg-white shutter-flash-overlay pointer-events-none" />
      )}

      {/* Yuqori yo'riqnoma */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="mb-6 space-y-1.5"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] tracking-[0.25em] uppercase mb-1">
          <Scan size={12} className="animate-spin" />
          <span>BIOMETRIK TABASSUM SKANERI (MIN 70%)</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-extralight text-slate-100 tracking-tight">
          Tabassumingizni skaner qilmoqda...
        </h2>

        <div className="text-slate-400 text-xs md:text-sm font-light tracking-wide flex items-center justify-center min-h-[24px]">
          {countdown !== null ? (
            <span className="text-rose-400 font-medium animate-pulse flex items-center gap-1.5">
              <Heart size={14} className="fill-rose-400 text-rose-400 animate-bounce" />
              Tabassum 70% dan oshdi! Kulgini ushlab turing ({countdown}s)...
            </span>
          ) : smileDropped ? (
            <span className="text-amber-400 font-medium animate-pulse">
              Tabassum 70% dan tushib ketdi... Kengroq jilmaying 😊
            </span>
          ) : isLockingSmile ? (
            <span className="text-emerald-300 font-medium animate-pulse">
              70%+ Tabassum tasdiqlandi! Shunday turing...
            </span>
          ) : (
            <span className="text-slate-400">
              Rasm tushishi uchun tabassum darajasi <strong className="text-rose-400 font-mono">70%</strong> dan yuqori bo&apos;lishi kerak 😊
            </span>
          )}
        </div>
      </motion.div>

      {/* Jonli kamera ramkasi & Skaner Effekti (Tugma sifatida ham bosish mumkin) */}
      <div
        onClick={() => {
          if (!isFrozen) triggerCapture();
        }}
        title="Tabassum bilan bosing"
        className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden glass-panel-glow p-2 transition-all duration-500 cursor-pointer group"
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover transform -scale-x-100"
          />

          {/* Skaner Lazer Nuri */}
          <motion.div
            animate={{
              top: ["0%", "96%", "0%"],
            }}
            transition={{
              duration: isLockingSmile ? 1.2 : 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-x-0 h-[2px] z-20 pointer-events-none"
            style={{
              background: isLockingSmile
                ? "linear-gradient(90deg, transparent, #fb7185, #f43f5e, #fb7185, transparent)"
                : "linear-gradient(90deg, transparent, #22d3ee, #38bdf8, #22d3ee, transparent)",
              boxShadow: isLockingSmile
                ? "0 0 16px 2px rgba(251, 113, 133, 0.85)"
                : "0 0 14px 2px rgba(34, 211, 238, 0.8)",
            }}
          />

          {/* Biometrik to'r / Skaner koordinata ramkalari */}
          <div className="absolute inset-8 border border-white/10 rounded-xl pointer-events-none flex flex-col justify-between p-2">
            <div className="flex justify-between items-start">
              <span className="font-mono text-[9px] text-cyan-400/70 tracking-widest">
                [CHEGARA: &gt;70%]
              </span>
              <span className="font-mono text-[9px] text-cyan-400/70 tracking-widest">
                FPS: 60
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="font-mono text-[9px] text-cyan-400/70 tracking-widest">
                {isLockingSmile ? "STATUS: 70%+ LOCKED" : "STATUS: SKANERLANMOQDA..."}
              </span>
              <span className="font-mono text-[9px] text-cyan-400/70 tracking-widest">
                ZOOM: 1.0X
              </span>
            </div>
          </div>

          {/* Kinoyaviy burchak nishonlari */}
          <div className={`absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 rounded-tl transition-colors duration-300 pointer-events-none ${isLockingSmile ? "border-rose-400" : "border-cyan-400"}`} />
          <div className={`absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 rounded-tr transition-colors duration-300 pointer-events-none ${isLockingSmile ? "border-rose-400" : "border-cyan-400"}`} />
          <div className={`absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 rounded-bl transition-colors duration-300 pointer-events-none ${isLockingSmile ? "border-rose-400" : "border-cyan-400"}`} />
          <div className={`absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 rounded-br transition-colors duration-300 pointer-events-none ${isLockingSmile ? "border-rose-400" : "border-cyan-400"}`} />

          {/* Holat belgisi */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-slate-200">
            <span className={`w-2 h-2 rounded-full animate-pulse ${isLockingSmile ? "bg-rose-400 shadow-[0_0_8px_#fb7185]" : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"}`} />
            <span>{isLockingSmile ? "70%+ USHLANDI" : "SKANER FAOL"}</span>
          </div>

          {/* Yuz aniqlanish holati */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider text-slate-300">
            <Sparkles size={11} className={isFaceDetected ? "text-cyan-400" : "text-slate-500"} />
            <span>{isFaceDetected ? "YUZ ANIQLANDI" : "MO'LJALGA OLINMOQDA..."}</span>
          </div>

          {/* 3 -> 2 -> 1 hisoblagich overlay (70%+ kulganda ko'rinadi) */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                key={countdown}
                initial={{ scale: 1.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none"
              >
                <div className="relative flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-rose-400 bg-black/80 shadow-[0_0_50px_rgba(251,113,133,0.7)]">
                  <span className="text-5xl font-light text-slate-100 font-mono">
                    {countdown}
                  </span>
                  <span className="text-[10px] text-rose-300 font-mono tracking-widest uppercase mt-0.5">
                    KULING (70%+) 😊
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Real vaqtdagi Tabassum Skaner Shkalasi (70% Belgisi bilan) */}
      <div className="w-full max-w-md mt-8 space-y-2">
        <div className="flex justify-between items-center text-xs font-mono tracking-wider text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            {isLockingSmile ? (
              <CheckCircle2 size={13} className="text-rose-400" />
            ) : (
              <Scan size={13} className="text-cyan-400" />
            )}
            TABASSUM DARAJASI
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-semibold text-sm transition-colors duration-200 ${
                isLockingSmile ? "text-rose-400 font-bold" : "text-cyan-300"
              }`}
            >
              {Math.round(smileScore * 100)}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">(Chegara: 70%)</span>
          </div>
        </div>

        {/* Shkala chizig'i va 70% Chegara chizig'i */}
        <div className="relative w-full h-3 rounded-full bg-slate-900 border border-slate-800">
          {/* 70% Chegara chizig'i belgisi */}
          <div
            className="absolute -top-1 bottom-0 w-[2px] bg-rose-400/90 z-20 shadow-[0_0_10px_#fb7185]"
            style={{ left: "70%" }}
          />

          {/* To'ldiriluvchi progress bar */}
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all duration-150 ${
                isLockingSmile
                  ? "bg-gradient-to-r from-cyan-400 via-rose-400 to-pink-500 shadow-[0_0_18px_rgba(251,113,133,0.9)]"
                  : "bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
              }`}
              style={{ width: `${Math.round(smileScore * 100)}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono tracking-wide pt-1">
          Kamera oldida kengroq jilmaying (ko&apos;rsatkich <strong className="text-rose-400">70%</strong> dan oshganda avtomatik rasmga oladi yoki ramkani bosing).
        </p>
      </div>
    </motion.div>
  );
};
