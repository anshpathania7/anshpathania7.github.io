import Masthead from "@/components/Masthead";
import Ticker from "@/components/Ticker";
import StopPress from "@/components/StopPress";
import NavBar from "@/components/NavBar";
import HeroStory from "@/components/HeroStory";
import { LeftRail, RightRail } from "@/components/SideRails";
import CareerArchive from "@/components/CareerArchive";
import { Classifieds, Colophon, ProjectsSection, SkillsBoard } from "@/components/Sections";

/**
 * Rendered on the server (at build time, since the site is statically
 * exported). The edition date and copyright year are resolved here and handed
 * down, so the prerendered HTML and the hydrated client agree exactly.
 */
export default function FrontPage() {
  const printed = new Date();
  const edition = printed.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="px-0 py-0 lg:px-8 lg:py-8">
      <div className="sheet mx-auto w-full max-w-[1440px] overflow-hidden">
        <Masthead edition={edition} />
        <Ticker />
        <StopPress />
        <NavBar />

        {/* ------------------------- the front page ------------------------- */}
        <section
          id="latest"
          className="scroll-mt-16 grid gap-7 px-5 py-8 sm:px-9 lg:grid-cols-[minmax(0,0.66fr)_minmax(0,1.32fr)_minmax(0,0.7fr)] lg:gap-8 lg:px-12"
        >
          <LeftRail />
          <div className="lg:col-rule-l lg:pl-8">
            <HeroStory />
          </div>
          <div className="lg:col-rule-l lg:pl-8">
            <RightRail />
          </div>
        </section>

        <CareerArchive />
        <ProjectsSection />
        <SkillsBoard />
        <Classifieds />
        <Colophon year={printed.getFullYear()} />
      </div>
    </main>
  );
}
