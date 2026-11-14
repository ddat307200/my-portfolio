import Link from "next/link";

// Shown for unknown sub-paths inside /vi or /en (static export renders it per route).
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-4 py-20 outline-none sm:px-6">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold">Không tìm thấy trang · Page not found</h1>
      <p className="mt-6 flex gap-4">
        <Link className="text-accent underline underline-offset-4" href="/vi/" hrefLang="vi">
          Về trang chủ
        </Link>
        <Link className="text-accent underline underline-offset-4" href="/en/" hrefLang="en">
          Back to home
        </Link>
      </p>
    </main>
  );
}
