import { ImageResponse } from "next/og";
import { offer } from "@/lib/offer";

// A placeholder home screen icon until there is a logo: the name's first letter in warm white on deep red.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#960400",
          color: "#f9f5ed",
          fontSize: 112,
          fontWeight: 700,
        }}
      >
        {offer.name.charAt(0)}
      </div>
    ),
    size,
  );
}
