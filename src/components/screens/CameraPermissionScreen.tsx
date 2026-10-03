"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Camera, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";

interface CameraPermissionScreenProps {
  name: string;
  onCameraReady: (stream: MediaStream) => void;
}

export const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({
  name,
  onCameraReady,
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestCamera = async () => {
    setIsRequesting(true);
    setErrorMsg(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Kameradan foydalanish sizning brauzeringizda qo'llab-quvvatlanmaydi."
        );
      }

      // Foydalanuvchidan kameraga ochiq ruxsat so'rash
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      onCameraReady(stream);
    } catch (err: unknown) {
      console.warn("Camera request error:", err);
      setIsRequesting(false);
      const message =
        err instanceof Error
          ? err.message
          : "Kameraga ruxsat berilmadi.";
      setErrorMsg(
        message.includes("Permission denied") || message.includes("NotAllowedError")
          ? "Kameraga ruxsat berilmadi. Syurprizni davom ettirish uchun brauzer qatorida kameraga ruxsat bering."
          : "Kameraga ulanib bo'lmadi. Iltimos, boshqa ilova kamerani ishlatmayotganiga ishonch hosil qiling."
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-lg mx-auto"
    >
      {/* Yuqori sarlavha */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8"
      >
        <span className="text-xs md:text-sm font-mono tracking-[0.35em] text-cyan-400 uppercase font-semibold">
          TABASSUM HOLATI
        </span>
      </motion.div>

      {/* Dekorativ kamera ikonkasi */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full glass-panel-glow text-cyan-300">
          <Camera size={36} strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Tushuntirish matni */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-2xl md:text-3xl font-light text-slate-100 tracking-tight mb-4"
      >
        Keyingi qism uchun kamera kerak bo&apos;ladi ❤️
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.8 }}
        className="text-slate-400 text-sm md:text-base font-light leading-relaxed mb-8 max-w-md"
      >
        Siz uchun, {name}. Kutilmagan syurpriz ochilishidan oldin kichik
        tabassum tekshiruvi talab qilinadi.
      </motion.p>

      {/* Ruxsat berish tugmasi */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full max-w-xs"
      >
        <button
          id="enable-camera-button"
          onClick={requestCamera}
          disabled={isRequesting}
          className="relative group w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 text-cyan-200 font-light tracking-wider border border-cyan-500/40 shadow-xl shadow-cyan-950/40 hover:border-cyan-400 hover:text-white hover:shadow-cyan-500/20 transition-all duration-300 active:scale-95 disabled:opacity-50"
        >
          <div className="flex items-center justify-center gap-3">
            <Sparkles size={16} className="text-cyan-400" />
            <span>{isRequesting ? "Ulanmoqda..." : "Kamerani yoqish"}</span>
          </div>
        </button>
      </motion.div>

      {/* Xatolik xabari */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-start gap-2.5 p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs text-left"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Maxfiylik kafolati */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-12 flex items-center gap-2 text-xs text-slate-500 font-mono tracking-wide"
      >
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>100% Xavfsiz va Brauzeringizda. Hech qanday surat serverga yuklanmaydi.</span>
      </motion.div>
    </motion.div>
  );
};
