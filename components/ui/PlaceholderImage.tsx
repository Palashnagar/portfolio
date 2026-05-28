import Image from "next/image";
import fs from "fs";
import path from "path";

interface PlaceholderImageProps {
  slot: string;
  path: string;
  aspect: string;
  label: string;
}

// Server component — checks filesystem at request time
export function PlaceholderImage({ slot, path: src, aspect, label }: PlaceholderImageProps) {
  const publicPath = path.join(process.cwd(), "public", src);
  let exists = false;
  try {
    exists = fs.existsSync(publicPath);
  } catch {
    exists = false;
  }

  const [w, h] = aspect.split("/").map(Number);

  if (exists) {
    return (
      <Image
        src={src}
        alt={label}
        width={w * 400}
        height={h * 400}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center bg-[var(--bg-2)] border border-dashed border-[var(--accent)]/30 text-center p-6"
      role="img"
      aria-label={`Placeholder for ${label}`}
    >
      <div className="font-[family-name:var(--font-display)] italic text-[var(--accent)] text-xl mb-2">
        {label}
      </div>
      <div className="text-xs opacity-50 font-mono break-all">{src}</div>
      <div className="text-[10px] uppercase tracking-[0.18em] opacity-40 mt-2">
        {slot} · {aspect}
      </div>
    </div>
  );
}
