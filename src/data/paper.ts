/**
 * The CV, re-set as a newspaper.
 *
 * Every role becomes a story: a kicker, a headline (with an italic clause the
 * way a broadsheet sets titles), a dek, and body copy for its own article page.
 * The CV's own bullets survive verbatim in `bullets` so nothing is lost.
 */

export type Motif =
  | "device"
  | "map"
  | "signal"
  | "grid"
  | "orbit"
  | "stack"
  | "flame"
  | "ledger";

export type Story = {
  slug: string;
  kicker: string;
  org: string;
  role: string;
  period: string;
  years: string;
  dateline: string;
  headline: string;
  /** Set in italic, following the house style for titles. */
  headlineItalic?: string;
  headlineTail?: string;
  dek: string;
  motif: Motif;
  bullets: string[];
  body: string[];
  pullQuote: string;
  tags: string[];
};

export const PERSON = {
  name: "Anshuman Pathania",
  initials: "AP",
  title: "Senior Software Developer",
  city: "Navi Mumbai",
  region: "Maharashtra, India",
  phone: "7711000305",
  email: "anshupathania7@gmail.com",
  github: "https://github.com/anshpathania7",
  githubHandle: "anshpathania7",
  linkedin: "https://www.linkedin.com/in/anshpathania7",
  linkedinHandle: "anshpathania7",
  established: "2021",
  objective:
    "Motivated and innovative Flutter developer with hands-on experience in Android development. Aiming to apply my technical knowledge and collaborative skills to create high-performance mobile applications and contribute to a productive development team.",
  disciplines: ["Flutter", "Android", "Dart"],
};

export const MASTHEAD = {
  title: "The Pathania Post",
  volume: "Vol. VI",
  issue: "No. 1",
  price: "Price: One Interview",
  strapline: "Mobile Engineering · Architecture · Developer Experience",
};

/**
 * The breaking-news strip. Edit the message and redeploy — nothing else on
 * the site needs touching. Empty message = the strip doesn't render.
 */
export const STOP_PRESS = {
  label: "Stop Press",
  message:
    "The desk is interviewing for senior Flutter, Dart and Android roles — remote or Navi Mumbai. Applications via the classifieds.",
};

/** The weather box. One is picked at random and the rest cycle. */
export const WEATHER_LINES: { head: string; detail: string }[] = [
  { head: "100% chance of shipping", detail: "Compile winds light. Visibility: full stack trace." },
  { head: "Widget showers expected", detail: "Rebuilds brief and localised. Keys advised." },
  { head: "High pressure on main", detail: "CI clear by afternoon. No breaking changes forecast." },
  { head: "Frame rate steady at 60", detail: "Occasional jank clearing before release." },
  { head: "Null safety in effect", detail: "Bring a fallback. Late initialisation possible." },
  { head: "Hotfix front approaching", detail: "Patch expected overnight. Pin your versions." },
];

/* ------------------------------------------------------------------ */
/* THE PLATES — real screenshots, where they exist                     */
/* ------------------------------------------------------------------ */

/**
 * Maps a story or project slug to a real image in `public/plates/`.
 *
 * Anything not listed here falls back to its generated engraving, so images
 * can be added one at a time. Drop the file in `public/plates/` and add a
 * line — no other change is needed:
 *
 *     "inscripts-flutter-sdk": "/plates/inscripts-sdk.png",
 *     "bonfyr":                "/plates/bonfyr-chatroom.png",
 *
 * Landscape crops around 16:10 sit best in the lead slot and the archive
 * cards; the article header crops to 21:9. Screenshots are desaturated and
 * screened automatically (see `.plate-img` in globals.css), so supply them in
 * full colour — do not pre-convert them to greyscale.
 */
export const PLATES: Record<string, string> = {};

export const plateFor = (slug: string): string | undefined => PLATES[slug];

/* ------------------------------------------------------------------ */
/* THE TICKER — skills, scored like the film ratings in the broadsheet */
/* ------------------------------------------------------------------ */

export const SKILL_SCORES: { name: string; score: string }[] = [
  { name: "Flutter", score: "9.6" },
  { name: "Dart", score: "9.5" },
  { name: "BLoC", score: "9.2" },
  { name: "Android", score: "9.1" },
  { name: "Firebase", score: "8.9" },
  { name: "MVVM", score: "8.8" },
  { name: "Kotlin", score: "8.7" },
  { name: "Data Structures", score: "8.3" },
  { name: "Java", score: "8.1" },
  { name: "Logical Reasoning", score: "8.0" },
  { name: "Python", score: "7.6" },
  { name: "C++ / Unreal", score: "7.4" },
];

