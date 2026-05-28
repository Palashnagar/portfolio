import { PalashCharacter } from "@/components/character/PalashCharacter";

export default function HomePage() {
  return (
    <main className="min-h-screen p-12 grid grid-cols-3 gap-8 items-center justify-items-center">
      <PalashCharacter variant="hero-wave" decorative={false} />
      <PalashCharacter variant="thinking" />
      <PalashCharacter variant="pointing" />
      <PalashCharacter variant="peeking" />
      <PalashCharacter variant="celebrating" />
    </main>
  );
}
