"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Envelope } from "@/components/Envelope";
import { EXPERIENCE_CONFIG } from "@/config/experience";
import { Heart, ArrowRight, Download, Sparkles } from "lucide-react";

interface PhotoRevealScreenProps {
  name: string;
  photoUrl: string;
  onContinue: () => void;
}

export const PhotoRevealScreen: React.FC<PhotoRevealScreenProps> = ({
  name,
  photoUrl,
  onContinue,
}) => {
  const [hasOpened, setHasOpened] = useState(false);

  // Suratni qurilmaning o'ziga saqlab olish (100% internetsiz va mahalliy)
  const handleDownload = () => {
    if (!photoUrl) return;
    const a = document.createElement("a");
    a.href = photoUrl;
    a.download = `tabassum-${name.toLowerCase().replace(/\s+/g, "-")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center max-w-xl mx-auto"
    >
      {/* Yuqori nozik belgi */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8 flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 font-mono text-xs tracking-[0.25em] uppercase"
      >
        <Sparkles size={12} className="text-cyan-400" />
        <span>Tasdiqlangan Syurpriz</span>
      </motion.div>

      {/* 3D Konvert ko'rinishi */}
      <div className="w-full my-4">
        <Envelope
          name={name}
          photoUrl={photoUrl}
          onOpened={() => setHasOpened(true)}
        />
      </div>

      {/* Konvert ochilgandan keyingi romantik matn va amallar */}
      <AnimatePresence>
        {hasOpened && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="w-full mt-24 space-y-6"
          >
            {/* Romantik xat matni */}
            <div className="glass-panel p-5 rounded-2xl max-w-md mx-auto text-center border-white/5 space-y-2">
              <p className="text-xs md:text-sm font-light text-slate-300 italic leading-relaxed">
                &ldquo;{EXPERIENCE_CONFIG.LETTER_TEXT}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-rose-300 font-mono">
                <Heart size={12} className="fill-rose-400" />
                <span>Nodir lahza muhrlandi</span>
              </div>
            </div>

            {/* Mahalliy saqlash va Davom etish tugmalari */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {photoUrl && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass-panel text-slate-300 text-xs font-mono tracking-wider hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                >
                  <Download size={13} className="text-cyan-400" />
                  <span>Suratni telefonga saqlash</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onContinue}
                className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 text-slate-200 text-xs font-mono tracking-wider hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
              >
                <span>Davom etish</span>
                <ArrowRight
                  size={14}
                  className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
