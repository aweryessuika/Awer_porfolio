import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import Marquee from "@/components/Marquee";
import WorkIndex from "@/components/work/WorkIndex";
import ProjectGully from "@/components/work/ProjectGully";
import ProjectBen10 from "@/components/work/ProjectBen10";
import Contact from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      <main className="relative">
        <Hero />
        <Manifesto />
        <Marquee />
        <WorkIndex />
        <ProjectGully />
        <ProjectBen10 />
        <Contact />
      </main>
    </>
  );
}
