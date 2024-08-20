// https://stackoverflow.com/questions/36836011/checking-validity-of-string-literal-union-type-at-runtime
// TypeScript will infer a string union type from the literal values passed to
// this function. Without `extends string`, it would instead generalize them
// to the common string type.
export const StringUnion = <UnionType extends string>(
  ...values: UnionType[]
) => {
  Object.freeze(values);
  const valueSet: Set<string> = new Set(values);

  const guard = (value: string): value is UnionType => {
    return valueSet.has(value);
  };

  const check = (value: string): UnionType => {
    if (!guard(value)) {
      const actual = JSON.stringify(value);
      const expected = values.map((s) => JSON.stringify(s)).join(" | ");
      throw new TypeError(
        `Value '${actual}' is not assignable to type '${expected}'.`,
      );
    }
    return value;
  };

  const unionNamespace = { guard, check, values };
  return Object.freeze(
    unionNamespace as typeof unionNamespace & { type: UnionType },
  );
};

// Theme code
export const ThemeCodes = StringUnion(
  "blue",
  "emerald",
  "teal",
  "cyan",
  "purple",
  "orange",
  "rose",
);

export type ThemeCode = typeof ThemeCodes.type;

export interface Theme {
  code: ThemeCode;
  themeClasses: string;
  name: string;
}

export const themes: Record<ThemeCode, Theme> = {
  blue: { code: "blue", themeClasses: "blue blue-flatten", name: "Blue" },
  emerald: {
    code: "emerald",
    themeClasses: "emerald emerald-flatten",
    name: "Emerald",
  },
  teal: { code: "teal", themeClasses: "teal teal-flatten", name: "Teal" },
  cyan: { code: "cyan", themeClasses: "cyan cyan-flatten", name: "Cyan" },
  purple: {
    code: "purple",
    themeClasses: "purple purple-flatten",
    name: "Purple",
  },
  orange: {
    code: "orange",
    themeClasses: "orange orange-flatten",
    name: "Orange",
  },
  rose: { code: "rose", themeClasses: "rose rose-flatten", name: "Rose" },
};

// Language code
export const LanguageCodes = StringUnion("en", "vi", "ko");

export type LanguageCode = typeof LanguageCodes.type;

export interface Language {
  code: LanguageCode;
  name: string;
}

export const languages: Record<LanguageCode, Language> = {
  en: { code: "en", name: "English" },
  vi: { code: "vi", name: "Vietnam" },
  ko: { code: "ko", name: "Korean" },
};
