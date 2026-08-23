import { XMLParser } from "fast-xml-parser";
import type { NewsItem } from "@/lib/types";

// Shared RSS aggregation layer. Both the Latest Signals page and the
// Declassified page use aggregateRssSources() with their own source lists —
// adding or removing a source is a one-line change to the relevant list.

export interface RssSource {
  name: string;
  url: string;
}

const NEWS_SOURCES: RssSource[] = [
  { name: "The Debrief", url: "https://thedebrief.org/feed/" },
  { name: "Space.com", url: "https://www.space.com/feeds/all" },
  { name: "NASA", url: "https://www.nasa.gov/rss/dyn/breaking_news.rss" },
  { name: "Universe Today", url: "https://www.universetoday.com/feed/" },
  // SETI-adjacent: the SETI Institute itself publishes no RSS feed, so this
  // long-running deep-space/SETI blog stands in as the closest reliable feed
  { name: "Centauri Dreams", url: "https://www.centauri-dreams.org/feed/" },
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

async function fetchSource(source: RssSource): Promise<NewsItem[]> {
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

export async function aggregateRssSources(
  sources: RssSource[],
  limit = 60,
  // Cap per source so prolific daily feeds can't drown out weekly ones —
  // without this, a 100-item feed pushes a 10-item feed out of the cut
  perSourceLimit = 12
): Promise<SignalsFeed> {
  // Fetch all sources in parallel; one broken feed shouldn't sink the page
  const results = await Promise.allSettled(
    sources.map(async (s) => {
      const items = await fetchSource(s);
      if (items.length === 0)
        throw new Error(`${s.name} returned no parseable items`);
      return items
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, perSourceLimit);
    })
  );

  const items = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);

  const failedSources = sources.filter(
    (_, i) => results[i].status === "rejected"
  ).map((s) => s.name);

  return { items, failedSources };
}

export function getLatestSignals(): Promise<SignalsFeed> {
  return aggregateRssSources(NEWS_SOURCES);
}
