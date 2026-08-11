import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavTabs from "@/components/NavTabs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finding E.T — UAP Sightings Tracker",
  description:
    "Aggregating public sighting reports and space data, filtering out the known, and highlighting the genuinely unexplained.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="starfield" aria-hidden="true" />

        <header className="border-b border-panel-border/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="glow-title font-mono text-2xl font-bold tracking-[0.25em] text-accent sm:text-3xl">
                FINDING E.T
              </h1>
              <p className="mt-1 text-sm text-muted">
                Let the known pass through. Catch the strange.
              </p>
            </div>

            <NavTabs />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-panel-border/60 py-4 text-center text-xs text-muted">
          Finding E.T aggregates public reports — it does not detect objects
          itself. Phase 1 uses sample data in the style of NUFORC reports.
        </footer>
      </body>
    </html>
  );
}
