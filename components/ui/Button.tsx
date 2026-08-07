import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary:
    "bg-foreground text-background hover:bg-fg/90 px-5 h-10",
  secondary:
    "border border-line text-fg hover:bg-accent-soft/40 px-5 h-10",
  ghost: "text-fg/80 hover:text-fg hover:bg-accent-soft/30 px-3 h-9",
};

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };
type ButtonAsLink = CommonProps &
  ComponentPropsWithoutRef<"a"> & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", children, className = "", ...rest } = props;

  if (props.href !== undefined) {
    const { href, ...anchorRest } = props as ButtonAsLink;
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} ${variants[variant]} ${className}`}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${className}`}
      {...(rest as ComponentPropsWithoutRef<"button">)}
    >
      {children}
    </button>
  );
}
