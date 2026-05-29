export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{
        opacity: 0.18,
        mixBlendMode: "multiply",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.65'/></svg>\")",
      }}
    />
  );
}
