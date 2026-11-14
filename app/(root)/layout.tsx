import type { Metadata } from "next";
import "../globals.css";
import { siteUrl } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Dang Tien Dat",
  robots: { index: false, follow: true },
  alternates: {
    languages: { vi: "/vi/", en: "/en/", "x-default": "/" },
  },
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
