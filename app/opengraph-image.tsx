import { ImageResponse } from "next/og";
import { WORDMARK_ON_DARK } from "@/components/brand/paths";
import { offer } from "@/lib/offer";

// The link preview image, drawn from lib/offer.ts: the short ad line in off white on deep slate blue, set in
// the heading serif, with a soft sky glow and the off white wordmark under it. Built once at build time.
export const alt = `${offer.name}. ${offer.adLine}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const [, , w, h] = WORDMARK_ON_DARK.viewBox.split(" ").map(Number);
const LOGO_H = 104;

/** The heading serif (app/fonts.ts), only the letters of the ad line, as the TrueType file the image needs. */
async function headingFont(): Promise<ArrayBuffer | null> {
  try {
    const query = `family=Instrument+Serif&text=${encodeURIComponent(offer.adLine)}`;
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null; // Offline: the image falls back to its default face rather than failing the build.
  }
}

export default async function Image() {
  const font = await headingFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px 72px",
          background: "radial-gradient(circle at 84% 22%, rgba(174, 202, 232, 0.34), rgba(174, 202, 232, 0) 52%), #48596b",
          color: "#efeae4",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Heading", fontSize: 104, lineHeight: 1.02, maxWidth: 940 }}>
          {offer.adLine}
        </div>
        <svg width={Math.round((LOGO_H * w) / h)} height={LOGO_H} viewBox={WORDMARK_ON_DARK.viewBox}>
          <path fill="#efeae4" fillRule="evenodd" d={WORDMARK_ON_DARK.d} />
        </svg>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Heading", data: font, style: "normal", weight: 400 }] : undefined },
  );
}