/* ------------------------------------------------------------------ */
/* THE STORIES — one per post held                                     */
/* ------------------------------------------------------------------ */

export const STORIES: Story[] = [
  {
    slug: "inscripts-flutter-sdk",
    kicker: "Featured",
    org: "Inscripts Pvt. Ltd.",
    role: "Senior Software Developer",
    period: "03-02-2026 — Present",
    years: "2026",
    dateline: "Navi Mumbai",
    headline: "Flutter SDK Torn Down to the Studs, Rebuilt in",
    headlineItalic: "Pure Dart",
    dek: "Platform channels are out. A cross-platform SDK has been re-architected to run natively in Dart — with a C++ and Unreal Engine plugin bolted on, and developer experience treated as the product.",
    motif: "device",
    bullets: [
      "Architected and refactored a cross-platform Flutter SDK from platform channels to native Dart, with a C++ / Unreal Engine plugin integration",
      "Drove end-to-end SDK design with a strong focus on Developer Experience, industry-standard API conventions, and scalable testing pipelines",
      "Leveraged AI extensively across planning, architecture, and delivery cycles to ship at senior velocity",
    ],
    body: [
      "The brief was not a feature. It was a foundation. An existing cross-platform SDK had been leaning on platform channels — the bridge that lets Dart call out to native Android and iOS code — and that bridge had become the ceiling. Every capability had to be written twice, tested twice, and debugged across a boundary where stack traces go to die.",
      "The rebuild moved the SDK to native Dart. One implementation, one test surface, one place to reason about behaviour. Where the platform genuinely had to be reached, it is reached deliberately rather than by default — including a C++ and Unreal Engine plugin integration for the cases that demand it.",
      "The second half of the work was less visible and arguably more consequential: the SDK is a product whose users are engineers. API design followed industry-standard conventions rather than internal habit, error messages were written to be read by someone at two in the morning, and the testing pipeline was built to scale with the surface rather than trail behind it.",
      "AI ran throughout the cycle — not as autocomplete, but across planning, architecture review, and delivery — which is a meaningful part of how a single senior developer covered this much ground this quickly.",
    ],
    pullQuote:
      "An SDK is a product whose users are engineers. Developer experience is not the polish. It is the feature.",
    tags: ["Flutter", "Dart", "C++", "Unreal Engine", "SDK Design", "Testing"],
  },
  {
    slug: "scogo-location-stack",
    kicker: "Trending",
    org: "Scogo Networks",
    role: "Flutter Developer",
    period: "April 2025 — Jan 2026",
    years: "2025",
    dateline: "Navi Mumbai",
    headline: "Field Teams Get Their Bearings as",
    headlineItalic: "Location Stack",
    headlineTail: "Goes Live",
    dek: "GPS and location intelligence land alongside a BLoC state layer, in a product shepherded end to end — planning, development, and deployment — by a single developer.",
    motif: "map",
    bullets: [
      "Integrated Location and GPS related activities",
      "Worked on core functionalities from a business point of view",
      "Integrated BLoC pattern for seamless state management",
      "Managing whole lifecycle of product from planning, development to deployment",
    ],
    body: [
      "Location is the hardest easy feature in mobile. The API looks like three lines. Then come the permission tiers, the background execution limits, the devices that quietly throttle the GPS to save battery, and the accuracy that collapses the moment a technician walks indoors.",
      "This work put GPS and location tracking into the hands of field teams and made it behave — which meant treating the edge cases as the feature rather than as bugs to be filed later.",
      "Underneath it, the app moved onto the BLoC pattern. Events in, states out, and a UI that renders what it is told rather than deciding for itself. On a screen where a stale position is worse than no position, having one unambiguous source of truth is not architecture for its own sake.",
      "The scope ran past the code. Requirements were shaped from the business side, not handed down; the same person who planned a change wrote it, shipped it, and answered for it in production.",
    ],
    pullQuote:
      "Location is the hardest easy feature in mobile. The API is three lines. The edge cases are the product.",
    tags: ["Flutter", "BLoC", "GPS", "Geolocation", "Product Lifecycle"],
  },
  {
    slug: "appx-mobile-developer",
    kicker: "Must Read",
    org: "Appx",
    role: "Mobile Developer",
    period: "July 2024 — April 2025",
    years: "2024",
    dateline: "Navi Mumbai",
    headline: "One Developer, a Portfolio of Apps: Inside the",
    headlineItalic: "Appx",
    headlineTail: "Maintenance Floor",
    dek: "Maps, live classes and bespoke client logic shipped across a sprawling estate of Flutter and native Android applications — all of them somebody's production.",
    motif: "grid",
    bullets: [
      "Working on both Flutter and native Android for multiple applications",
      "Integrated custom solutions for clients regarding UI and business logic such as Maps, Live classes",
      "Worked and managed large number of applications maintained by organization",
    ],
    body: [
      "Maintaining one application teaches you a codebase. Maintaining many teaches you what actually generalises — and how expensive it is when something does not.",
      "The estate spanned Flutter and native Android, and the work moved between them daily. Client requests arrived as outcomes rather than specifications: a map here, live classes there, a business rule that existed in one product and had to exist in another by Friday.",
      "Live classes in particular are unforgiving. Video, real-time state, and a lecture that cannot be paused while an engineer reproduces a defect. Maps bring their own weather — tiles, markers, gestures, and the memory profile of a device three generations old.",
      "The through-line was pattern recognition. When the fifth client asks for a variation on the same feature, the correct response stops being another implementation and starts being a seam.",
    ],
    pullQuote:
      "Maintaining one app teaches you a codebase. Maintaining many teaches you what actually generalises.",
    tags: ["Flutter", "Android", "Kotlin", "Maps", "Live Video", "Multi-tenant"],
  },
  {
    slug: "appx-junior-developer",
    kicker: "Dispatch",
    org: "Appx",
    role: "Junior Mobile Developer · Contract / Internship",
    period: "Feb 2023 — July 2024",
    years: "2023",
    dateline: "Navi Mumbai",
    headline: "From the Contract Desk to Staff:",
    headlineItalic: "Appx",
    headlineTail: "Promotes From Within",
    dek: "Seventeen months across Flutter and native Android on a large maintained portfolio — the apprenticeship that made the senior post possible.",
    motif: "stack",
    bullets: [
      "Working on both Flutter and native Android for multiple applications",
      "Worked on and managed large number of applications maintained by organization",
    ],
    body: [
      "A contract that becomes a staff position is the clearest performance review there is.",
      "The work started where junior work should: inside applications that already existed, already had users, and already had opinions baked into them by people who had since moved on. Reading code you did not write, and changing it without breaking it, is the skill that separates the second year from the first.",
      "Flutter and native Android ran in parallel throughout — which meant learning where the abstraction genuinely holds and where you still have to open Android Studio and deal with the platform on its own terms.",
    ],
    pullQuote:
      "A contract that turns into a staff position is the clearest performance review there is.",
    tags: ["Flutter", "Android", "Java", "Maintenance"],
  },
  {
    slug: "sortizy-crash-reduction",
    kicker: "The Numbers",
    org: "Sortizy",
    role: "Flutter Development · Internship",
    period: "December 2022 — February 2023",
    years: "2022",
    dateline: "Navi Mumbai",
    headline: "Startup Crashes Fall",
    headlineItalic: "73 Per Cent",
    headlineTail: "After Decoupling Drive",
    dek: "An intern went after the launch path, pulled the dependencies apart, and took nearly three-quarters of the startup crashes out of the application.",
    motif: "signal",
    bullets: [
      "Built reactive UI from wireframes",
      "Learnt Platform dependent development",
      "Contributed to complex UI and features of application such as Interactive Stories (Instagram)",
      "Reduced application startup crashes by 73% by removing coupling, dependencies",
    ],
    body: [
      "Startup crashes are the worst class of defect, because the user has not yet been given a reason to try again. Whatever the application does well is never reached.",
      "The diagnosis was coupling. Too much was being constructed on the launch path, too eagerly, and each addition was another chance for something to be unavailable at exactly the moment it was demanded. The fix was unglamorous: pull the dependencies apart, defer what did not need to exist yet, and stop the boot sequence from depending on the whole world being ready at once.",
      "The result was a 73 per cent reduction in startup crashes.",
      "Elsewhere the work was pure interface craft — reactive UI built from wireframes, and an Interactive Stories feature in the mould of Instagram's, which is a deceptively hard piece of engineering: gesture handling, progress timing, preloading, and a state machine that has to survive the user tapping anywhere at any time.",
    ],
    pullQuote:
      "A startup crash is the worst kind of bug. The user never reaches the part you got right.",
    tags: ["Flutter", "Performance", "Crash Analytics", "Animation", "Gestures"],
  },
  {
    slug: "camp-yellow-payments",
    kicker: "Business",
    org: "Camp Yellow",
    role: "Software Development · Internship",
    period: "August 2022 — October 2022",
    years: "2022",
    dateline: "Navi Mumbai",
    headline: "Payments Go Live as",
    headlineItalic: "Stripe",
    headlineTail: "Integration Clears",
    dek: "Money starts moving through the application, custom modules land, and the project structure is reorganised for reuse.",
    motif: "ledger",
    bullets: [
      "Integrated Stripe Payment API",
      "Built and integrated Custom Modules",
      "Refactored project structure for better reusability",
    ],
    body: [
      "Payments are where a codebase stops being able to hide. Every failure mode has to be handled, because the failure mode is somebody's money: the declined card, the network that vanishes after the charge but before the confirmation, the user who taps twice.",
      "The Stripe integration went in with those states treated as first-class rather than as an afterthought path.",
      "Alongside it, custom modules were built and integrated, and the project structure was reorganised so that the next feature had somewhere obvious to live. Refactoring for reuse during an internship is a good instinct showing up early — the cost of a bad structure is paid by whoever arrives next.",
    ],
    pullQuote:
      "Payments are where a codebase stops being able to hide. Every failure mode is somebody's money.",
    tags: ["Flutter", "Stripe", "Payments", "Refactoring"],
  },
  {
    slug: "platos-virtual-architecture",
    kicker: "Engineering",
    org: "Platos Virtual",
    role: "Software Development Intern",
    period: "November 2021 — July 2022",
    years: "2021",
    dateline: "Navi Mumbai",
    headline: "Crash Rates Tumble When Business Logic Leaves the",
    headlineItalic: "View Layer",
    dek: "A modular restructure, Firebase and API integration, and a decoupling programme that left the project measurably more extensible than it was found.",
    motif: "orbit",
    bullets: [
      "Refactored to implement modular robust code structure and design principles",
      "Improved crashing of application by abstracting business logic",
      "Worked with integration of Firebase, APIs",
      "Improved project's extensibility by decoupling modules",
    ],
    body: [
      "There is a stage every growing application passes through where the widgets know too much. Business rules end up living next to layout code, because that is where they were needed first, and the file that renders a screen quietly becomes the file that decides what the product does.",
      "The work here was to pull those apart. Business logic was abstracted out of the view layer, modules were decoupled, and the structure was rebuilt around design principles rather than around the order in which features had happened to arrive.",
      "The crash rate improved as a direct consequence. That is not a coincidence — most of those crashes were state being mutated from somewhere nobody expected, which is a category of bug that becomes almost impossible to write once the layers are properly separated.",
      "Firebase and REST integrations went in on top of the new structure, which is the right order to do it in.",
    ],
    pullQuote:
      "Most crashes were state mutated from somewhere nobody expected — a bug that gets hard to write once the layers separate.",
    tags: ["Flutter", "Firebase", "REST APIs", "Architecture", "MVVM"],
  },
  {
    slug: "kidaura-first-build",
    kicker: "First Edition",
    org: "Kidaura",
    role: "Flutter Development · Internship",
    period: "March 2021 — November 2021",
    years: "2021",
    dateline: "Navi Mumbai",
    headline: "Built From Nothing: A",
    headlineItalic: "Cross-Platform",
    headlineTail: "Debut in GraphQL",
    dek: "The first post. A responsive, scalable application taken from empty repository to both iOS and Android, with GraphQL and state management learned in the building of it.",
    motif: "flame",
    bullets: [
      "Built a responsive, scalable application from scratch for both iOS and Android",
      "Learnt and worked with GraphQL, responsive layout and state management",
      "Structured the project with scalable, testable approach and built reusable components",
    ],
    body: [
      "Everyone's first serious project is the one where the habits get set, and this one set good ones.",
      "The application was built from an empty repository and shipped to both iOS and Android — which at that stage means learning responsive layout properly, because a phone, a tablet and a notch are three different problems wearing the same costume.",
      "GraphQL and state management were learned on the job. So was the discipline that shows up in everything after it: structuring the project to be testable before there were tests, and building components to be reused before there was a second place to use them.",
      "Read the rest of this paper and that instinct — structure first, extend later — is the thread running through every post since.",
    ],
    pullQuote:
      "Everyone's first serious project sets the habits. This one set structure-first — and it never left.",
    tags: ["Flutter", "GraphQL", "iOS", "Android", "Responsive Design"],
  },
];

