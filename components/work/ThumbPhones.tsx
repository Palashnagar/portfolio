// A "phones on cream" thumbnail composition. Used for case studies whose real
// assets are individual phone screenshots (RIT EATS) rather than a single
// composed hero image, so the thumbnail matches the others (framed phones on
// cream with a soft glow) instead of a flat full-bleed screen. Renders inside
// <LoupeThumb>, so it inherits the color-awaken + hover-scale from the .group
// ancestor. Each screenshot sits in a black phone frame so it reads as a device.

export function ThumbPhones({ screens }: { screens: string[] }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(52% 56% at 50% 50%, rgba(233,78,27,0.14), rgba(233,78,27,0) 72%), #f2e9dc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6%",
        overflow: "hidden",
      }}
    >
      {screens.map((src) => (
        <div
          key={src}
          style={{
            height: "80%",
            background: "#0b0b0c",
            borderRadius: "24px",
            padding: "4px",
            boxShadow: "0 16px 38px rgba(10, 10, 10, 0.2)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ display: "block", height: "100%", width: "auto", borderRadius: "20px" }}
          />
        </div>
      ))}
    </div>
  );
}
