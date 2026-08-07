import Link from "next/link";
import { WatchlistBadge } from "@/components/watchlist/WatchlistBadge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SITE_NAME } from "@/lib/constants";

export function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-accent"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <line x1="12" y1="12" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

const navLinks = [
  { href: "/#gems", label: "Gems" },
  { href: "/#categories", label: "Categories" },
  { href: "/watchlist", label: "Watchlist" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-fg">
          <LogoMark />
          <span className="text-sm font-semibold tracking-tight">{SITE_NAME}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) =>
            link.href.startsWith("/#") ? (
              <Link
                key={link.href}
                href={link.href}
                className="hidden rounded-md px-3 py-2 text-sm text-fg/75 transition-colors hover:bg-accent-soft/30 hover:text-fg sm:inline-flex"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="hidden rounded-md px-3 py-2 text-sm text-fg/75 transition-colors hover:bg-accent-soft/30 hover:text-fg sm:inline-flex"
              >
                {link.label}
              </Link>
            )
          )}
          <WatchlistBadge />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
