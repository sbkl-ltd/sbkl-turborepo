/**
 * Utility functions for RTL (Right-to-Left) language support
 */

/**
 * Languages that use right-to-left text direction (ISO codes)
 */
const RTL_LANGUAGE_CODES = [
  "ar", // Arabic
  "he", // Hebrew
  "fa", // Persian/Farsi
  "ur", // Urdu
  "yi", // Yiddish
  "ps", // Pashto
  "sd", // Sindhi
  "ug", // Uyghur
  "ku", // Kurdish (some variants)
];

/**
 * Mapping of language names to ISO codes
 * Used when sourceLanguage contains full language names instead of codes
 * Handles both simple names and regional variants
 */
const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  // Arabic variants
  arabic: "ar",
  "arabic (modern standard)": "ar",
  "modern standard arabic": "ar",
  "arabic (standard)": "ar",
  "arabic (classical)": "ar",
  "arabic (egypt)": "ar",
  "arabic (saudi arabia)": "ar",
  "arabic (uae)": "ar",
  "arabic (morocco)": "ar",
  "arabic (algeria)": "ar",

  // Hebrew variants
  hebrew: "he",
  "hebrew (modern)": "he",
  "hebrew (israel)": "he",

  // Persian/Farsi variants
  persian: "fa",
  farsi: "fa",
  "persian (farsi)": "fa",
  "persian (iran)": "fa",
  "farsi (iran)": "fa",

  // Urdu variants
  urdu: "ur",
  "urdu (pakistan)": "ur",
  "urdu (india)": "ur",

  // Yiddish
  yiddish: "yi",

  // Pashto variants
  pashto: "ps",
  pushto: "ps",
  "pashto (afghanistan)": "ps",

  // Sindhi variants
  sindhi: "sd",
  "sindhi (pakistan)": "sd",

  // Uyghur variants
  uyghur: "ug",
  uighur: "ug",
  "uyghur (china)": "ug",

  // Kurdish variants
  kurdish: "ku",
  "kurdish (kurmanji)": "ku",
  "kurdish (sorani)": "ku",
};

/**
 * Check if a language code or name represents an RTL language
 * Supports:
 * - ISO codes: "ar", "ar-SA", "he"
 * - Language names: "Arabic", "Hebrew", "Persian"
 * - Regional variants: "Arabic (Egypt)", "Hebrew (Israel)"
 */
export function isRTLLanguage(
  languageCode: string | null | undefined
): boolean {
  if (!languageCode) return false;

  const normalized = languageCode.toLowerCase().trim();

  // First, check if it's an exact language name match
  if (LANGUAGE_NAME_TO_CODE[normalized]) {
    return true;
  }

  // Then check if it's an ISO code (extract base code, e.g., "ar" from "ar-SA")
  const baseLanguage = normalized.split("-")[0];
  if (baseLanguage && RTL_LANGUAGE_CODES.includes(baseLanguage)) {
    return true;
  }

  // Fallback: Check if the language name starts with any RTL language name
  // This handles cases like "Arabic - Modern" or slight variations
  const rtlLanguageNames = [
    "arabic",
    "hebrew",
    "persian",
    "farsi",
    "urdu",
    "yiddish",
    "pashto",
    "pushto",
    "sindhi",
    "uyghur",
    "uighur",
    "kurdish",
  ];

  return rtlLanguageNames.some((rtlName) => normalized.startsWith(rtlName));
}

/**
 * Get the text direction for a language
 */
export function getTextDirection(
  languageCode: string | null | undefined
): "ltr" | "rtl" {
  return isRTLLanguage(languageCode) ? "rtl" : "ltr";
}

/**
 * Detect if text contains RTL characters
 * Useful for mixed-language content
 */
export function containsRTLCharacters(text: string): boolean {
  // Unicode ranges for common RTL scripts
  const rtlRanges = [
    /[\u0600-\u06FF]/, // Arabic
    /[\u0590-\u05FF]/, // Hebrew
    /[\u0700-\u074F]/, // Syriac
    /[\u0750-\u077F]/, // Arabic Supplement
    /[\u08A0-\u08FF]/, // Arabic Extended-A
    /[\uFB50-\uFDFF]/, // Arabic Presentation Forms-A
    /[\uFE70-\uFEFF]/, // Arabic Presentation Forms-B
  ];

  return rtlRanges.some((range) => range.test(text));
}
