import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

interface ImageGroupProps {
  caption?: string;
  images: { src: string; label: string; aspect?: string }[];
}

export function ImageGroup({ caption, images }: ImageGroupProps) {
  return (
    <figure className="my-10">
      <div
        className={`grid gap-4 ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-lg overflow-hidden bg-[var(--bg-2)]"
            style={{ aspectRatio: img.aspect ?? "4/3" }}
          >
            <PlaceholderImage
              slot="case-study"
              path={img.src}
              aspect={img.aspect ?? "4/3"}
              label={img.label}
            />
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm italic opacity-65">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
