"use client";

import React from "react";
import { motion } from "framer-motion";
import { RotateCcw, Heart, Sparkles } from "lucide-react";

interface FinalScreenProps {
  name: string;
  onReplay: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({ name, onReplay }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center max-w-xl mx-auto"
    >
      {/* Yurak emblemasi */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="relative mb-10"
      >
        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl animate-pulse" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full glass-panel border-rose-500/30 text-rose-400">
          <Heart size={24} className="fill-rose-400" />
        </div>
      </motion.div>

      {/* Kirish so'zlari */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.9 }}
        className="text-slate-400 text-sm md:text-base font-light tracking-[0.25em] uppercase mb-2"
      >
        Xo&apos;sh...
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.9 }}
        className="text-slate-300 text-base md:text-lg font-light tracking-wide mb-10"
      >
        O&apos;ylaymanki, javobimizni oldik.
      </motion.p>

      {/* Ism va Asosiy E'tirof */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.4, duration: 1.1 }}
        className="space-y-4 mb-12"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight">
          {name}
        </h1>

        <div className="flex items-center justify-center gap-2">
          <p className="text-lg md:text-2xl font-extralight text-rose-200/90 tracking-wide font-serif">
            Dunyodagi eng go&apos;zal qiz. ❤️
          </p>
        </div>
      </motion.div>

      {/* Yodda tutish eslatmasi */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 1 }}
        className="text-cyan-400/80 font-mono text-xs md:text-sm tracking-[0.2em] uppercase mb-12 flex items-center justify-center gap-2"
      >
        <Sparkles size={13} className="text-cyan-400" />
        <span>Bu tabassumni aslo unutmang.</span>
      </motion.p>

      {/* Qayta ko'rish tugmasi */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReplay}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full glass-panel text-slate-300 text-xs md:text-sm font-mono tracking-widest uppercase hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300"
        >
          <RotateCcw size={14} className="text-cyan-400" />
          <span>Qayta ko&apos;rish</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
