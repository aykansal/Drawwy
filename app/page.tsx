import DisplayArts from "@/components/bazar/display-arts";
import PixelArtApp from "@/components/pixel-art/pixel-art-app";

export default function Home() {
  return (
    <div>
      <PixelArtApp />
      <div className="max-w-7xl mx-auto p-6 space-y-16">
        <DisplayArts />
      </div>
    </div>
  );
}
