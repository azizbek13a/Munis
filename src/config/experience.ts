export interface ExperienceConfig {
  HER_NAME: string;
  PHOTO_CAPTION: string;
  LETTER_TITLE: string;
  LETTER_SUBTITLE: string;
  LETTER_TEXT: string;
  FINAL_LEAD: string;
  FINAL_SUBLEAD: string;
  FINAL_TITLE: string;
  FINAL_TAGLINE: string;
  ACCENT_COLORS: {
    background: string;
    cyanGlow: string;
    goldGlow: string;
    roseGlow: string;
    borderCyan: string;
    textSoftWhite: string;
  };
}

export const EXPERIENCE_CONFIG: ExperienceConfig = {
  // Ko'rsatiladigan boshlang'ich ism
  HER_NAME: "Madina",

  // Xat sarlavhalari va romantik matnlar
  PHOTO_CAPTION: "Isbot muhrlandi.",
  LETTER_TITLE: "DUNYODAGI ENG GO'ZAL QIZ",
  LETTER_SUBTITLE: "Isbot muhrlandi.",
  LETTER_TEXT: "Dunyoda har narsa shiddat bilan o'zgaradi, ammo sizning tabassumingiz vaqtni to'xtatib qolishga qodir. Ba'zi lahzalar juda nodir bo'ladi, ushbu lahza esa umrbod unutilmasdir.",

  // Yakuniy ekran so'zlari
  FINAL_LEAD: "Xo'sh...",
  FINAL_SUBLEAD: "O'ylaymanki, javobimizni oldik.",
  FINAL_TITLE: "Dunyodagi eng go'zal qiz. ❤️",
  FINAL_TAGLINE: "Bu tabassumni aslo unutmang.",

  // Ranglar palitrasi
  ACCENT_COLORS: {
    background: "#050505",
    cyanGlow: "rgba(34, 211, 238, 0.22)",
    goldGlow: "rgba(245, 158, 11, 0.25)",
    roseGlow: "rgba(251, 113, 133, 0.20)",
    borderCyan: "rgba(34, 211, 238, 0.35)",
    textSoftWhite: "#f8fafc",
  },
};
