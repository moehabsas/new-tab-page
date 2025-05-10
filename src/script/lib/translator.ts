import ar from "locales/ar.json";

/**
 * Locale interface.
 */
interface Locale {
  /**
   * Language title.
   */
  name: string;

  /**
   * Language translation messages.
   */
  trans: Dictionary;
}

/**
 * Active language local storage key.
 */
const storage_key = "lang";

/**
 * Default language.
 */
const default_locale = "ar";

/**
 * Provided languages.
 */
const locales: Dictionary<Locale> = {
  ar: { name: "العربية", trans: ar },
  en: { name: "English-US", trans: {} }
};

/**
 * The currently selected language.
 */
let current_locale = localStorage.getItem(storage_key);
if (!current_locale || !locales[current_locale]) {
  current_locale = default_locale;
  localStorage.setItem(storage_key, default_locale);
}

/**
 * Get message text using the current language.
 *
 * @param msid - The message ID to get translation.
 * @param msargs - Arguments to replace placeholders in the message. __optional__
 * @returns The message or the original message id if no message is found.
 */
export const translate = (msid: string, msargs: string[] = []): string => {
  const ms = locales[current_locale]?.trans[msid] || msid;
  return ms.replace(/\$(\d+)/g, (_, i: string) => msargs[+i] || "...");
};

/**
 * Initializes the page localization settings and applies translations.
 *
 * This function sets the `lang` and `dir` attributes of the HTML document
 * based on the currently selected language. It also translates all elements
 * with the `data-msid` attribute by replacing their text content or placeholder
 * with the corresponding translation.
 */
const apply_translations = (): void => {
  // Set HTML element `lang` and `dir` attributes.
  document.documentElement.setAttribute("lang", current_locale);
  document.documentElement.setAttribute(
    "dir",
    current_locale === "ar" ? "rtl" : "ltr"
  );

  // Translate page
  document.querySelectorAll("[data-msid]").forEach(elem => {
    const ms = translate(
      elem.getAttribute("data-msid")!,
      elem.getAttribute("data-msargs")?.split(",") || []
    );

    if (elem instanceof HTMLInputElement) elem.placeholder = ms;
    else elem.textContent = ms;
  });
};

apply_translations();
