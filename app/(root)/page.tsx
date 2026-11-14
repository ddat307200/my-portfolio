const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Client-side language redirect: browsers set to Vietnamese go to /vi/, others to /en/.
const redirect = `(function(){var l=(navigator.languages&&navigator.languages[0])||navigator.language||'';location.replace(${JSON.stringify(
  base,
)}+(/^vi/i.test(l)?'/vi/':'/en/'));})();`;

export default function RootPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-4 px-6 text-center">
      <script id="lang-redirect" dangerouslySetInnerHTML={{ __html: redirect }} />
      <p className="text-muted">Choose a language · Chọn ngôn ngữ</p>
      <p className="flex justify-center gap-3">
        <a className="rounded-lg border border-line px-4 py-2 hover:bg-surface-2" href={`${base}/vi/`} hrefLang="vi" lang="vi">
          Tiếng Việt
        </a>
        <a className="rounded-lg border border-line px-4 py-2 hover:bg-surface-2" href={`${base}/en/`} hrefLang="en">
          English
        </a>
      </p>
    </main>
  );
}
