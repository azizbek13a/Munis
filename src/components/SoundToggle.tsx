"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { sounds } from "@/lib/sounds";

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(sounds.isMuted);

  const toggle = () => {
    sounds.isMuted = !sounds.isMuted;
    setMuted(sounds.isMuted);
    if (!sounds.isMuted) {
      sounds.playCountdown(1);
    }
  };

  return (
    <button
      onClick={toggle}
      title={muted ? "Unmute sounds" : "Mute sounds"}
      aria-label="Toggle sound"
      className="fixed top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full glass-panel text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition-all duration-300 active:scale-95"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
};
