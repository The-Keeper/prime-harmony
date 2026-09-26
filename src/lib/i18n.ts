export type Locale = "en" | "ru";

export const LOCALES: Locale[] = ["ru", "en"];

export const LANGUAGE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
};

export const DEFAULT_LOCALE: Locale = "en";

/** Coerce whatever `Astro.currentLocale` gives us into a supported locale. */
export function resolveLocale(value: string | null | undefined): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE;
}

export interface ConverterStrings {
  g2p: string;
  p2g: string;
  gregorianDate: string;
  year: string;
  season: string;
  festival: string;
  invalidCalendarDate: string;
}

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

export interface FaqItem {
  question: string;
  answer?: string;
  items?: string[];
  open?: boolean;
}

export interface LocaleContent {
  title: string;
  nav: { what: string };
  hero: { whatButton: string; solsticeTitle: string };
  convert: { title: string; converter: ConverterStrings };
  what: {
    title: string;
    alwaysTitle: string;
    perennial: string;
    cycles: string;
    equalSeasons: string;
    howTitle: string;
    fourSeasons: string;
    leap: string;
  };
  features: Feature[];
  faq: FaqItem[];
  theme: { toLight: string; toDark: string };
}

const en: LocaleContent = {
  title: "Prime Harmony",
  nav: { what: "What is this?" },
  hero: { whatButton: "What is this?", solsticeTitle: "Solstice festival" },
  convert: {
    title: "Date conversion",
    converter: {
      g2p: "Gregorian → Prime Harmony",
      p2g: "Prime Harmony → Gregorian",
      gregorianDate: "Gregorian date",
      year: "Year",
      season: "Season",
      festival: "Festival",
      invalidCalendarDate: "Invalid calendar date",
    },
  },
  what: {
    title: "What is this?",
    alwaysTitle: "Calendar that is always up-to-date",
    perennial: "Perennial system",
    cycles: "128-year cycles with natural precision",
    equalSeasons: "Seasons of equal length",
    howTitle: "How does it work?",
    fourSeasons: "Four 90-day seasons + 5–6 holidays",
    leap: "Leap year is when year number in the cycle is prime",
  },
  features: [
    { icon: "🔄", title: "Perennial", text: "You don't need to replace calendars." },
    {
      icon: "🌍",
      title: "In harmony with nature",
      text: "Seasons are anchored to the winter solstice, and the mean year matches the mean tropical year.",
    },
    {
      icon: "📐",
      title: "Accurate",
      text: "Drift from the mean tropical year is less than a day in 50,000 years.",
    },
    {
      icon: "📅",
      title: "Cyclical timekeeping",
      text: "Time is a spiral, not a line. Dates repeat each 128 years.",
    },
    {
      icon: "🔥",
      title: "Solstice festival",
      text: "New year is five or six out-of-season days placed around the winter solstice.",
    },
    {
      icon: "🔢",
      title: "Mathematical harmony",
      text: "Not just a calendar but a mathematical spell.",
    },
  ],
  faq: [
    {
      question: "Why no months?",
      answer:
        "Each season could be divided into three months, in which case we would get the usual 12 months, but there is no need for division, as the length of the seasons is the same and is conveniently divided by 10.",
      open: true,
    },
    {
      question: "Why no day names?",
      answer:
        "If 10-day weeks (decades) are used, there is little need to name the days of the week, as the calendar is constant and is always clear what day it is by the last digit.",
    },
    {
      question: "Why are the seasons equal?",
      answer:
        "Equal 90-day seasons keep the calendar simple and the mean year accurate, but they cannot all begin exactly at an equinox or solstice: the real astronomical seasons are slightly unequal.",
    },
    {
      question: "Is this serious?",
      items: [
        "It is a mathematical and design experiment, not a replacement for the civil calendar. It arose from an observation: 31 leap years per 128 years is the fraction 31/128, which approximates the fractional part of the tropical year very closely, and there are exactly 31 primes below 128 — hence the rule.",
        "Its practical use is as a secondary, seasonal calendar — including fantasy worlds and tabletop games: seasons start at the winter solstice and the mean year closely matches the tropical year.",
        "The math is real: 31 leap years per 128-year cycle, and 31/128 ≈ 0.24219 is a convergent of the tropical-year fraction.",
      ],
    },
  ],
  theme: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },
};

