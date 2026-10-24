import { ImageResponse } from "next/og";
import { ICON } from "@/components/brand/paths";

// The home screen icon: the off white T from the favicon on a dusty blue square. The phone rounds the
// corners itself, so the square runs to the edges.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#7a90a8" }}>
        <svg width="180" height="180" viewBox={ICON.viewBox}>
          <path fill="#efeae4" fillRule="evenodd" d={ICON.t} />
        </svg>
      </div>
    ),
    size,
  );
}
