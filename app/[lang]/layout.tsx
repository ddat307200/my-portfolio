import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { copy } from "@/content/copy";
import { site, siteUrl } from "@/content/site";
import { asset } from "@/lib/base";
import { inter, mono } from "@/lib/fonts";
import { isLocale, locales } from "@/lib/i18n";
import { sharedPaths } from "@/lib/paths";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = copy[lang].meta;
  return {
    metadataBase: new URL(siteUrl),
    title: t.title,
    description: t.description,
    authors: [{ name: site.name, url: siteUrl }],
    alternates: {
      canonical: `/${lang}/`,
      languages: { vi: "/vi/", en: "/en/", "x-default": "/" },
    },
    openGraph: {
      type: "website",
      url: `/${lang}/`,
      siteName: site.name,
      title: t.title,
      description: t.description,
      locale: lang === "vi" ? "vi_VN" : "en_US",
      alternateLocale: lang === "vi" ? "en_US" : "vi_VN",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.description, images: ["/og.png"] },
    icons: { icon: { url: asset("/favicon.svg"), type: "image/svg+xml" } },
  };
}

// Runs before first paint: marks JS as available and decides whether the hero
// terminal should replay its boot sequence (not with reduced motion, once per session).
// Safety net: if the app never takes over, the static transcript is revealed after 7s.
const headScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('boot-played')){d.setAttribute('data-boot','play');setTimeout(function(){d.removeAttribute('data-boot')},7000)}}catch(e){}})();`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];

  return (
    <html lang={lang} className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script id="pre-paint" dangerouslySetInnerHTML={{ __html: headScript }} />
        {/* Entry module; heavier parts are lazy chunks it imports later (lib/client/).
            type="module" is deferred by the browser (runs after parsing), so it is not render-blocking. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script id="core" type="module" src={asset("/js/core.js")} />
      </head>
      <body className="bg-grid">
        <a href="#main" className="skip-link">
          {t.skip}
        </a>
        <Header locale={lang} sharedPaths={sharedPaths()} />
        {children}
        <Footer locale={lang} />
      </body>
    </html>
  );
}
