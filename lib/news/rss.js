// Minimal RSS 2.0 reader for public news-search feeds. Two sources per query:
// Google News (broad coverage, no images) and Bing News (thumbnails, direct
// article links). No dependencies; the feeds are stable enough that a small
// tag parser is safer than a full XML library for five fields.
//
// After merging, items that still have no picture get one from the article
// page itself (its og:image tag), a few at a time, with a short timeout and
// an in-memory cache so a slow publisher never holds the feed up for long.

import { resolveGoogleLinks } from "./gnews.js";

const GOOGLE_BASE = "https://news.google.com/rss/search";
const BING_BASE = "https://www.bing.com/news/search";
const UA = "Mozilla/5.0 (compatible; NYCWire/1.0; +https://tobedeveloped.vercel.app)";

export function googleFeedUrl(query) {
  const params = new URLSearchParams({ q: query, hl: "en-US", gl: "US", ceid: "US:en" });
  return `${GOOGLE_BASE}?${params.toString()}`;
}

export function bingFeedUrl(query) {
  const params = new URLSearchParams({ q: query, format: "rss", mkt: "en-US" });
  return `${BING_BASE}?${params.toString()}`;
}

// Kept for callers that only know the old name.
export const feedUrl = googleFeedUrl;

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function attr(block, tagName, attrName) {
  const m = block.match(new RegExp(`<${tagName}[^>]*\\s${attrName}=["']([^"']+)["']`, "i"));
  return m ? decode(m[1]) : "";
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Bing wraps article links in a redirect with the real URL in ?url=.
function unwrapLink(link) {
  try {
    const u = new URL(link);
    if (u.hostname.endsWith("bing.com")) {
      const real = u.searchParams.get("url");
      if (real) return real;
    }
  } catch {}
  return link;
}

function stripSourceSuffix(title, source) {
  if (source && title.endsWith(` - ${source}`)) return title.slice(0, -(source.length + 3));
  return title;
}

export function parseRss(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const rawTitle = tag(block, "title");
    const source = tag(block, "source") || tag(block, "News:Source");
    const title = stripSourceSuffix(rawTitle, source);
    const link = unwrapLink(tag(block, "link"));
    const pubDate = tag(block, "pubDate");
    const ts = Date.parse(pubDate);
    const image =
      tag(block, "News:Image") ||
      attr(block, "media:content", "url") ||
      attr(block, "media:thumbnail", "url") ||
      attr(block, "enclosure", "url") ||
      "";
    const sourceUrl = attr(block, "source", "url");
    const domain = hostOf(sourceUrl) || (hostOf(link).includes("google.com") ? "" : hostOf(link));
    if (!title || !link) continue;
    items.push({
      title,
      link,
      source: source || domain,
      domain,
      image: image || null,
      publishedAt: Number.isFinite(ts) ? new Date(ts).toISOString() : null,
    });
  }
  return items;
}

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

// Merge lists in priority order. The first occurrence of a headline wins,
// but a later duplicate can fill in a missing image, domain or date.
export function mergeItems(lists, { limit = 40, maxAgeDays = 21 } = {}) {
  const byKey = new Map();
  const cutoff = Date.now() - maxAgeDays * 86400000;
  for (const list of lists) {
    for (const it of list) {
      const key = normalizeTitle(it.title).slice(0, 80);
      if (!key) continue;
      if (it.publishedAt && Date.parse(it.publishedAt) < cutoff) continue;
      const prev = byKey.get(key);
      if (!prev) {
        byKey.set(key, { ...it });
      } else {
        if (!prev.image && it.image) prev.image = it.image;
        if (!prev.domain && it.domain) prev.domain = it.domain;
        if (!prev.publishedAt && it.publishedAt) prev.publishedAt = it.publishedAt;
        // A direct publisher link beats a Google redirect for the same story.
        if (hostOf(prev.link).includes("google.com") && !hostOf(it.link).includes("google.com")) {
          prev.link = it.link;
        }
      }
    }
  }
  const out = Array.from(byKey.values());
  out.sort((a, b) => (Date.parse(b.publishedAt || 0) || 0) - (Date.parse(a.publishedAt || 0) || 0));
  return out.slice(0, limit);
}

async function readFeed(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return parseRss(await res.text());
  } catch {
    return [];
  }
}

// ---------- Article images (og:image) ----------

const OG_CACHE = new Map(); // link -> { image, until }
const OG_TTL_MS = 6 * 3600 * 1000;
const OG_TIMEOUT_MS = 5000;
const OG_MAX_BYTES = 160000;

function pickOgImage(html, base) {
  const head = html.split(/<\/head>/i)[0] || html;
  const metas = head.match(/<meta\s+[^>]*>/gi) || [];
  const keys = ["og:image:secure_url", "og:image", "twitter:image", "twitter:image:src"];
  for (const key of keys) {
    for (const m of metas) {
      if (!new RegExp(`(?:property|name)=["']${key}["']`, "i").test(m)) continue;
      const c = m.match(/content=["']([^"']+)["']/i);
      if (!c || !c[1]) continue;
      try {
        const u = new URL(decode(c[1]), base);
        if (u.protocol === "https:" || u.protocol === "http:") return u.toString();
      } catch {}
    }
  }
  return null;
}

async function fetchOgImage(link) {
  const cached = OG_CACHE.get(link);
  if (cached && cached.until > Date.now()) return cached.image;

  let image = null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OG_TIMEOUT_MS);
  try {
    const res = await fetch(link, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: ctrl.signal,
      cache: "no-store",
    });
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.includes("html") && res.body) {
      // Read only the head of the page; the meta tags are at the top.
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let html = "";
      while (html.length < OG_MAX_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        html += dec.decode(value, { stream: true });
        if (/<\/head>/i.test(html)) break;
      }
      reader.cancel().catch(() => {});
      image = pickOgImage(html, res.url || link);
    }
  } catch {
    image = null;
  } finally {
    clearTimeout(timer);
  }
  OG_CACHE.set(link, { image, until: Date.now() + OG_TTL_MS });
  return image;
}

// Fill missing images for the first `max` items that have a direct publisher
// link, `concurrency` at a time. Google redirect links are skipped: they do
// not resolve to the article without a browser.
export async function enrichImages(items, { max = 20, concurrency = 6 } = {}) {
  const targets = items
    .filter((it) => !it.image && it.link && !hostOf(it.link).includes("google.com"))
    .slice(0, max);
  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, targets.length) }, async () => {
    while (next < targets.length) {
      const it = targets[next++];
      it.image = await fetchOgImage(it.link);
    }
  });
  await Promise.all(workers);
  return items;
}

export async function fetchTopic(topic, { fresh = false } = {}) {
  // Bing first so its direct links and thumbnails win on duplicates; Google
  // fills the gaps. Either source failing leaves the other intact.
  const bing = await Promise.all(topic.queries.map((q) => readFeed(bingFeedUrl(q))));
  const google = await Promise.all(topic.queries.map((q) => readFeed(googleFeedUrl(q))));
  // Google links are redirects with no usable page behind them; swap them
  // for the publisher URL first, then look up article images.
  const items = mergeItems([...bing, ...google]);
  const resolve = await resolveGoogleLinks(items, { fresh });
  await enrichImages(items);
  // Non-index property: invisible to JSON.stringify of the array, readable
  // by the feed route for its diagnostics field.
  items.resolveStats = resolve;
  return items;
}
