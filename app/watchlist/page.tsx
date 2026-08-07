import type { Metadata } from "next";
import { WatchlistPage } from "@/components/watchlist/WatchlistPage";
import { getRepos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Watchlist",
  description:
    "Your locally stored watchlist of GitHub repos worth following.",
};

export default function Watchlist() {
  const repos = getRepos();
  return <WatchlistPage repos={repos} />;
}
