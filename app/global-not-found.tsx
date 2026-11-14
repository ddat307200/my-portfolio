import type { Metadata } from "next";
import "./globals.css";
import { inter, mono } from "@/lib/fonts";
import { basePath } from "@/lib/base";

export const metadata: Metadata = {
  title: "404 · Dang Tien Dat",
  robots: { index: false },
};

// Site-wide 404 (out/404.html), shown by the host for any unknown URL.
export default function GlobalNotFound() {
  return (
    <html lang="vi" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6 py-20">
          <p className="font-mono text-sm text-accent">404</p>
          <h1 className="mt-3 text-3xl font-semibold">Không tìm thấy trang</h1>
          <p className="mt-2 text-muted" lang="en">
            Page not found
          </p>
          <p className="mt-8 flex gap-6">
            <a className="text-accent underline underline-offset-4" href={`${basePath}/vi/`} hrefLang="vi">
              Về trang chủ
            </a>
            <a className="text-accent underline underline-offset-4" href={`${basePath}/en/`} hrefLang="en" lang="en">
              Back to home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
