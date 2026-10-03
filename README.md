# Smile Status — A Secret Surprise ✨

A cinematic, romantic, and mysterious interactive website designed as a personalized surprise.

![Smile Status Preview](/C:/Users/User/.gemini/antigravity-ide/brain/c4e9511d-3042-47c7-ae64-3a66ec6084b2/smile_status_preview_1791007791197.jpg)

---

## 🌟 Core Flow

1. **Name Screen**: Minimal black cinematic screen with glassmorphic input: *"Before we begin... What's your name?"*
2. **Camera Permission Screen**: Transparent privacy guarantee: *"Camera access is needed for the next part ❤️"*. Never requests or accesses hardware until the user explicitly clicks **"Enable Camera"**.
3. **Smile Detection Screen**:
   - Shows live feed inside a rounded cinematic viewport with `● CAMERA READY` indicator.
   - Prompts: *"Okay, [NAME]... Give me your biggest smile."*
   - Analyzes mouth curvature, aspect ratio, and smile expansion locally in the browser with real-time feedback gauge (`0% → 100%`).
   - Countdown `3 → 2 → 1` with sound cues and camera shutter flash.
   - Automatically shuts down camera hardware immediately after capture for privacy.
4. **Photo Reveal & 3D Envelope**:
   - Realistic luxury 3D envelope with custom wax seal *"FOR [NAME]"*.
   - Silky flap opening animation, harmonic chime, and stardust confetti.
   - Displays proof photo alongside *"THE MOST BEAUTIFUL GIRL IN THE WORLD"*, *"[NAME] ❤️"*, and *"Proof captured."*
5. **Secure Email Option**:
   - Optional button: *"Send this memory to me ❤️"*.
   - Explains: *"This will send the captured photo to the creator."*
   - Confirmation dialog: *"Send this photo to the creator's email?"*
   - Transmits to backend API route (`/api/send-memory`) sending to `amaxsutboyev@gmail.com`.
   - Feedback: *"Memory saved ❤️"*.
6. **Final Screen**:
   - *"Well... I think we have our answer."*
   - Large cinematic typography: *"[NAME] — The most beautiful girl in the world. ❤️"*
   - *"Don't forget that smile."*
   - Replay button.

---

## ⚙️ Configuration File

All personalized texts, target email, letter caption, and colors are centrally managed in:
[`src/config/experience.ts`](file:///C:/Users/User/.gemini/antigravity-ide/scratch/smile-status/src/config/experience.ts)

```ts
export const EXPERIENCE_CONFIG = {
  HER_NAME: "Her",
  EMAIL_DESTINATION: "amaxsutboyev@gmail.com",
  PHOTO_CAPTION: "Proof captured.",
  LETTER_TITLE: "THE MOST BEAUTIFUL GIRL IN THE WORLD",
  LETTER_TEXT: "They say true beauty cannot be measured, but one smile from you was all the proof needed.",
  // ...
};
```

---

## 🚀 Running the Project

```bash
cd smile-status
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in any modern desktop or smartphone browser.
# tabassum
