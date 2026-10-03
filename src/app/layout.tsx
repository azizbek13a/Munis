import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Smile Status — Maxfiy Syurpriz ✨",
  description:
    "Faqat siz uchun tayyorlangan kinoyaviy va romantik interaktiv syurpriz.",
  keywords: ["Smile Status", "Romantik", "Syurpriz", "Maxfiy"],
  openGraph: {
    title: "Smile Status",
    description: "Siz uchun maxsus tayyorlangan kutilmagan lahza.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark">
      <body className="bg-[#050505] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
