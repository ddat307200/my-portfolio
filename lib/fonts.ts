import { Inter, JetBrains_Mono } from "next/font/google";

// Self-hosted at build time by next/font; no font request goes to a CDN at runtime.
export const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "optional",
  variable: "--font-inter",
});

export const mono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  display: "optional",
  variable: "--font-jetbrains",
  // Preloaded too: both fonts arrive together, so the page re-lays-out once, not twice.
});
