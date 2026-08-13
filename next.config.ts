import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Anchor Turbopack's filesystem root to the project root so it resolves
  // node_modules correctly when the repo lives in a git worktree subfolder.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
