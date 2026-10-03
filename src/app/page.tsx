"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AmbientBackground } from "@/components/AmbientBackground";
import { SoundToggle } from "@/components/SoundToggle";
import { NameScreen } from "@/components/screens/NameScreen";
import { CameraPermissionScreen } from "@/components/screens/CameraPermissionScreen";
import { SmileDetectionScreen } from "@/components/screens/SmileDetectionScreen";
import { PhotoRevealScreen } from "@/components/screens/PhotoRevealScreen";
import { FinalScreen } from "@/components/screens/FinalScreen";
import { EXPERIENCE_CONFIG } from "@/config/experience";

type FlowStep = "name" | "permission" | "detection" | "reveal" | "final";

export default function SmileStatusPage() {
  const [step, setStep] = useState<FlowStep>("name");
  const [guestName, setGuestName] = useState<string>(EXPERIENCE_CONFIG.HER_NAME);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");

  // 1. Name provided
  const handleNameContinue = (name: string) => {
    setGuestName(name);
    setStep("permission");
  };

  // 2. Camera permission granted
  const handleCameraReady = (mediaStream: MediaStream) => {
    setStream(mediaStream);
    setStep("detection");
  };

  // 3. Photo successfully captured
  const handlePhotoCaptured = (capturedDataUrl: string) => {
    setPhotoUrl(capturedDataUrl);
    setStep("reveal");
  };

  // 4. Reveal finished -> go to final conclusion
  const handleRevealContinue = () => {
    setStep("final");
  };

  // 5. Replay experience
  const handleReplay = () => {
    if (stream) {
      try {
        stream.getTracks().forEach((t) => t.stop());
      } catch {
        // Ignore
      }
    }
    setStream(null);
    setPhotoUrl("");
    setStep("name");
  };

  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex flex-col justify-center">
      {/* Visual Ambiance */}
      <AmbientBackground />

      {/* Audio Mute/Unmute Control */}
      <SoundToggle />

      {/* Dynamic Screen Flow */}
      <AnimatePresence mode="wait">
        {step === "name" && (
          <NameScreen key="name-screen" onContinue={handleNameContinue} />
        )}

        {step === "permission" && (
          <CameraPermissionScreen
            key="permission-screen"
            name={guestName}
            onCameraReady={handleCameraReady}
          />
        )}

        {step === "detection" && stream && (
          <SmileDetectionScreen
            key="detection-screen"
            name={guestName}
            stream={stream}
            onPhotoCaptured={handlePhotoCaptured}
          />
        )}

        {step === "reveal" && (
          <PhotoRevealScreen
            key="reveal-screen"
            name={guestName}
            photoUrl={photoUrl}
            onContinue={handleRevealContinue}
          />
        )}

        {step === "final" && (
          <FinalScreen
            key="final-screen"
            name={guestName}
            onReplay={handleReplay}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
