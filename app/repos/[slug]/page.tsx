import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RepoDetail } from "@/components/repo/RepoDetail";
import { getRelated, getRepoBySlug, getRepos } from "@/lib/data";
import { SITE_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getRepos().map((repo) => ({ slug: repo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const repo = getRepoBySlug(slug);
  if (!repo) return { title: "Repo not found" };

  return {
    title: repo.name,
    description: repo.tagline,
    openGraph: {
      title: `${repo.name} | ${SITE_NAME}`,
      description: repo.tagline,
      images: repo.images.screenshot
        ? [{ url: repo.images.screenshot }]
        : undefined,
    },
  };
}

export default async function RepoPage({ params }: Props) {
  const { slug } = await params;
  const repo = getRepoBySlug(slug);
  if (!repo) notFound();

  const related = getRelated(repo, 3);

  return <RepoDetail repo={repo} related={related} />;
}
