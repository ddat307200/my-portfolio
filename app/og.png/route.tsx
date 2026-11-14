import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Rendered once at build time into out/og.png (static Open Graph image, 1200x630).
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0B0C",
          backgroundImage: "radial-gradient(circle at 80% 10%, rgba(224,138,95,0.14), transparent 55%)",
          color: "#EDEDED",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#9A9AA0" }}>
          <svg width="40" height="40" viewBox="0 0 24 24">
            <path
              fill="#E08A5F"
              d="M12 2.5c.4 4.6 2.4 7.6 9.5 9.5-7.1 1.9-9.1 4.9-9.5 9.5-.4-4.6-2.4-7.6-9.5-9.5 7.1-1.9 9.1-4.9 9.5-9.5Z"
            />
          </svg>
          {site.domain}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{site.name}</div>
          <div style={{ fontSize: 40, color: "#9A9AA0", lineHeight: 1.3 }}>
            Web tools and AI automation for repetitive work.
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: 160, background: "#E08A5F", borderRadius: 3 }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
