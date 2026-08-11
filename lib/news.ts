import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/lib/types";

// Data-access layer for the Latest Signals feed. Aggregates public RSS
// feeds server-side, so no keys and no client-side CORS issues. Adding or
// removing a source is a one-line change to SOURCES.

const SOURCES: Array<{ name: string; url: string }> = [
  { name: "The Debrief", url: "https://thedebrief.org/feed/" },
  { name: "Space.com", url: "https://www.space.com/feeds/all" },
  { name: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
  { name: "Universe Today", url: "https://www.universetoday.com/feed/" },
];

// The "net" for news: anything matching these is tagged as a UAP signal.
const SIGNAL_KEYWORDS = [
  "uap",
  "ufo",
  "unidentified",
  "anomalous",
  "aaro",
  "interstellar",
  "'oumuamua",
  "oumuamua",
  "borisov",
  "3i/atlas",
  "alien",
  "extraterrestrial",
  "technosignature",
  "seti",
];

export function isUapSignal(text: string): boolean {
  const t = text.toLowerCase();
  return SIGNAL_KEYWORDS.some((k) => t.includes(k));
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8216;|&lsquo;/g, "'")
    .replace(/&#8220;|&ldquo;|&#8221;|&rdquo;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface RawRssItem {
  title?: string | { "#text"?: string };
  link?: string;
  pubDate?: string;
  description?: string;
  guid?: string | { "#text"?: string };
}

function text(v: string | { "#text"?: string } | undefined): string {
  if (!v) return "";
  return typeof v === "string" ? v : (v["#text"] ?? "");
}

async function fetchSource(source: {
  name: string;
  url: string;
}): Promise<NewsItem[]> {
  const res = await fetch(source.url, {
    // Refresh each feed at most every 30 minutes
    next: { revalidate: 1800 },
    headers: { "user-agent": "FindingET/1.0 (+https://finding-e-t.vercel.app)" },
  });
  if (!res.ok) throw new Error(`${source.name} responded ${res.status}`);
  const xml = await res.text();

  const parsed = new XMLParser({ ignoreAttributes: true }).parse(xml) as {
    rss?: { channel?: { item?: RawRssItem | RawRssItem[] } };
  };
  const rawItems = parsed.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .map((item): NewsItem | null => {
      const title = stripHtml(text(item.title));
      const link = (item.link ?? "").trim();
      const published = item.pubDate ? new Date(item.pubDate) : null;
      if (!title || !link || !published || isNaN(published.getTime()))
        return null;
      const summary = stripHtml(item.description ?? "");
      return {
        id: text(item.guid) || link,
        title,
        link,
        publishedAt: published.toISOString(),
        summary,
        source: source.name,
        uapSignal: isUapSignal(`${title} ${summary}`),
      };
    })
    .filter((i): i is NewsItem => i !== null);
}

export interface SignalsFeed {
  items: NewsItem[];
  /** Names of sources that failed to load this time */
  failedSources: string[];
}

export async function getLatestSignals(): Promise<SignalsFeed> {
  // Fetch all sources in parallel; one broken feed shouldn't sink the page
  const results = await Promise.allSettled(SOURCES.map(fetchSource));

  const items = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 60);

  const failedSources = SOURCES.filter(
    (_, i) => results[i].status === "rejected"
  ).map((s) => s.name);

  return { items, failedSources };
}