const ru: LocaleContent = {
  title: "Первичная гармония",
  nav: { what: "Что это?" },
  hero: { whatButton: "Что это?", solsticeTitle: "Солнцестояние" },
  convert: {
    title: "Конвертирование дат",
    converter: {
      g2p: "Григорианский → Первичная гармония",
      p2g: "Первичная гармония → Григорианский",
      gregorianDate: "Григорианская дата",
      year: "Год",
      season: "Сезон",
      festival: "Фестиваль",
      invalidCalendarDate: "Некорректная дата календаря",
    },
  },
  what: {
    title: "Что это?",
    alwaysTitle: "Календарь, который не\u00A0устаревает",
    perennial: "Вечная система без ежегодных обновлений",
    cycles: "128-летние циклы с естественной точностью",
    equalSeasons: "Сезоны одинаковой длины",
    howTitle: "Как это работает?",
    fourSeasons: "Четыре сезона по 90 дней + 5–6 праздничных дней",
    leap: "Високосный год, когда номер года в цикле — простое число",
  },
  features: [
    {
      icon: "🔄",
      title: "Многолетний",
      text: "Не требует ежегодной замены: один календарь на всю жизнь.",
    },
    {
      icon: "🌍",
      title: "В гармонии с природой",
      text: "Начало сезонов привязано к зимнему солнцестоянию, а средняя длина года совпадает со средним тропическим годом.",
    },
    {
      icon: "📐",
      title: "Точный",
      text: "Отклонение от среднего тропического года — менее суток за 50\u00A0000 лет.",
    },
    {
      icon: "📅",
      title: "Цикличное летоисчисление",
      text: "Время — это спираль, а не линия, даты повторяются через 128 лет.",
    },
    {
      icon: "🔥",
      title: "Фестиваль солнцестояния",
      text: "Новый год — 5–6 дней вне сезонов, приуроченных к зимнему солнцестоянию.",
    },
    {
      icon: "🔢",
      title: "Математическая гармония",
      text: "Не просто календарь, а математическое заклинание, превращающее время в песню.",
    },
  ],
  faq: [
    {
      question: "Почему нет месяцев?",
      answer:
        "Каждый сезон можно было бы разделить на три месяца, и в таком случае получить привычные 12 месяцев, однако в делении нет особой необходимости, поскольку длина сезонов одинакова и удобно делится на 10.",
      open: true,
    },
    {
      question: "Почему нет названий дней недели?",
      answer:
        "Если люди используют 10-дневные недели (декады), то в названиях дней недели нет особой необходимости, т.к. календарь постоянный и всегда понятно какой это день по последней цифре.",
    },
    {
      question: "Почему сезоны равные?",
      answer:
        "Равные 90-дневные сезоны делают календарь простым, а среднюю длину года — точной, но не все сезоны могут начинаться ровно в равноденствие или солнцестояние: реальные астрономические сезоны чуть неравны.",
    },
    {
      question: "Это серьёзно?",
      items: [
        "Это математический и дизайнерский эксперимент, а не попытка заменить гражданский календарь. Он возник из наблюдения: 31 високосный год на 128 лет — это дробь 31/128, которая очень точно приближает дробную часть длины тропического года, а среди чисел до 128 ровно 31 простое — отсюда и правило.",
        "Практическая ценность — как «второй», сезонный календарь, в том числе для фэнтези-миров и настольных игр: сезоны начинаются у зимнего солнцестояния, а средняя длина года близка к тропической.",
        "Математика при этом настоящая: 31 високосный год на 128-летний цикл, а 31/128 ≈ 0,24219 — подходящая дробь разложения тропического года.",
      ],
    },
  ],
  theme: { toLight: "Переключить на светлую тему", toDark: "Переключить на тёмную тему" },
};

const content: Record<Locale, LocaleContent> = { en, ru };

export function getContent(locale: Locale): LocaleContent {
  return content[locale] ?? content.en;
}
