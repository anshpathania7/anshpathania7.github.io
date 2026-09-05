import Link from "next/link";
import { MASTHEAD } from "@/data/paper";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="sheet w-full max-w-xl border-2 border-ink px-8 py-12 text-center">
        <div className="kicker text-stamp">Stop press</div>
        <h1 className="headline mt-4 text-[clamp(2rem,6vw,3.2rem)]">
          Not in <em className="italic">today&apos;s</em> edition
        </h1>
        <p className="dek mx-auto mt-4 max-w-[38ch]">
          That page was never set, or it has been pulled from the run. The front page is still
          on the stands.
        </p>
        <Link
          href="/"
          className="kicker mt-8 inline-block border-2 border-ink bg-ink px-5 py-3 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
        >
          Back to the front page
        </Link>
        <div className="mt-8 border-t border-rule pt-4">
          <span className="kicker text-ink-faint">{MASTHEAD.title}</span>
        </div>
      </div>
    </main>
  );
}
