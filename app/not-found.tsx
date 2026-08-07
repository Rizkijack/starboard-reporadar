import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        Off the radar
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
        This page does not exist, or the repo left our list. The radar only
        tracks what it can see.
      </p>
      <div className="mt-8">
        <Button href="/">Back to the gems</Button>
      </div>
    </div>
  );
}
