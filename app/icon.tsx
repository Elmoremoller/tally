import { ImageResponse } from "next/og";
import { offer } from "@/lib/offer";

// A placeholder favicon until there is a logo: the name's first letter in warm white on deep red.
export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          background: "#960400",
          color: "#f9f5ed",
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {offer.name.charAt(0)}
      </div>
    ),
    size,
  );
}
