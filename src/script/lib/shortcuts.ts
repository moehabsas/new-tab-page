import { is_url, favicon_path } from "utils/urls";

/**
 * Shortcut interface.
 */
interface Shortcut {
  /**
   * Website base url.
   */
  url: string;

  /**
   * Website title.
   */
  title: string;

  /**
   * Website favicon href.
   */
  favicon: string;

  /**
   * Pinned or not.
   */
  pined: boolean;

  /**
   * Description. __optional__
   */
  desc?: string;
}

/**
 * Shortcuts local storage key.
 */
const storage_key = "shortcuts";

/**
 * Stored shortcuts list.
 */
const stored = ((): Shortcut[] => {
  const stringify = localStorage.getItem(storage_key);
  if (!stringify) return [];

  try {
    const parsed = JSON.parse(stringify);

    return Array.isArray(parsed)
      ? parsed.filter(s => s.title && s.url && s.favicon && is_url(s.url))
      : [];
  } catch {
    localStorage.removeItem(storage_key);
  }

  return [];
})();

/**
 * Shortcuts list.
 *
 * @min_length 7
 */
const shortcuts = ((): Shortcut[] => {
  const recommended: Shortcut[] = [
    {
      title: "DeepSeek",
      url: "https://chat.deepseek.com",
      favicon: favicon_path("deepseek"),
      pined: true
    },
    {
      title: "TikTok",
      url: "https://www.tiktok.com",
      favicon: favicon_path("tiktok"),
      pined: true
    },
    {
      title: "YouTube",
      url: "https://www.youtube.com",
      favicon: favicon_path("youtube"),
      pined: true
    },
    {
      title: "Facebook",
      url: "https://www.facebook.com",
      favicon: favicon_path("facebook"),
      pined: true
    },
    {
      title: "Quran",
      url: "https://mp3quran.net",
      favicon: favicon_path("mp3quran"),
      pined: true
    },
    {
      title: "Instagram",
      url: "https://www.instagram.com",
      favicon: favicon_path("instagram"),
      pined: true
    },
    {
      title: "ChatGPT",
      url: "https://chat.openai.com",
      favicon: favicon_path("openai"),
      pined: true
    }
  ];

  if (stored.length < 1) return recommended;

  const map = new Map<string, Shortcut>();
  [...stored, ...recommended].forEach(shortcut => {
    map.set(shortcut.url, shortcut);
  });

  return Array.from(map.values());
})();

// Add pins to shortcuts container.
const elem = document.getElementById("shortcuts");
if (elem) {
  const fragment = document.createDocumentFragment();

  shortcuts
    .filter(i => i.pined)
    .slice(0, 7)
    .forEach(({ url, title, favicon }) => {
      const li = document.createElement("li");

      const a = document.createElement("a");
      a.href = url;
      a.title = title;
      a.target = "_top";

      const div = document.createElement("div");

      const img = document.createElement("img");
      img.src = favicon;
      img.alt = title;
      img.onerror = () => {
        img.onerror = null;
        img.src = favicon_path("default");
      };

      div.appendChild(img);

      const p = document.createElement("p");
      p.textContent = title;

      a.appendChild(div);
      a.appendChild(p);
      li.appendChild(a);
      fragment.appendChild(li);
    });

  elem.appendChild(fragment);
}
