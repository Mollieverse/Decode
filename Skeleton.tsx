"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("skeleton", className)} />
  );
}

export function SkeletonText({ lines = 3, className }: SkeletonProps) {
  const widths = ["w-full", "w-5/6", "w-4/5", "w-3/4", "w-2/3"];
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5 rounded-md",
            widths[i % widths.length]
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-3.5 w-32 mb-2 rounded-md" />
          <Skeleton className="h-2.5 w-20 rounded-md" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonExplanation() {
  return (
    <div className="flex flex-col gap-3 py-2">
      <SkeletonText lines={4} />
      <div className="h-px bg-purple-100 my-1" />
      <SkeletonText lines={3} />
      <div className="h-px bg-purple-100 my-1" />
      <SkeletonText lines={2} />
    </div>
  );
}
