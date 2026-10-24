import { ImageResponse } from "next/og";
import { offer } from "@/lib/offer";

// The link preview image, drawn from lib/offer.ts: the short ad line in deep red on warm white, with the name
// under it. Built once at build time.
export const alt = `${offer.name}. ${offer.adLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "88px 96px",
          background: "radial-gradient(circle at 82% 30%, rgba(150, 4, 0, 0.16), rgba(150, 4, 0, 0) 55%), #f9f5ed",
          color: "#960400",
        }}
      >
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, lineHeight: 1.04, maxWidth: 900 }}>
          {offer.adLine}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{offer.name}</div>
      </div>
    ),
    size,
  );
}
