"use client";

// Central icon barrel. Marked as client so server components never
// evaluate @phosphor-icons/react (which calls createContext at module scope).
export {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Eye,
  EyeSlash,
  MagnifyingGlass,
  Moon,
  Star,
  Sun,
} from "@phosphor-icons/react";
