"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sounds } from "@/lib/sounds";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";

interface EnvelopeProps {
  name: string;
  photoUrl: string;
  onOpened?: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  name,
  photoUrl,
  onOpened,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnfurled, setHasUnfurled] = useState(false);

  const openEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    sounds.playEnvelopeChime();

    // Romantik yulduzlar va konfetti otilishi
    setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#22d3ee", "#f59e0b", "#fb7185", "#ffffff"],
        disableForReducedMotion: true,
      });
      setHasUnfurled(true);
      if (onOpened) onOpened();
    }, 1100);
  };

  // Bir necha lahzadan so'ng avtomatik ochilish
  useEffect(() => {
    const timer = setTimeout(() => {
      openEnvelope();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto flex flex-col items-center">
      {/* 3D Konvert konteyneri */}
      <div className="relative w-full aspect-[16/11] max-w-[380px] perspective-1000 select-none">
        {/* Konvert orqa asosi */}
        <div className="absolute inset-0 rounded-2xl bg-[#0c0d12] border border-cyan-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)]" />

        {/* Ichki astar va naqsh */}
        <div className="absolute inset-2 rounded-xl bg-gradient-to-b from-[#11131c] via-[#090a0f] to-[#050608] border border-white/5 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Surat va xat joylashgan karta */}
        <motion.div
          initial={{ y: 0, scale: 0.88, opacity: 0.9 }}
          animate={
            isOpen
              ? {
                  y: -130,
                  scale: 1,
                  opacity: 1,
                  zIndex: 25,
                }
              : { y: 0, scale: 0.88, opacity: 0.9, zIndex: 5 }
          }
          transition={{
            duration: 1.2,
            delay: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-x-4 top-4 bottom-4 rounded-xl glass-panel-glow p-3 flex flex-col items-center justify-between text-center overflow-hidden shadow-2xl"
        >
          {/* Surat ramkasi */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-black shadow-inner">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Muhrlangan Tabassum Isboti"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                [Surat Ko&apos;rinishi]
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Sarlavha va yozuvlar */}
          <div className="w-full py-1 text-center space-y-0.5">
            <p className="text-[10px] md:text-xs uppercase font-serif tracking-[0.25em] text-cyan-400 font-medium">
              DUNYODAGI ENG GO&apos;ZAL QIZ
            </p>
            <div className="flex items-center justify-center gap-1.5 text-base md:text-lg font-light text-slate-100">
              <span>{name}</span>
              <Heart size={14} className="fill-rose-400 text-rose-400 animate-pulse" />
            </div>
            <p className="text-[10px] font-mono tracking-widest text-slate-400">
              Isbot muhrlandi.
            </p>
          </div>
        </motion.div>

        {/* Konvert cho'ntagi (Old qismi) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
          <div className="absolute bottom-0 left-0 w-full h-[65%] bg-gradient-to-t from-[#0e0f17] to-[#141520] border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] [clip-path:polygon(0%_100%,0%_0%,50%_45%,100%_0%,100%_100%)]" />
        </div>

        {/* Yuqori buklanuvchi qopqoq (Flap) */}
        <motion.div
          initial={{ rotateX: 0 }}
          animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{ transformOrigin: "top center" }}
          className="absolute inset-x-0 top-0 h-[58%] z-20 preserve-3d"
        >
          {/* Qopqoq tashqi yuzi */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#181a24] to-[#12131b] border-b border-cyan-500/30 shadow-lg [clip-path:polygon(0%_0%,100%_0%,50%_100%)] backface-hidden flex items-start justify-center pt-2">
            <div className="w-12 h-0.5 bg-cyan-400/40 rounded-full" />
          </div>

          {/* Qopqoq ichki yuzi (Ochilganda ko'rinadi) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#101117] to-[#090a0e] [clip-path:polygon(0%_0%,100%_0%,50%_100%)] [transform:rotateX(180deg)] backface-hidden" />
        </motion.div>

        {/* Qopqoqdagi Oltin Muhr */}
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={openEnvelope}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.3 } }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-slate-950 font-serif font-semibold text-xs tracking-widest shadow-[0_0_25px_rgba(245,158,11,0.5)] border border-yellow-200/50 cursor-pointer"
            >
              <Sparkles size={11} className="text-slate-950" />
              <span>{name.toUpperCase()} UCHUN</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Yordamchi belgi */}
      {!hasUnfurled && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-xs font-mono tracking-widest text-cyan-400/80 uppercase"
        >
          {isOpen ? "Syurprizingiz ochilmoqda..." : "Ochish uchun bosing"}
        </motion.p>
      )}
    </div>
  );
};
