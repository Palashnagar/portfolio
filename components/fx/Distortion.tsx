import clsx from "clsx";

export function DistortionDefs() {
  return (
    <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden>
      <defs>
        <filter id="distort">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.03"
            numOctaves={2}
            seed={2}
            id="turb"
          >
            <animate
              attributeName="baseFrequency"
              dur="3s"
              values="0.015 0.03;0.04 0.06;0.015 0.03"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale={40}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function DistortThumb({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <div data-distort className="h-full w-full">
        {children}
      </div>
    </div>
  );
}
