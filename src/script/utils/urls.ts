/**
 * URL pattern.
 */
const pattern = new RegExp(
  "^([a-z]+:\\/\\/\\/?)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$", // fragment
  "i"
);

/**
 * Validates whether a given string is a valid URL.
 *
 * @param string - The string to validate.
 * @returns `true` if the string is a valid URL, otherwise `false`.
 */
export const is_url = (string: string): boolean => pattern.test(string);

/**
 * Navigates to a specified URL.
 *
 * @param href - The base URL.
 */
export const visit = (href: string): void => {
  if (!window.open(href, "_top")) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_top";
    a.click();
  }
};

/**
 * Generates the full pathname for a website's favicon.
 *
 * @param domain - The website domain.
 * @returns The full path to the favicon image.
 * @example
 * "example" => "public/favicons/example.png";
 */
export const favicon_path = (domain: string): string =>
  `public/favicons/${domain}.png`;
