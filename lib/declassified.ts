import { aggregateRssSources, type SignalsFeed } from "@/lib/news";

// Data layer for the Declassified page.
//
// US government sources (AARO, National Archives, CIA reading room) publish
// declassified records but offer no RSS feeds, so they are linked as official
// sources on the page. The Black Vault — the largest civilian archive of US
// government documents obtained under the Freedom of Information Act — does
// publish a feed of newly released records, and stands in as the live wire.
const DECLASSIFIED_SOURCES = [
  {
    name: "The Black Vault",
    url: "https://www.theblackvault.com/documentarchive/feed/",
  },
];

export function getDeclassifiedReleases(): Promise<SignalsFeed> {
  // Single source, so the per-source cap matches the overall limit
  return aggregateRssSources(DECLASSIFIED_SOURCES, 40, 40);
}
