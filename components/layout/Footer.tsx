import Link from "next/link";
import { LogoMark } from "@/components/layout/Navbar";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5">
          <LogoMark />
          <div>
            <p className="text-sm font-medium text-fg">Starboard Reporadar</p>
            <p className="text-xs text-muted">
              Hand-picked GitHub gems. No database, no account.
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-sm text-fg/70">
          <Link href="/about" className="transition-colors hover:text-fg">
            How we curate
          </Link>
          <Link href="/watchlist" className="transition-colors hover:text-fg">
            Watchlist
          </Link>
        </nav>
      </div>
    </footer>
  );
}
