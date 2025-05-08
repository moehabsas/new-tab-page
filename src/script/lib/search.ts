import { translate } from "./translator";
import { visit, favicon_path, is_url } from "utils/urls";

/**
 * Search engine interface.
 */
interface SearchEngine {
  /**
   * Search engine title.
   */
  readonly title: string;

  /**
   * Search engine base URL ends with `[param]=`.
   */
  readonly url: string;
}

/**
 * Search form interface.
 */
interface HTMLSearchFormElement extends HTMLFormElement {
  /**
   * A reference to the input element where the user enters the search query.
   */
  readonly input_box: HTMLInputElement;

  /**
   * A reference to the image element that displays the search engine favicon associated with the search.
   */
  readonly favicon: HTMLImageElement;
}

/**
 * Search engine local storage key.
 */
const storage_key = "search-engine";

/**
 * Default search engine.
 */
const default_engine = "google";

/**
 * Provided search engines.
 */
const engines: Dictionary<SearchEngine> = {
  google: {
    title: "Google",
    url: "https://www.google.com/search?q="
  },
  bing: {
    title: "Microsoft Bing",
    url: "https://www.bing.com/search?q="
  },
  you: {
    title: "You",
    url: "https://you.com/search?q="
  },
  openai: {
    title: "ChatGPT",
    url: "https://chat.openai.com?q="
  },
  duckduckgo: {
    title: "DuckDuckGo",
    url: "https://duckduckgo.com?q="
  },
  tiktok: {
    title: "TikTok",
    url: "https://www.tiktok.com/search?q="
  },
  facebook: {
    title: "Facebook",
    url: "https://www.facebook.com/search/top?q="
  }
};

/**
 * Search form element.
 */
const form = document.getElementById("search_form") as HTMLSearchFormElement;

/**
 * The currently selected search engine.
 */
let current_engine = localStorage.getItem(storage_key);
if (!current_engine || !engines[current_engine]) {
  current_engine = default_engine;
  localStorage.setItem(storage_key, default_engine);
}

/**
 * The type of the current input value.
 */
let value_type: "str" | "url" = "str";

/**
 * Get trimmed form input value.
 *
 * @returns Form input value.
 */
const search_value = (): string => form.input_box.value.trim();

/**
 * Apply search engine.
 *
 * Updates the search form to reflect the current search engine.
 */
const apply_engine = (): void => {
  form.favicon.src = favicon_path(current_engine);

  const { title } = engines[current_engine];
  form.input_box.setAttribute("data-msargs", title);
  form.input_box.placeholder = translate(
    form.input_box.getAttribute("data-msid") as string,
    [title]
  );
};

/**
 * Handel form submission.
 *
 * @param event - The from submit event.
 */
form.addEventListener("submit", (event: SubmitEvent): void => {
  event.preventDefault();
  const q = search_value();
  if (!q) return; // Do nothing if the query is empty

  if (value_type === "url") {
    visit(/^[a-z]+:\/\//.test(q) ? q : "http://" + q);
  } else {
    const { url } = engines[current_engine] || engines[default_engine];

    visit(url + encodeURIComponent(q));
  }
});

/**
 * Handles the error event for the search engine favicon.
 *
 * If the favicon fails to load, this function sets the `src` attribute
 * to a default favicon path and prevents further error handling loops
 * by setting `onerror` to `null`.
 */
form.favicon.addEventListener("error", () => {
  form.favicon.onerror = null;
  form.favicon.src = favicon_path("default");
});

/**
 * Handel search form value type.
 *
 * This function determines whether the input is a URL or a string
 * and updates the form's `data-value-type` attribute accordingly.
 */
form.input_box.addEventListener("input", (): void => {
  const new_value_type = is_url(search_value()) ? "url" : "str";
  if (value_type !== new_value_type) {
    value_type = new_value_type;
    form.setAttribute("data-value-type", new_value_type);
  }
});

form.input_box.dispatchEvent(new Event("input"));
apply_engine();
