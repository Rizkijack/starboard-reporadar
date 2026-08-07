import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { THEME_SCRIPT } from "@/components/layout/ThemeScript";
import { WatchlistProvider } from "@/components/watchlist/WatchlistProvider";
import { SITE_NAME } from "@/lib/constants";
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
  title: {
    default: `${SITE_NAME} | Hidden gems, tracked like radar`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A hand-curated list of undervalued GitHub repositories with real potential. Browse, sort, and watch the ones worth following.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <WatchlistProvider>
          <Navbar />
          <div className="radar-bg" aria-hidden="true" />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </WatchlistProvider>
      </body>
    </html>
  );
}
