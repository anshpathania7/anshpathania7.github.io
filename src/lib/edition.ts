export type Edition = "morning" | "night";

export const EDITION_KEY = "pathania-post-edition";

/**
 * Runs blocking in <head>, before first paint.
 *
 * Without this the document paints in the default (morning) palette and then
 * snaps to night on hydration — a white flash straight into the reader's eyes,
 * which is the one thing a dark mode must never do. Kept as a raw string so it
 * ships inline rather than as a fetched module.
 */
export const EDITION_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem(${JSON.stringify(EDITION_KEY)});
    var night = stored
      ? stored === "night"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", night ? "dark" : "light");
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;
