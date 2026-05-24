import CustomCursor from "@/components/CustomCursor";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Statement from "@/components/Statement";
import GullyLabsVideo from "@/components/GullyLabsVideo";
import Ben10Statement from "@/components/Ben10Statement";
import Ben10Reel from "@/components/Ben10Reel";
import FinalCredits from "@/components/FinalCredits";

export default function Home() {
  return (
    <main className="relative bg-[#050505] min-h-screen">
      <CustomCursor />
      
      {/* Scroll-animated canvas + text overlays sequence */}
      <ScrollyCanvas />

      <div className="relative -mt-[100vh] z-20">
        {/* Massive typography statement */}
        <Statement />

        {/* High-end cinematic video reveal */}
        <GullyLabsVideo />

        {/* Inverted high-contrast typographic statement */}
        <Ben10Statement />

        {/* 3D phone reel */}
        <Ben10Reel />

        {/* Final cinematic outro section */}
        <FinalCredits />
      </div>
    </main>
  );
}
