export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

/** A value given in both languages. */
export type L<T = string> = Record<Locale, T>;

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const otherLocale = (l: Locale): Locale => (l === "vi" ? "en" : "vi");
