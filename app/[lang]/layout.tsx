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
// should animate (not with reduced motion, and only once per browser session).
// Safety net: if the app never takes over, the final text is revealed after 6s.
const headScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('hero-played')){d.setAttribute('data-hero','play');setTimeout(function(){d.removeAttribute('data-hero')},6000)}}catch(e){}})();`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = copy[lang];

  return (
    <html lang={lang} className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script id="pre-paint" dangerouslySetInnerHTML={{ __html: headScript }} />
        {/* The only script the published site loads (see lib/client/enhance.ts). */}
        <script id="enhance" src={asset("/enhance.js")} defer />
      </head>
      <body>
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
