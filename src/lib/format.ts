import type { Locale } from "./i18n";
import { createOrdinalFunction } from "./ordinals";

const englishOrdinal = createOrdinalFunction("en", {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
});

/** e.g. "3rd season" / "3-й сезон" */
export function formatSeasonTitle(season: number, locale: Locale): string {
  return locale === "ru" ? `${season}-й сезон` : `${englishOrdinal(season)} season`;
}

/** The primary date line, matching the home page hero. */
export function formatPrimeDate(
  date: { year: number; season: number; day: number },
  locale: Locale,
): string {
  const day = date.day + 1;
  if (locale === "ru") {
    return date.season === 0
      ? `${day}-й праздничный день ${date.year}\u00A0года`
      : `${day}-й день ${date.season}-го сезона ${date.year}\u00A0года`;
  }
  return date.season === 0
    ? `${englishOrdinal(day)} festival day, year ${date.year}`
    : `${englishOrdinal(day)} day of Season ${date.season}, year ${date.year}`;
}

/** e.g. "Year 42 of 4th cycle" / "42-й год 4-го цикла" */
export function formatCycle(
  date: { cycleInfo: () => { year: number; cycle: number } },
  locale: Locale,
): string {
  const { year, cycle } = date.cycleInfo();
  return locale === "ru"
    ? `${year}-й год ${cycle}-го цикла`
    : `Year ${year} of ${englishOrdinal(cycle)} cycle`;
}

/** Full localized Gregorian date, e.g. "September 27, 2026" / "27 сентября 2026 г." */
export function formatGregorianDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