/* ------------------------------------------------------------------ */

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  dek: string;
  motif: Motif;
  stack: string[];
  body: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "bonfyr",
    title: "Bonfyr",
    kicker: "Side Project",
    dek: "A chatroom-based social application where strangers gather in public rooms — profiles, image and GIF sharing, and real-time messaging on Flutter and Firebase.",
    motif: "flame",
    stack: ["Flutter", "Firebase", "Realtime Database", "Auth", "Storage"],
    body: [
      "Bonfyr is a social application built around publicly available chatrooms rather than a friend graph. You arrive, you pick a room, and you talk to whoever is there.",
      "It carries personal profiles, image and GIF sharing, and real-time message delivery, built on Flutter with Firebase behind it for authentication, storage and live data.",
      "Group chat is a deceptively good exercise: message ordering, optimistic sends, media upload progress, and a list that has to stay smooth while new items arrive at the bottom and old ones page in at the top.",
    ],
  },
];

export type OpenSource = {
  project: string;
  role: string;
  url?: string;
  fixes: string[];
};

export const OPEN_SOURCE: OpenSource[] = [
  {
    project: "Tachiyomi",
    role: "A manga reader",
    url: "https://github.com/anshpathania7/tachiyomi",
    fixes: ["Fixed dialogs in the application constantly stacking on top of each other"],
  },
  {
    project: "Open Food Facts — Smooth",
    role: "Food transparency, open data",
    fixes: [
      "Removed duplicate entries in the search query",
      "Added pull-to-refresh functionality in screen",
      "Removed the redundant refresh button from the action bar",
      "Removed the download-data dialog on refresh, as a circular indicator was already showing",
      "On back gesture, the select-product screen now pops off and resets its fields instead of returning to the previous tab",
    ],
  },
];

