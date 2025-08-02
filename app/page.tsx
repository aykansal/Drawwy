import DisplayArts from "@/components/bazar/display-arts";
import PixelArtApp from "@/components/pixel-art/pixel-art-app";
import Testimonial from "@/components/testimonial";

export default function Home() {
  return (
    <div className="space-y-28">
      <PixelArtApp />
      <div className="max-w-7xl mx-auto p-6 space-y-36">
        <Testimonial />
        <DisplayArts />
      </div>
    </div>
  );
}
