"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { EXPERIENCE_CONFIG } from "@/config/experience";

interface NameScreenProps {
  onContinue: (name: string) => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ onContinue }) => {
  const [name, setName] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || EXPERIENCE_CONFIG.HER_NAME;
    onContinue(finalName);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
    >
      {/* Yuqori nozik indikator */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.9 }}
        className="flex items-center gap-2 px-3.5 py-1 mb-8 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-xs tracking-[0.25em] uppercase font-mono"
      >
        <Sparkles size={12} className="text-cyan-400 animate-pulse" />
        <span>Maxfiy Syurpriz</span>
      </motion.div>

      {/* Asosiy kinoyaviy yozuvlar */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.9 }}
        className="text-slate-400 text-sm md:text-base font-light tracking-[0.2em] uppercase mb-3"
      >
        Boshlashimizdan oldin...
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="text-3xl md:text-5xl lg:text-6xl font-extralight text-slate-100 tracking-tight mb-10 max-w-xl"
      >
        Ismingiz nima?
      </motion.h1>

      {/* Glassmorphic input shakli */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="w-full max-w-sm flex flex-col items-center gap-5"
      >
        <div className="relative w-full group">
          <input
            id="guest-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ismingizni yozing..."
            autoComplete="off"
            autoFocus
            className="w-full px-6 py-4 text-center text-lg md:text-xl font-light rounded-2xl glass-input placeholder:text-slate-600 focus:outline-none"
          />
          {/* Pastki yaltirash chizig'i */}
          <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-500 ${
              isFocused ? "w-3/4 opacity-100" : "w-1/4 opacity-0"
            }`}
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative group flex items-center justify-center gap-2.5 w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-light tracking-wide border border-slate-700/60 shadow-lg shadow-black/60 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300"
        >
          <span>Davom etish</span>
          <ArrowRight
            size={16}
            className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1"
          />
        </motion.button>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="mt-12 text-xs text-slate-500 tracking-wider font-light"
      >
        Faqat siz uchun yaratilgan shaxsiy interaktiv lahza.
      </motion.p>
    </motion.div>
  );
};