export type Education = {
  institution: string;
  qualification: string;
  board: string;
  year: string;
  result: string;
};

export const EDUCATION: Education[] = [
  {
    institution: "Pillai HOC College of Arts, Science and Commerce",
    qualification: "Bachelor of Science (B.Sc.), Computer Science",
    board: "University of Mumbai",
    year: "2024",
    result: "9.06",
  },
  {
    institution: "Harmony Public School and Jr. College, Kharghar",
    qualification: "Senior Secondary (XII)",
    board: "MSBSHSE",
    year: "2019",
    result: "62.77%",
  },
  {
    institution: "DAV Public School, New Panvel",
    qualification: "Secondary (X)",
    board: "CBSE",
    year: "2017",
    result: "7.8 CGPA",
  },
];

/** The activities section, set as classified advertisements. */
export const CLASSIFIEDS: { head: string; body: string }[] = [
  {
    head: "Gaming Event — Organiser Wanted, Position Filled",
    body: "Conducted a gaming event on college premises and managed multiple competing teams throughout.",
  },
  {
    head: "N.S.S. Unit Seeks Leader — Team of Ten Reporting",
    body: "Led a team of ten in the N.S.S. unit, conducting campus and locality cleanliness drives alongside public awareness programmes.",
  },
  {
    head: "Publicity Wanted for Annual Fest — 50+ Entries Delivered",
    body: "Volunteered on the publicity campaign for the college annual fest and brought in over fifty entries, the second highest total by any single person.",
  },
];

export const SKILLS = [
  "Flutter",
  "Android Development",
  "Kotlin",
  "Java",
  "Dart",
  "Firebase",
  "MVVM",
  "Data Structures and Algorithms",
  "Logical Reasoning",
  "Python",
];

/* Convenience lookups for the article routes. */
export const storyBySlug = (slug: string) => STORIES.find((s) => s.slug === slug);
export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
